/**
 * Created by huanghaiying on 15/2/5.
 */

var path = require("path");
var trim = require("../core/trim");
var globals = require("../core/globals");

var classesArr = {};
var windowArr = [];


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

    var tempParent = parent.concat();
    switch (item.bodyType) {
        case "module":
            var moduleInfo = addClassInfo(name, tempParent);
            moduleInfo["memberof"];

            tempParent.push(name);
            _analyze(item, tempParent, filename);

            addOtherPropertis(moduleInfo, item);
            break;
        case "interface":
            var classInfo = addClassInfo(name, tempParent);
            delete classInfo["memberof"];

            var tempClass = classInfo["class"] = {};
            tempClass["kind"] = "interface";
            tempClass["name"] = name;
            tempClass["memberof"] = tempParent.join(".");
            tempClass["filename"] = filename;

            initDesc(item["docs"], item["parameters"], tempClass, true);

            tempClass["tempExtends"] = item["extends"];


            tempParent.push(name);
            _analyze(item, tempParent, filename);

            addToModulesArr(name, tempClass["memberof"]);

            addOtherPropertis(classInfo, item);

            if (tempClass["description"] == null || tempClass["description"] == "") {
                classInfo["noDes"] = true;
            }
            break;
        case "class":
            var classInfo = addClassInfo(name, tempParent);
            delete classInfo["memberof"];

            var tempClass = classInfo["class"] = {};
            tempClass["kind"] = "class";
            tempClass["name"] = name;
            tempClass["memberof"] = tempParent.join(".");
            tempClass["filename"] = filename;

            initDesc(item["docs"], item["parameters"], tempClass, true);

            tempClass["tempExtends"] = item["extends"];
            tempClass["tempImplements"] = item["implements"];


            tempParent.push(name);
            _analyze(item, tempParent, filename);

            addToModulesArr(name, tempClass["memberof"]);

            addOtherPropertis(classInfo, item);

            if (tempClass["description"] == null || tempClass["description"] == "") {
                classInfo["noDes"] = true;
            }
            break;
        case "modulevar"://变量
            var member = {};
            member["kind"] = "globalmember";
            member["type"] = item["type"];
            member["name"] = name;
            member["memberof"] = tempParent.join(".");
            member["scope"] = item["scope"];

            initDesc(item["docs"], item["parameters"], member);

            if (classesArr[member["memberof"]] == null) {
                windowArr.push(member);
            }
            else {
                classesArr[member["memberof"]]["globalMember"].push(member);
            }

            if (member["description"] == null || member["description"] == "") {
                member["noDes"] = true;
            }
            addOtherPropertis(member, item);
            break;
        case "Property"://变量
            var member = {};
            member["kind"] = "member";
            member["type"] = item["type"];
            member["name"] = name;
            member["memberof"] = tempParent.join(".");
            member["scope"] = item["scope"];

            initDesc(item["docs"], item["parameters"], member);

            classesArr[member["memberof"]]["member"].push(member);

            if (member["description"] == null || member["description"] == "") {
                member["noDes"] = true;
            }
            addOtherPropertis(member, item);
            break;
        case "GetAccessor"://
        case "SetAccessor"://
        case "Accessor":
        {
            var member = {};
            member["kind"] = "member";
            member["type"] = item["type"];
            member["name"] = name;
            member["memberof"] = tempParent.join(".");
            member["scope"] = "instance";

            var tempItem;
            var useGet = false;
            switch (item.bodyType) {
                case "GetAccessor":
                    member["rwType"] = 1;
                    tempItem = item["get"];
                    useGet = true;
                    break;
                case "SetAccessor":
                    member["rwType"] = 2;
                    tempItem = item["set"];
                    break;
                default:
                    tempItem = item["set"];
                    if (!tempItem["docs"] || !tempItem["docs"][0]["description"] || tempItem["docs"][0]["description"] == "") {
                        tempItem = item["get"];
                        useGet = true;
                    }
            }


            initDesc(tempItem["docs"], tempItem["parameters"], member, true);
            if (!useGet) {
                member["type"] = member["params"][0]["type"];
                delete member["params"];
            }

            member["description"] = trim.trimAll(member["description"] || "");

            member["description"] = changeDescription(member["description"]);

            classesArr[member["memberof"]]["member"].push(member);

            if (member["description"] == null || member["description"] == "") {
                member["noDes"] = true;
            }
            addOtherPropertis(member, tempItem);
            delete member["returns"];
            break;
        }
        case "modulefunction"://变量
            var member = {};
            member["kind"] = "globalFunction";
            member["type"] = item["type"];
            member["name"] = name;
            member["memberof"] = tempParent.join(".");
            member["scope"] = item["scope"];

            if (item["docs"] && item["docs"].length) {
                var doc = item["docs"][item["docs"].length - 1];

                if (doc["return"]) {
                    member["returns"] = {"type": member["type"], "description": changeDescription(doc["return"])};
                }
            }

            initDesc(item["docs"], item["parameters"], member);
            if (member["returns"]) {
                member["returns"]["type"] = member["type"];
            }

            classesArr[member["memberof"]]["globalFunction"].push(member);

            if (member["description"] == null || member["description"] == "") {
                member["noDes"] = true;
            }
            addOtherPropertis(member, item);
            break;
        case "function"://变量
            var member = {};
            member["kind"] = "function";
            member["type"] = item["type"];
            member["name"] = name;
            member["memberof"] = tempParent.join(".");
            member["scope"] = item["scope"];

            if (item["docs"] && item["docs"].length) {
                var doc = item["docs"][item["docs"].length - 1];

                if (doc["return"]) {
                    member["returns"] = {"type": member["type"], "description": changeDescription(doc["return"])};
                }
            }

            initDesc(item["docs"], item["parameters"], member);
            if (member["returns"]) {
                member["returns"]["type"] = member["type"];
            }
            else {
                if (member["type"] != "void") {
                    member["returns"] = {"type": member["type"]};
                }
            }
            classesArr[member["memberof"]]["function"].push(member);

            if (member["description"] == null || member["description"] == "") {
                member["noDes"] = true;
            }
            addOtherPropertis(member, item);
            break;
    }
}

function initDesc(docs, parameters, obj, notTrans) {
    if (notTrans === void 0) {
        notTrans = false;
    }
    var paramsDoc = {};
    if (docs && docs.length) {
        var doc = docs[docs.length - 1];

        for (var key in doc) {
            switch (key) {
                case "return" :
                    obj["returns"] = {"description": changeDescription(doc["return"])};
                    break;
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
                case "description" :
                    if (!notTrans) {
                        obj["description"] = changeDescription(doc["description"]);
                    }
                    else {
                        obj["description"] = doc["description"];
                    }
                    break;
                default :
                    obj[key] = doc[key];
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

function addOtherPropertis(item, orgItem) {
    var otherKeys = ["pType", "version", "value", "default", "platform", "copy", "inheritDoc"];
    for (var i = 0; i < otherKeys.length; i++) {
        var key = otherKeys[i];
        if (orgItem[key]) {
            if (orgItem[key] instanceof String) {
                item[key] = trim.trimAll(orgItem[key].toString());
            }
            else {
                item[key] = orgItem[key];
            }
        }
    }
}

function changeDescription(des) {
    if (des == null) {
        return des;
    }
    des = des.replace(/^(\s)*/, "");
    des = des.replace(/(\s)*$/, "");
    des = des.replace(/<br\/>/g, "\n");
    if (des == "") {
        return des;
    }

    return des;
}
