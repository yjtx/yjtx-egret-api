/**
 * Created by yjtx on 15-6-5.
 * 将类名补全
 */
var trim = require("../core/trim");

var classesArr;

exports.fillname = function (tempClassObjs) {
    classesArr = tempClassObjs;

    for (var key in tempClassObjs) {
        var item = tempClassObjs[key];
        if (item.class) {
            setClassFullType(item.class, item["class"]["memberof"]);
            setFullType(item, item["class"]["memberof"]);
        }
        else {
            setFullType(item, key);
        }
    }
};

//获取类全称
function getClassFullName(className, memberof) {
    className = trim.trimAll(className);

    if (["void", "number", "string", "boolean", "any"].indexOf(className) >= 0) {
        return className;
    }

    //有此类，则直接返回
    if (classesArr[className]) {
        return className;
    }


    //根据当前
    if (memberof) {
        var arr = memberof.split(".");
        while (arr.length) {
            var tempMemberof = arr.join(".");
            if (classesArr[tempMemberof + "." + className]) {
                return tempMemberof + "." + className;
            }

            arr.pop();
        }
    }

    return className;
}

function setClassFullType(classDes, memberof) {
    //继承
    if (classDes["tempExtends"]) {
        classDes["augments"] = [getClassFullName(classDes["tempExtends"], memberof)];

        delete classDes["tempExtends"];
    }

    //接口
    if (classDes["tempImplements"]) {
        var tempImpls = [];
        for (var i = 0; i < classDes["tempImplements"].length; i++) {
            var tempIm = classDes["tempImplements"][i];
            tempImpls.push({"name": getClassFullName(tempIm, memberof)});
        }
        classDes["implements"] = tempImpls;

        delete classDes["tempImplements"];
    }
}

//设置所有的类型
function setFullType(obj, memberof) {
    if (obj instanceof Object) {
        for (var key in obj) {
            if (key == "type" && obj[key] != null) {
                if (obj[key].match(/(\s)*Array(\s)*</)) {
                    obj[key] = getArrayType(obj[key], memberof);
                }
                else {
                    obj[key] = getClassFullName(obj[key], memberof);
                }
            }
            else {
                setFullType(obj[key], memberof);
            }
        }
    }
}

function getArrayType(arrayType, memberof) {
    if (arrayType.match(/(\s)*Array(\s)*</)) {
        var header = arrayType.match(/(\s)*Array(\s)*</)[0];
        var end = arrayType.lastIndexOf(">");

        var tempType = arrayType.substring(header.length, end);

        return "Array<" + getArrayType(tempType, memberof) + ">";
    }

    return getClassFullName(arrayType, memberof);
}