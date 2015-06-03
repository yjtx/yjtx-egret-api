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

exports.getOption = getOption;
exports.addQuotes = addQuotes;
exports.getExampleRootPath = getExampleRootPath;