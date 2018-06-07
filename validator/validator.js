function Validator() {
    this.__isValidator = true;
    this.__isRequired = false;
    this.__default = undefined;

    this.__functions = [];
    this.__errors = [];
}

function addTypesFunction(func) {
    if (this.__functions.length) {
        if (this.__isRequired) {
            this.__functions.splice(1, 0, func);
        } else {
            this.__functions.splice(0, 0, func);
        }
    } else {
        this.__functions.push(func);
    }
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/**
 * Check that value must be !== undefined
 * @param errMsg
 * @returns {Validator}
 */
Validator.prototype.required = function(
    // Error string function
    errMsg = (objPathStr) => {
        return `${objPathStr} is required`;
    })
{
    if (this.__isRequired) return this;

    const func = (value, object, key, objPathStr = '') => {
        if (value === undefined) {
            this.__errors.push(errMsg(objPathStr));

            return false;
        }
    };

    this.__functions = [ func, ...this.__functions ];

    this.__isRequired = true;

    return this;
};

/**
 * Check that value is integer
 * @param errMsg
 * @returns {Validator}
 */
Validator.prototype.typeInteger = function(
    // Error string function
    errMsg = (objPathStr) => {
        return `${objPathStr} must be integer`;
    })
{
    const func = (value, object, key, objPathStr = '') => {
        if (parseInt(value) !== value) {
            this.__errors.push(errMsg(objPathStr));

            return false;
        }
    };

    addTypesFunction.call(this, func);

    return this;
};

/**
 * Check that value is float
 * @param errMsg
 * @returns {Validator}
 */
Validator.prototype.typeFloat = function(
    // Error string function
    errMsg = (objPathStr) => {
        return `${objPathStr} must be float`;
    })
{
    const func = (value, object, key, objPathStr = '') => {
        if (parseFloat(value) !== value) {
            this.__errors.push(errMsg(objPathStr));

            return false;
        }
    };

    addTypesFunction.call(this, func);

    return this;
};

/**
 * Check that value is object with any structure inside
 * @param errMsg
 * @returns {Validator}
 */
Validator.prototype.typeObject = function(
    // Error string function
    errMsg = (objPathStr) => {
        return `${objPathStr} must be object`;
    })
{
    const func = (value, object, key, objPathStr = '') => {
        if (typeof value !== 'object' || Array.isArray(value)) {
            this.__errors.push(errMsg(objPathStr));

            return false;
        }
    };

    addTypesFunction.call(this, func);

    return this;
};

/**
 * Check that value is string
 * @param errMsg
 * @returns {Validator}
 */
Validator.prototype.typeString = function(
    // Error string function
    errMsg = (objPathStr) => {
        return `${objPathStr} must be string`;
    })
{
    const func = (value, object, key, objPathStr = '') => {
        if (typeof value !== 'string') {
            this.__errors.push(errMsg(objPathStr));

            return false;
        }
    };

    addTypesFunction.call(this, func);

    return this;
};

/**
 * Check that integer or float more than ${minValue}
 * @param minValue
 * @param errMsg
 * @returns {Validator}
 */
Validator.prototype.min = function (minValue,
                                    // Error string function
                                    errMsg = (objPathStr, minValue) => {
                                        return `${objPathStr} must be greater than ${minValue}`;
                                    })
{
    if (typeof minValue !== 'number') throw `Validator: .min(${minValue}) argument must be numeric`;

    const func = (value, object, key, objPathStr = '') => {
        if (value < minValue) {
            this.__errors.push(errMsg(objPathStr, minValue));
        }
    };

    this.__functions.push(func);

    return this;
};

/**
 * Check that value must be email
 * @param errMsg
 * @returns {Validator}
 */
Validator.prototype.email = function (
                                    // Error string function
                                    errMsg = (objPathStr) => {
                                        return `${objPathStr} must be email`;
                                    })
{
    const func = (value, object, key, objPathStr = '') => {
        if (!validateEmail(value)) {
            this.__errors.push(errMsg(objPathStr));
        }
    };

    this.__functions.push(func);

    return this;
};

/**
 * Set default value if not passed
 * @param value
 * @returns {Validator}
 */
Validator.prototype.default = function (value) {
    this.__default = value;

    return this;
};

/**
 * Check that string length more than ${minValue}
 * @param minValue
 * @param errMsg
 * @returns {Validator}
 */
Validator.prototype.minLength = function (minValue,
                                    // Error string function
                                    errMsg = (objPathStr, minValue) => {
                                        return `${objPathStr} length must be greater than ${minValue}`;
                                    })
{
    if (typeof minValue !== 'number') throw `Validator: .minLength(${minValue}) argument must be numeric`;

    const func = (value, object, key, objPathStr = '') => {
        if (value.length < minValue) {
            this.__errors.push(errMsg(objPathStr, minValue));
        }
    };

    this.__functions.push(func);

    return this;
};

/**
 * Check that integer or float less than ${maxValue}
 * @param maxValue
 * @param errMsg
 * @returns {Validator}
 */
Validator.prototype.max = function (maxValue,
                                    // Error string function
                                    errMsg = (objPathStr, maxValue) => {
                                        return `${objPathStr} must be less than ${maxValue}`;
                                    })
{
    if (typeof maxValue !== 'number') throw `Validator: .max(${maxValue}) argument must be numeric`;

    const func = (value, object, key, objPathStr = '') => {
        if (value > maxValue) {
            this.__errors.push(errMsg(objPathStr, maxValue));
        }
    };

    this.__functions.push(func);

    return this;
};

/**
 * Check that integer or float less than ${maxValue}
 * @param maxValue
 * @param errMsg
 * @returns {Validator}
 */
Validator.prototype.maxLength = function (maxValue,
                                    // Error string function
                                    errMsg = (objPathStr, maxValue) => {
                                        return `${objPathStr} length must be less than ${maxValue}`;
                                    })
{
    if (typeof maxValue !== 'number') throw `Validator: .maxLength(${maxValue}) argument must be numeric`;

    const func = (value, object, key, objPathStr = '') => {
        if (value.length > maxValue) {
            this.__errors.push(errMsg(objPathStr, maxValue));
        }
    };

    this.__functions.push(func);

    return this;
};

/**
 * Check that field is valid for RegExp
 * @param regExp
 * @param errMsg
 * @returns {Validator}
 */
Validator.prototype.regexp = function (regExp,
                                          // Error string function
                                          errMsg = (objPathStr, regExp) => {
                                              return `${objPathStr} must be valid for regular expression ${regExp}`;
                                          })
{
    if (regExp instanceof RegExp === false) throw `Validator: .regexp(${regExp}) argument must be RegExp`;

    const func = (value, object, key, objPathStr = '') => {
        if (!regExp.test(value.toString())) {
            this.__errors.push(errMsg(objPathStr, regExp));
        }
    };

    this.__functions.push(func);

    return this;
};


/**
 * Check that field is valid for custom function
 * @param customFunc
 * @param errMsg
 * @returns {Validator}
 */
Validator.prototype.customFunction = function (customFunc,
                                       // Error string function
                                       errMsg = (objPathStr, customFunc) => {
                                           return `${objPathStr} must be valid for custom function`;
                                       })
{
    if (typeof customFunc !== 'function') throw `Validator: .customFunction(${customFunc}) argument must be function`;

    const func = (value, object, key, objPathStr = '') => {
        if (!customFunc(value)) {
            this.__errors.push(errMsg(objPathStr, customFunc));
        }
    };

    this.__functions.push(func);

    return this;
};

/**
 * Validate object value
 * @param value
 * @param object
 * @param key
 * @param objPathStr
 * @private
 */
Validator.prototype.__validate = function (value, object, key, objPathStr) {
    if (typeof object === 'object' && value === undefined && this.__default !== undefined) {
        value = this.__default;
        object[key] = value;
    }

    if (value === undefined && !this.__isRequired) {
        const errors = JSON.parse(JSON.stringify(this.__errors));
        this.__errors = [];

        if (!errors.length) return true;

        return errors;
    }

    for (const func of this.__functions) {
        if (func.apply(this, arguments) === false) break;
    }

    const errors = JSON.parse(JSON.stringify(this.__errors));
    this.__errors = [];

    if (!errors.length) return true;

    return errors;
};


module.exports = Validator;