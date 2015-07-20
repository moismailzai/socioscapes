/**
 * This internal method tests if a name used for a socioscapes scape, state, layer, or view adheres to naming
 * restrictions.
 *
 * @function isValidName
 * @memberof! socioscapes
 * @param {string} name - This should be a valid http, https, ftp, or ftps URL and follow the
 * "protocol://my.valid.url/my.file" pattern.
 * @returns {Boolean}
 */
module.exports = function isValidName(name) {
    var callback = (typeof arguments[arguments.length - 1] === 'function') ? callback:function(result) { return result;},
        isValid,
        isReserved = [
            'help',
            // below are reserved JS words and properties
            'abstract',
            'arguments',
            'Array',
            'boolean',
            'break',
            'byte',
            'case',
            'catch',
            'char',
            'class',
            'const',
            'continue',
            'debugger',
            'Date',
            'default',
            'delete',
            'do',
            'double',
            'else',
            'enum',
            'eval',
            'export',
            'extends',
            'false',
            'final',
            'finally',
            'float',
            'for',
            'function',
            'goto',
            'hasOwnProperty',
            'if',
            'implements',
            'import',
            'in',
            'instanceof',
            'int',
            'interface',
            'isFinite',
            'isNaN',
            'isPrototypeOf',
            'Infinity',
            'length',
            'let',
            'long',
            'native',
            'Math',
            'name',
            'new',
            'NaN',
            'Number',
            'null',
            'Object',
            'package',
            'private',
            'protected',
            'prototype',
            'public',
            'return',
            'short',
            'static',
            'super',
            'switch',
            'synchronized',
            'String',
            'this',
            'throw',
            'throws',
            'toString',
            'transient',
            'true',
            'try',
            'typeof',
            'undefined',
            'valueOf',
            'var',
            'void',
            'volatile',
            'while',
            'with',
            'yield'
        ];
    if (typeof name === 'string' && /^[-A-Z0-9]+$/i.test(name)) { // if 'name' is a string and matches the regex pattern
        if (!isReserved.indexOf(name) === -1) {
            isValid = false;
            console.log('Sorry, "' + name + '" is not a valid name because it is a reserved word. The full list of reserved words is: ' + isReserved);
        } else { // and doesn't match a reserved word, then it is valid
            isValid = true
        }
    } else {
        isValid = false;
        console.log('Sorry, that is not a valid name. Valid names can only contain letters (a to Z), numbers (0-9), or dashes (-).');
    }
    if (callback) {
        callback(isValid)
    } else {
        return isValid;
    }
};