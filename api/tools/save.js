/**
 * Created by yjtx on 15-6-4.
 */

var trim = require("../core/trim");
var globals = require("../core/globals");

var path = require("path");
var file = require("../core/file.js");
var property = require("../tools/apiProperty");


var allModuleList = {};
var relationList = {};
function screen(moduleClassObjs, moduleKey) {
    var outputPath = globals.getOutputPath();

    var tempModulesArr = {};
    var tempModules = {};//所有的全局函数、全局属性


    for (var key in moduleClassObjs) {
        var item = moduleClassObjs[key];
        if (item.class) {

            saveFile(path.join(outputPath, "finalClasses", moduleKey, key + ".json"), JSON.stringify(item, null, "\t"));

            var memberof = item.class.memberof;

            if (tempModulesArr[memberof] == null) {
                tempModulesArr[memberof] = [];
            }
            tempModulesArr[memberof].push(item.class.name);

            //加入到关系列表
            addToRelation(moduleKey, item.class, "class");
        }
        else {
            if (item["globalMember"] && item["globalMember"].length) {
                saveFile(path.join(outputPath, "finalClasses", moduleKey, key + "." + "globalMember.json"), JSON.stringify({"globalMember": item["globalMember"]}, null, "\t"));

                //加入到关系列表
                for (var tempi = 0; tempi < item["globalMember"].length; tempi++) {
                    addToRelation(moduleKey, item["globalMember"][tempi], "globalMember");
                }
            }
            if (item["globalFunction"] && item["globalFunction"].length) {
                saveFile(path.join(outputPath, "finalClasses", moduleKey, key + "." + "globalFunction.json"), JSON.stringify({"globalFunction": item["globalFunction"]}, null, "\t"));

                //加入到关系列表
                for (var tempi = 0; tempi < item["globalFunction"].length; tempi++) {
                    addToRelation(moduleKey, item["globalFunction"][tempi], "globalFunction");
                }
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

    if (allModuleList[moduleKey] == null) {
        allModuleList[moduleKey] = [];
    }

    for (var key in tempModulesArr) {
        var mod = tempModulesArr[key];
        mod.sort();

        if (tempModules[key]) {
            if (tempModules[key]["globalFunction"]) {
                mod.unshift("globalFunction");
                tempModules[key]["globalFunction"] = false;
            }
            if (tempModules[key]["globalMember"]) {
                mod.unshift("globalMember");
                tempModules[key]["globalMember"] = false;
            }
        }

        for (var key2 in mod) {
            if (key == "") {
                allModuleList[moduleKey].push(mod[key2]);
            }
            else {
                allModuleList[moduleKey].push(key + "." + mod[key2]);
            }
        }
    }

    for (var key in tempModules) {
        var mod = [];
        if (tempModules[key]["globalFunction"]) {
            mod.unshift("globalFunction");
            tempModules[key]["globalFunction"] = false;
        }
        if (tempModules[key]["globalMember"]) {
            mod.unshift("globalMember");
            tempModules[key]["globalMember"] = false;
        }
        for (var key2 in mod) {
            allModuleList[moduleKey].push(key + "." + mod[key2]);
        }
    }

    saveGzip(path.join(outputPath, "finalClasses"), moduleKey);
}

function addToRelation(moduleKey, classinfo, kind) {
    if (relationList[moduleKey] == null) {
        relationList[moduleKey] = {};
    }

    if (relationList[moduleKey][kind] == null) {
        relationList[moduleKey][kind] = [];
    }

    var name = classinfo["name"];
    if (classinfo.memberof && classinfo.memberof != "") {
        name = classinfo.memberof + "." + name;
    }
    relationList[moduleKey][kind].push({"name": name, "description" : classinfo.description});
}

function isInDependence(item) {
    var dependences = globals.getDependence();

    if (item.filename) {
        for (var i = 0; i < dependences.length; i++) {
            var temppath = file.escapePath(dependences[i]);
            if (item.filename.indexOf(temppath) >= 0) {
                return true;
            }
        }
    }

    return false;
}

exports.save = function (tempClassObjs) {
    var allModules = {};

    var modules = property.getModules();

    for (var key in tempClassObjs) {
        var item = tempClassObjs[key];
        if (item.class) {
            if (item.class.filename) {
                var filepath = path.join(item.class.filename);

                var moduleName = getModuleName(filepath);
            }
            else {
                moduleName = "other";
            }

            if (!isInDependence(item.class)) {
                addClass(item, key, moduleName);
            }
        }
        else {

            if (item["globalMember"] && item["globalMember"].length) {
                for (var i = 0; i < item["globalMember"].length; i++) {
                    var filepath = path.join(item["globalMember"][i]["filename"]);

                    var moduleName = getModuleName(filepath);

                    if (!isInDependence(item["globalMember"][i])) {
                        addGlobals(item["globalMember"][i], key, moduleName, "globalMember");
                    }
                }
            }

            if (item["globalFunction"] && item["globalFunction"].length) {
                for (var i = 0; i < item["globalFunction"].length; i++) {
                    var filepath = path.join(item["globalFunction"][i]["filename"]);

                    var moduleName = getModuleName(filepath);

                    if (!isInDependence(item["globalFunction"][i])) {
                        addGlobals(item["globalFunction"][i], key, moduleName, "globalFunction");
                    }
                }
            }
        }
    }

    for (var tempKey in allModules) {
        screen(allModules[tempKey], tempKey);
    }

    var outputPath = globals.getOutputPath();

    saveFile(path.join(outputPath, "/relation", "list.json"), JSON.stringify(allModuleList, null, "\t"));

    //for (var key1 in relationList) {
    //    for (var key2 in relationList[key1]) {
    //        console.log(key1, key2);
    //        relationList[key1][key2].sort(charSort);
    //    }
    //}
    saveFile(path.join(outputPath, "/relation", "relation.json"), JSON.stringify(relationList, null, "\t"));

    function charSort(a, b) {
        return a.name < b.name;
    }

    function addClass(item, key, moduleKey) {
        if (allModules[moduleKey] == null) {
            allModules[moduleKey] = {};
        }

        allModules[moduleKey][key] = item;
    }

    function addGlobals(item, key, moduleKey, type) {
        if (allModules[moduleKey] == null) {
            allModules[moduleKey] = {};
        }
        if (allModules[moduleKey][key] == null) {
            allModules[moduleKey][key] = {};
        }

        if (allModules[moduleKey][key][type] == null) {
            allModules[moduleKey][key][type] = [];
        }

        allModules[moduleKey][key][type].push(item);
    }

    function getModuleName(filepath) {
        filepath = file.escapePath(filepath);
        for (var tempKey in modules) {
            var item = modules[tempKey];
            if (typeof item == "string") {
                if (filepath.indexOf(item) == 0) {
                    return tempKey;
                }
            }
            else {
                var items = modules[tempKey];
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (filepath.indexOf(item) == 0) {
                        return tempKey;
                    }
                }
            }
        }
        return "yjtx";
    }
};

function saveFile(filepath, value) {
    file.save(filepath, value);
}

function saveGzip(dicRoot, module) {
    var files = file.getDirectoryAllListing(path.join(dicRoot, module));

    var ZipWriter = require("moxie-zip").ZipWriter;
    var zip = new ZipWriter();

    for (var tempKey in files) {
        zip.addFile(path.join(module, file.getFileName(files[tempKey]) + ".json"), path.resolve(files[tempKey]));
    }
    zip.toBuffer(function (buf) {
    });

    file.createDirectory(path.join(dicRoot, "../zips"));
    zip.saveAs(path.join(dicRoot, "../zips", module + ".zip"), function () {
        console.log(module + ".zip written.");
    });
}