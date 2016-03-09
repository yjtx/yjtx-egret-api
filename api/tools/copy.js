/**
 * Created by yjtx on 15-6-4.
 */
var globals = require("../core/globals");

var classObjs = {};
exports.dealWithCopy = function (tempClassObjs) {
    classObjs = tempClassObjs;

    for (var key in tempClassObjs) {
        var item = tempClassObjs[key];
        //方法继承
        var functions = item["function"] || [];
        for (var f = 0; f < functions.length; f++) {
            if (functions[f]["copy"]) {
                addCopy(functions[f]);
            }
        }

        //属性继承
        var members = item["member"] || [];
        for (var m = 0; m < members.length; m++) {
            if (members[m]["copy"]) {
                addCopy(members[m]);
            }
        }

        //方法继承
        var functions = item["globalFunction"] || [];
        for (var f = 0; f < functions.length; f++) {
            if (functions[f]["copy"]) {
                addCopy(functions[f]);
            }
        }

        //属性继承
        var members = item["globalMember"] || [];
        for (var m = 0; m < members.length; m++) {
            if (members[m]["copy"]) {
                addCopy(members[m]);
            }
        }
    }
};

function addCopy(item) {
    var copyType = "";
    var copyClassName = "";
    var copyItemName = "";

    var arr = item.copy.split("#");
    if (arr.length > 1) {
        var copyClassName = arr[0];
        if (copyClassName == "") {
            copyClassName = item.memberof;
        }
        copyItemName = arr[1];
        copyType = "member";
        if (copyItemName.indexOf("(") >= 0) {
            copyType = "function";
            copyItemName = copyItemName.substring(0, copyItemName.indexOf("("));
        }
    }
    else {
        copyItemName = arr[0];
        if (copyItemName.lastIndexOf(".") > 0) {
            copyClassName = copyItemName.substring(0, copyItemName.lastIndexOf("."));
            copyItemName = copyItemName.substring(copyItemName.lastIndexOf(".") + 1);
        }
        if (copyItemName.indexOf("(") >= 0) {
            copyType = "globalFunction";
            copyItemName = copyItemName.substring(0, copyItemName.indexOf("("));
        }
        else {
            copyType = "globalMember";
        }
    }

    var parent = getClass(copyClassName);
    if (!parent) {
        console.log(copyClassName)
    }
    var parentKindList = parent[copyType];
    for (var i = 0; i < parentKindList.length; i++) {
        var parentItem = parentKindList[i];
        if (copyItemName == parentItem.name) {
            item["description"] = parentItem["description"];
            if (parentItem["returns"]) {
                item["returns"] = globals.clone(parentItem["returns"]);
            }

            if (parentItem["params"]) {
                item["params"] = globals.clone(parentItem["params"]);
            }

            if (parentItem["see"]) {
                item["see"] = globals.clone(parentItem["see"]);
            }

            if (parentItem["default"] && !item["default"]) {
                item["default"] = globals.clone(parentItem["default"]);
            }

            //暂时不将copy作为继承方法看待
            /*if (parentItem["inherited"] == true) {
                item["inherits"] = parentItem["inherits"];
            }
            else {
                item["inherits"] = copyClassName;
            }
            item["inherited"] = true;*/
            break;
        }
    }
}

function getClass(className) {
    return classObjs[className];
}
