
var file = require("../core/file.js");
var path = require("path");
var globals = require("../core/globals");

var propertyJson = {};

exports.init = function () {
    var type = globals.getType();
    var configPath = path.join(globals.getApiParserRoot(), type + "_modules.json");
    if (file.exists(configPath)) {
        var content = file.read(configPath);
        propertyJson = JSON.parse(content);
    }
    else {
        propertyJson = {};
    }
};

exports.getModules = function () {
    return propertyJson["modules"] || {};
};

exports.getExclude = function () {
    return (propertyJson["exclude"] || []);
};