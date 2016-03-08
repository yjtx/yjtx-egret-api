
var file = require("../core/file.js");
var path = require("path");
var globals = require("../core/globals");

var propertyJson = {};

exports.init = function () {
    var configPath = getTypePath();
    if (configPath) {
        var content = file.read(configPath);
        propertyJson = JSON.parse(content);
    }
    else {
        content = getOption("--typeConfig") || null;
        if (content) {
            propertyJson = JSON.parse(content);
        }
        else {
            propertyJson = {};
        }
    }
};

function getTypePath() {
    var configPath;
    var type = globals.getType();
    if (type) {
        configPath = path.join(globals.getApiParserRoot(), type + "_modules.json");
        if (file.exists(configPath)) {
            return configPath;
        }
    }

    configPath = getOption("--typePath") || null;
    if (configPath && file.exists(configPath))  {
        return configPath;
    }

    return null;
}

exports.getModules = function () {
    return propertyJson["modules"] || {};
};

exports.getExclude = function () {
    return (propertyJson["exclude"] || []);
};