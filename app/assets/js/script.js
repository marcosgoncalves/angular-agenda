/**
 * Retorna o caller da função
 */
function ScriptPath() {
    // var scriptPath = '';
    try {
        //Throw an error to generate a stack trace
        throw new Error();
    } catch (e) {
        //Split the stack trace into each line
        var stackLines = e.stack.split('\n');
        var callerIndex = 0;
        //Now walk though each line until we find a path reference
        for (var i in stackLines) {
            if (!stackLines[i].match(/http[s]?:\/\//)) continue;
            //We skipped all the lines with out an http so we now have a script reference
            //This one is the class constructor, the next is the getScriptPath() call
            //The one after that is the user code requesting the path info (so offset by 2)
            callerIndex = Number(i) + 2;
            break;
        }
        //Now parse the string for each section we want to return
        this.caller = {
            pathParts: stackLines[callerIndex].match(/((http[s]?:\/\/.+\/)([^\/]+\.js)):/),
            line: stackLines[callerIndex].replace(/^(.*\.js.*:)(\d+)(:)(\d+)(\))$/, '$2'),
            column: stackLines[callerIndex].replace(/^(.*\.js.*:)(\d+)(:)(\d+)(\))$/, '$4')
        };
        this.caller.file = this.caller.pathParts[3];
        this.caller.path = this.caller.pathParts[2];
        this.caller.fullPath = this.caller.pathParts[1];
    }

    this.fileNoExt = function () {
        var parts = this.file().split('.');
        parts.length = parts.length != 1 ? parts.length - 1 : 1;
        return parts.join('.');
    };
}

/**
 * Atalho para escrever no console
 */
function clog() {
    var caller = new ScriptPath().caller;
    console.group.apply(this, arguments);
    console.info(caller.fullPath + ':' + caller.line + ':' + caller.column, caller.line);
    console.groupEnd();
}
/**
 * Atalho para limpar o console
 */
function cclear() {
    console.clear();
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

var makeComp = (function () {
    var accent_map = {
        'à': 'a',
        'á': 'a',
        'â': 'a',
        'ã': 'a',
        'ä': 'a',
        'å': 'a', // a
        'ç': 'c', // c
        'è': 'e',
        'é': 'e',
        'ê': 'e',
        'ë': 'e', // e
        'ì': 'i',
        'í': 'i',
        'î': 'i',
        'ï': 'i', // i
        'ñ': 'n', // n
        'ò': 'o',
        'ó': 'o',
        'ô': 'o',
        'õ': 'o',
        'ö': 'o',
        'ø': 'o', // o
        'ß': 's', // s
        'ù': 'u',
        'ú': 'u',
        'û': 'u',
        'ü': 'u', // u
        'ÿ': 'y' // y
    };

    return function accent_fold(s) {
        if (!s) {
            return '';
        }
        s = s.toLowerCase();
        var ret = '';
        for (var i = 0; i < s.length; i++) {
            ret += accent_map[s.charAt(i)] || s.charAt(i);
        }
        return ret;
    }

}());