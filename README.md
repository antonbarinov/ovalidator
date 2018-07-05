# Ovalidator

> Javascript objects validator

# Installation
```
npm i --save @antonbarinov/ovalidator
```

# Quick start example
```
const { Validator, Validate } = require('@antonbarinov/ovalidator');

// Object that we want validate
let objToValidate = {
    a: "ssd",
    b: 19,
    c: {
        a: [1, 444]
    },
    f: [1, 2, 3, 4],
    g: [],
    i: {
        j: 1,
        s: 2
    },
    k: 'asd',
    l: { a: 2 },
    m: [
        { a: 2 },
        { a: 3 }
    ]
};

// custom validation function
const customFunc = (value) => {
    return (value === 'aaa' || value === 'aAa');
};

// custom error msg function
const customErrorMsgFunc = (objPathStr) => {
    return `${objPathStr} must be "aaa" or "aAa"`;
};

// Validation schema
let childSchema = {
    a: new Validator().typeInteger(),
    b: {
        a: new Validator().required(),
        b: {
            a: new Validator().required(),
        }
    },
    c: [new Validator().required().min(15)]
};

// Validation schema
let schema = {
    a: new Validator().typeString().customFunction(customFunc, customErrorMsgFunc),
    b: new Validator().required().min(12).max(20),
    c: childSchema,
    d: new Validator().required(),
    e: 123,
    f: [childSchema],
    g: [new Validator().required().min(15)],
    h: new Validator().required(),
    i: {
        j: [new Validator().required().min(15)],
    },
    l: new Validator().typeObject(),
    m: [new Validator().typeObject()],
    n: new Validator().default('THIS IS DEFAULT VALUE')
};


const errors = Validate(schema, objToValidate);
console.log('errors:');
console.log(errors);

console.log('\r\n');

// Validate empty object
const errors2 = Validate(schema, {});
console.log('errors2:');
console.log(errors2);

console.log('\r\n');

console.log('objToValidate:');
console.log(objToValidate);
```

### Output
```
errors:
[ 'k is unexpected',
  'a must be "aaa" or "aAa"',
  'c.a must be integer',
  'c.b.a is required',
  'c.b.b.a is required',
  'c.c is required',
  'd is required',
  'f[0].b.a is required',
  'f[0].b.b.a is required',
  'f[0].c must be array',
  'f[1].b.a is required',
  'f[1].b.b.a is required',
  'f[1].c must be array',
  'f[2].b.a is required',
  'f[2].b.b.a is required',
  'f[2].c must be array',
  'f[3].b.a is required',
  'f[3].b.b.a is required',
  'f[3].c must be array',
  'g can not be empty array',
  'h is required',
  'i.s is unexpected',
  'i.j must be array' ]


errors2:
[ 'b is required',
  'c.b.a is required',
  'c.b.b.a is required',
  'c.c must be array',
  'd is required',
  'f[0].b.a is required',
  'f[0].b.b.a is required',
  'f[0].c must be array',
  'g is required',
  'h is required',
  'i.j must be array' ]


objToValidate:
{ a: 'ssd',
  b: 19,
  c: { a: [ 1, 444 ] },
  f: [ 1, 2, 3, 4 ],
  g: [],
  i: { j: 1, s: 2 },
  k: 'asd',
  l: { a: 2 },
  m: [ { a: 2 }, { a: 3 } ],
  n: 'THIS IS DEFAULT VALUE' }
```

### Validate function
Validate(schema, objToValidate, allowUnexpectedFiends = false)
- `schema` - validation schema
- `objToValidate` - object to validate using validation schema
- `allowUnexpectedFiends` - allow fields in objects that not described in validation schema (Default: `false`)

### API
- `.required(errMsgFunction)` - field is required.
- `.min(minVal, errMsgFunction)` - minimum int or float value.
- `.max(maxVal, errMsgFunction)` - maximum int or float value.
- `.minLength(minVal, errMsgFunction)` - minimum string length.
- `.maxLength(maxVal, errMsgFunction)` - maximum string length.
- `.default(defaultValue)` - set `defaultValue` value if its undefined.
- `.typeInteger(errMsgFunction)` - field type must be integer.
- `.typeFloat(errMsgFunction)` - field type must be float.
- `.typeString(errMsgFunction)` - field type must be string.
- `.typeObject(errMsgFunction)` - field type must be object with any structure inside.
- `.regexp(regExp, errMsgFunction)` - field must be valid with regular expression.
- `.customFunction(customFunc, errMsgFunction)` - `customFunc` function must return `true` if field value is valid.

`errMsgFunction` - function for custom validator messages