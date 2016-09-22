/**
 * Created by huanghaiying on 15/2/5.
 */

var path = require("path");
var trim = require("../core/trim");
var globals = require("../core/globals");

var classesArr = {};
var windowArr = {};


var modulesArr = {};
function addToModulesArr(className, memberof) {
    if (modulesArr[memberof] == null) {
        modulesArr[memberof] = [];
    }

    modulesArr[memberof].push(className);
}

exports.screening = function (apiArr) {
    for (var i = 0; i < apiArr.length; i++) {
        _analyze(apiArr[i], [], apiArr[i]["filename"]);
    }

    var tempClassArr = globals.clone(classesArr);

    for (var key in windowArr) {
        tempClassArr[key] = windowArr[key];
    }

    return tempClassArr;
};

function _analyze(docsInfo, parent, filename) {

    for (var key in docsInfo["$_tree_"]) {
        var item = docsInfo["$_tree_"][key];
        analyze(item, key, parent, filename);
    }
}

function addClassInfo(name, parent) {
    var l = parent.concat([name]);
    if (classesArr[l.join(".")] == null) {
        classesArr[l.join(".")] = {
            "memberof": parent.join("."),
            "member": [],
            "function": [],
            "globalMember": [],
            "globalFunction": []
        };
    }

    return classesArr[l.join(".")];
}

function analyze(item, name, parent, filename) {
    if (item.bodyType == "bodyType") {
        console.log("asdf")
    }
    var tempParent = parent.concat();

    var member = {};

    switch (item.bodyType) {
        case "module":
            var moduleInfo = addClassInfo(name, tempParent);

            tempParent.push(name);
            _analyze(item, tempParent, filename);

            addOtherPropertis(moduleInfo, item);
            break;
        case "interface":
        case "class":
        case "enum":

            var classInfo = addClassInfo(name, tempParent);
            delete classInfo["memberof"];

            var tempClass = classInfo["class"] = {};
            tempClass["kind"] = item.bodyType;
            tempClass["name"] = name;
            tempClass["memberof"] = tempParent.join(".");



            tempClass["filename"] = filename;

            initDesc(item["docs"], item["parameters"], tempClass, true);

            tempClass["augments"] = item["augments"];
            tempClass["implements"] = item["implements"];

            tempParent.push(name);
            _analyze(item, tempParent, filename);

            addToModulesArr(name, tempClass["memberof"]);

            addOtherPropertis(classInfo, item);

            break;
        case "modulevar"://变量
        case "modulefunction"://
            member["filename"] = filename;
        case "GetAccessor"://
        case "SetAccessor"://
        case "Accessor":
        case "Property"://变量
        case "function":
            member["kind"] = item["memberKind"];
            member["type"] = item["type"];
            member["name"] = name;
            member["memberof"] = tempParent.join(".") || "window";
            member["scope"] = item["scope"];

            switch (item.bodyType) {
                case "GetAccessor":
                    member["rwType"] = 1;
                    break;
                case "SetAccessor":
                    member["rwType"] = 2;
                    break;
            }

            initDesc(item["docs"], item["parameters"], member);



            if (classesArr[member["memberof"]] == null) {
                var moduleInfo = addClassInfo(member["memberof"], tempParent);
                tempParent.push(member["memberof"]);
                classesArr[member["memberof"]][member["kind"]].push(member);
                //windowArr[name] = member;
            }
            else {
                classesArr[member["memberof"]][member["kind"]].push(member);
            }

            addOtherPropertis(member, item);
            break;
    }
}

function initDesc(docs, parameters, obj) {//注释中的相关字段
    var paramsDoc = {};
    if (docs && docs.length) {
        var doc = docs[docs.length - 1];

        for (var key in doc) {
            switch (key) {
                case "link" :
                    //obj["exampleU"] = [];
                    //
                    //var links = trim.trimAll(doc["link"]);
                    //var arr = links.split("\n");
                    //for (var m = 0; m < arr.length; m++) {
                    //    var u = arr[m];
                    //
                    //    var uo = {};
                    //    obj["exampleU"].push(uo);
                    //    uo["u"] = u.match(/^(\S)+/)[0];
                    //    uo["t"] = trim.trimAll(u.substring(uo["u"].length));
                    //}

                    break;
                case "params" :
                    paramsDoc = doc["params"];
                    break;
                default :
                    if (doc[key] instanceof String) {
                        obj[key] = changeDescription(doc[key]);
                    }
                    else {
                        obj[key] = doc[key];
                    }
            }
        }
    }

    if (parameters && parameters.length) {
        for (var i = 0; i < parameters.length; i++) {
            var param = parameters[i];
            param["description"] = changeDescription(paramsDoc[param["name"]] || "");
        }
        obj["params"] = parameters;
    }
}

function addOtherPropertis(member, item) {//从ts代码里解析出来的相关字段
    var otherKeys = ["pType", "default"];
    for (var i = 0; i < otherKeys.length; i++) {
        var key = otherKeys[i];
        if (item[key] && !member[key]) {
            if (item[key] instanceof String) {
                member[key] = trim.trimAll(item[key].toString());
            }
            else {
                member[key] = item[key];
            }
        }
    }
}

function changeDescription(des) {
    if (des == null) {
        return des;
    }

    des = trim.trimAll(des);
    //des = des.replace(/<br\/>/g, "\n");
    return des;
}
