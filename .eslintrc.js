module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "airbnb-base",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "no-underscore-dangle": 0,
        "no-prototype-builtins": 0,
        "global-require": 0,
        "import/no-dynamic-require": 0,
        "no-param-reassign": 0,
        "class-methods-use-this": 0,
        "no-control-regex": 0,
        "no-await-in-loop": 0,
        "no-restricted-syntax": 0,
        "no-continue": 0,
        "no-ex-assign": 0
    }
};
