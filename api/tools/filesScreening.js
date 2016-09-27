/**
 * Created by yjtx on 15-6-4.
 */

var trim = require("../core/trim");
var globals = require("../core/globals");

var path = require("path");
var file = require("../core/file.js");
var property = require("../tools/apiProperty");

exports.screening = function () {
    var egretPaths = globals.getSourcePaths();
    var dependencePaths = globals.getDependence();

    var tsList = [];
    for (var i = 0; i < egretPaths.length; i++) {
        tsList = tsList.concat(file.getDirectoryAllListing(path.join(egretPaths[i])));
    }

    //获取所有的文件
    for (var i = 0; i < dependencePaths.length; i++) {
        tsList = tsList.concat(file.getDirectoryAllListing(path.join(dependencePaths[i])));
    }

    //过滤排除的文件
    var excludePaths = property.getExclude();

    tsList = tsList.filter(function (item) {
        if (!item.match(/\.ts$/)) {
            return false;
        }

        for (var i = 0; i < excludePaths.length; i++) {
            if (item.match(excludePaths[i])) {
                return false;
            }
        }
        return true;
    });
    return tsList;
};