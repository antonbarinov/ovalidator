let errors = [];
let validationObjLink = null;


function doValidateObject(schema, objToValidate, currentPath = '', isArrayKey = false, arrayKey) {
    // Check for unexpected fields
    if (!Array.isArray(objToValidate)) {
        for (const key in objToValidate) {
            if (objToValidate.hasOwnProperty !== undefined && !objToValidate.hasOwnProperty(key)) continue;
            if (schema[ key ] === undefined) {
                const path = currentPath ? currentPath + '.' + key : key;
                errors.push(`${path} is unexpected`);
            }
        }
    }

    for (const key in schema) {
        if (objToValidate.hasOwnProperty !== undefined && !schema.hasOwnProperty(key)) continue;

        const validator = schema[ key ];

        if (typeof validator === 'object') {
            let path;
            if (!isArrayKey) {
                path = currentPath ? currentPath + '.' + key : key;
            } else {
                path = currentPath ? currentPath + '[' + arrayKey + ']' : '[' + arrayKey + ']';
            }

            validationObjLink = objToValidate;

            if (validator.__isValidator === true) {
                const value = typeof validationObjLink === 'object' ? validationObjLink[ key ] : undefined;
                const res = validator.__validate(value, validationObjLink, key, path);

                if (res !== true) {
                    errors = [...errors, ...res];
                }
            } else {
                validationObjLink = typeof validationObjLink === 'object' ? validationObjLink[ key ] : {};
                doValidate(validator, validationObjLink, path);
            }
        } else if (Array.isArray(validator)) {
            doValidate(validator, objToValidate, currentPath);
        }
    }
}

function doValidateArrayOfPrimitives(schema, objToValidate, currentPath = '', validator) {
    validationObjLink = objToValidate;

    if (Array.isArray(objToValidate)) {
        if (validator.__isRequired) {
            if (objToValidate.length === 0) {
                errors.push(`${currentPath} can not be empty array`);
            }
        }

        for (let i = 0; i < objToValidate.length; i++) {
            const path = currentPath ? currentPath + '[' + i + ']' : i;

            const value = validationObjLink[ i ];
            const res = validator.__validate(value, validationObjLink, i, path);
            if (res !== true) {
                errors = [...errors, ...res];
            }
        }
    } else if (objToValidate == undefined) {
        if (validator.__isRequired) {
            const path = currentPath;
            const value = undefined;

            const res = validator.__validate(value, validationObjLink, undefined, path);
            if (res !== true) {
                errors = [...errors, ...res];
            }
        }
    } else {
        if (validator.__isRequired) {
            errors.push(`${currentPath} must be array`);
            //validator.__errors.push(`${currentPath} must be array`);
        }
    }
}

function doValidateArrayOfObjects(schema, objToValidate, currentPath = '') {
    if (Array.isArray(objToValidate)) {
        for (let i = 0; i < objToValidate.length; i++) {
            doValidateObject(schema, objToValidate, currentPath, true, i);
        }
    } else if (objToValidate === undefined) {
        doValidateObject(schema, {}, currentPath, true, 0);
    }
}

function doValidate(schema, objToValidate, currentPath = '') {
    if (Array.isArray(schema)) {
        if (!schema.length) return;
        const validator = schema[ 0 ];

        if (typeof validator === 'object' && validator.__isValidator !== true) {
            doValidateArrayOfObjects(schema, objToValidate, currentPath);
        } else if (typeof validator === 'object' && validator.__isValidator === true) {
            doValidateArrayOfPrimitives(schema, objToValidate, currentPath, validator);
        }
    } else if (typeof schema === 'object') {
        doValidateObject(schema, objToValidate, currentPath);
    }
}

/**
 * @param schema
 * @param objToValidate
 * @returns {Array}
 */
function Validate(schema, objToValidate) {
    errors = [];
    validationObjLink = null;

    doValidate(schema, objToValidate);

    return errors;
}


module.exports = Validate;