/**
 * Created by yjtx on 15-6-4.
 */

var trim = require("../core/trim");
var globals = require("../core/globals");

var path = require("path");
var file = require("../core/file.js");

exports.save = function (tempClassObjs) {
    var outputPath = globals.getOutputPath();

    var tempModulesArr = {};
    var tempModules = {};//所有的全局函数、全局属性


    for (var key in tempClassObjs) {
        var item = tempClassObjs[key];
        if (item.class) {
            file.save(path.join(outputPath, "finalClasses/" + key + ".json"), JSON.stringify(item, null, "\t"));

            if (tempModulesArr[item.class.memberof] == null) {
                tempModulesArr[item.class.memberof] = [];
            }
            tempModulesArr[item.class.memberof].push(item.class.name);
        }
        else {
            if (item["globalMember"] && item["globalMember"].length) {
                file.save(path.join(outputPath, "finalClasses", key + "." + "globalMember.json"), JSON.stringify({"globalMember": item["globalMember"]}, null, "\t"));
            }
            if (item["globalFunction"] && item["globalFunction"].length) {
                file.save(path.join(outputPath, "finalClasses", key + "." + "globalFunction.json"), JSON.stringify({"globalFunction": item["globalFunction"]}, null, "\t"));
            }

            var modeName = key;
            tempModules[modeName] = {};
            if (item["globalMember"] && item["globalMember"].length) {
                tempModules[modeName]["globalMember"] = true;
            }
            if (item["globalFunction"] && item["globalFunction"].length) {
                tempModules[modeName]["globalFunction"] = true;
            }
        }
    }

    for (var key in tempModulesArr) {
        var mod = tempModulesArr[key];
        mod.sort();

        if (tempModules[key]) {
            if (tempModules[key]["globalFunction"]) {
                mod.unshift("globalFunction");
            }
            if (tempModules[key]["globalMember"]) {
                mod.unshift("globalMember");
            }
        }
    }
    file.save(path.join(outputPath, "relation/egret_list.json"), JSON.stringify(tempModulesArr, null, "\t"));
};
