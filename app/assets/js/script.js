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

var makeComp = (function(){

    /*var accents = {
            a: 'àáâãäåæ',
            c: 'ç',
            e: 'èéêëæ',
            i: 'ìíîï',
            n: 'ñ',
            o: 'òóôõöø',
            s: 'ß',
            u: 'ùúûü',
            y: 'ÿ'
        },
        chars = /[aceinosuy]/g;

    return function makeComp(input) {
        return input.toLowerCase().replace(chars, function(c){
            return '[' + c + accents[c] + ']';
        });
    };*/

    var accent_map = {
        'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', // a
        'ç': 'c',                                                   // c
        'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',                     // e
        'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',                     // i
        'ñ': 'n',                                                   // n
        'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o', // o
        'ß': 's',                                                   // s
        'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',                     // u
        'ÿ': 'y'                                                    // y
    };

    return function accent_fold(s) {
        if (!s) { return ''; }
        s = s.toLowerCase();
        var ret = '';
        for (var i = 0; i < s.length; i++) {
            ret += accent_map[s.charAt(i)] || s.charAt(i);
        }
        return ret;
    }

}());