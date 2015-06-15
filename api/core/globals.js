var params = require("../core/params_analyze.js");

function addQuotes(str) {
    return "\"" + str + "\"";
}

function getOption(type) {
    if (params.getArgv()["opts"][type]) {
        return params.getArgv()["opts"][type][0];
    }
    return null;
}

function getExampleRootPath() {
    return getOption("-examples-path") || getOption("--examples");
}

function getOutputPath() {
    return getOption("--output");
}

function getLanguage() {
    return getOption("--language") || "zh_cn";
}


function clone(frame) {
    var result;
    if (frame instanceof Array) {
        result = [];
    }
    else if (frame instanceof Object) {
        result = {};
    }
    else {
        return frame;
    }

    for (var key in frame) {
        if (frame[key] instanceof Array) {
            result[key] = clone(frame[key]);
        }
        else if (frame[key] instanceof Object) {//
            result[key] = clone(frame[key]);
        }
        else {
            result[key] = frame[key];
        }
    }
    return result;
}

exports.clone = clone;

exports.getOption = getOption;
exports.addQuotes = addQuotes;
exports.getExampleRootPath = getExampleRootPath;
exports.getOutputPath = getOutputPath;
exports.getLanguage = getLanguage;