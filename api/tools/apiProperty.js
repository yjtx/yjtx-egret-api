
var file = require("../core/file.js");
var path = require("path");
var globals = require("../core/globals");

var propertyJson = {};

var typemodules = [];
exports.init = function () {
    var types = globals.getTypes();
    for (var i = 0; i < types.length; i++) {
        var configPath = getTypePath(types[i]);
        if (configPath) {
            var content = file.read(configPath);
            typemodules.push(JSON.parse(content));
        }
        else {
            content = globals.getOption("--typeConfig") || null;
            if (content) {
                typemodules.push(JSON.parse(content));
            }
            else {
                typemodules.push({});
            }
        }
    }
};


function getTypePath(type) {
    var configPath;
    if (type) {
        
        configPath = path.join(globals.getApiParserRoot(), type + "_modules.json");
        if (file.exists(configPath)) {
            return configPath;
        }
    }

    configPath = globals.getOption("--typePath") || null;
    if (configPath && file.exists(configPath))  {
        return configPath;
    }

    return null;
}

exports.getModule = function (filepath) {
    var sourcePaths = globals.getSourcePaths();
    for (var pi = 0; pi < sourcePaths.length; pi++) {
        var tmpath = sourcePaths[pi];

        if (filepath.indexOf(tmpath) == 0) {
            break;
        }
    }

    if (typemodules[pi] == null) {
        return "yjtx";
    }
    var modules = typemodules[pi]['modules'];


    for (var tempKey in modules) {
        var item = modules[tempKey];
        if (typeof item == "string") {
            item = path.join(sourcePaths[pi], item);
            if (filepath.indexOf(item) == 0) {
                return tempKey;
            }
        }
        else {
            var items = modules[tempKey];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                item = path.join(sourcePaths[pi], item);
                if (filepath.indexOf(item) == 0) {
                    return tempKey;
                }
            }
        }
    }
    return "yjtx";
}

exports.getRelativePath = function (filepath) {
    var sourcePaths = globals.getSourcePaths();
    for (var pi = 0; pi < sourcePaths.length; pi++) {
        var tmpath = sourcePaths[pi];
        if (filepath.indexOf(tmpath) == 0) {
            return path.relative(tmpath, filepath);
        }
    }

    return filepath;
}

exports.getExclude = function () {
    var excludes = [];

    var sourcePaths = globals.getSourcePaths();
    for (var pi = 0; pi < sourcePaths.length; pi++) {
        var tmpath = sourcePaths[pi];

        var arr = typemodules[pi]['exclude'] || [];

        for (var j = 0; j < arr.length; j++) {
            excludes.push(path.join(tmpath, arr[j]));
        }
    }

    return excludes;
};