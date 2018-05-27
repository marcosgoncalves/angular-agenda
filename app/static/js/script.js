/**
 * Atalho para escrever no console
 */
function clog() {
    if (arguments.length == 1) {
        console.log(arguments[0]);
    } else if (arguments.length == 2) {
        console.log(arguments[0], arguments[1]);
    } else if (arguments.length == 3) {
        console.log(arguments[0], arguments[1], arguments[2]);
    } else if (arguments.length == 4) {
        console.log(arguments[0], arguments[1], arguments[2], arguments[3]);
    } else {
        console.log(arguments);
    }
}

function camelCase(name) {
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
    var MOZ_HACK_REGEXP = /^moz([A-Z])/;
    return name.
    replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
    }).
    replace(MOZ_HACK_REGEXP, 'Moz$1');
}