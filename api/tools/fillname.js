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

var preChar = "-";
var nestChar = "%";
var tempObj = [];
function getClassFullName(className, memberof) {
    tempObj = [];

    var tempClassName = ansClassFullName(className, memberof);

    while (tempClassName.indexOf(preChar) >= 0) {
        var sIdx = tempClassName.lastIndexOf(preChar);
        var eIdx = tempClassName.indexOf(nestChar, sIdx);

        var id = parseInt(tempClassName.substring(sIdx + 1, eIdx));
        tempClassName = tempClassName.substring(0, sIdx)
                        + tempObj[id]
                        + tempClassName.substring(eIdx + 1);
    }

    tempObj = [];
    return tempClassName;
}

//获取类全称
function ansClassFullName(className, memberof) {
    className = className.trim();
    if (["void", "number", "string", "boolean", "any"].indexOf(className) >= 0) {
        return className;
    }


    //有此类，则直接返回
    if (classesArr[className]) {
        return className;
    }

    if (className.indexOf("(") >= 0) { //
        var sIdx = className.lastIndexOf("(");
        var eIdx = className.indexOf(")", sIdx);

        var paramStr = className.substring(sIdx + 1, eIdx);
        var paramResult = "(";
        var params = paramStr.split(",");
        for (var i = 0; i < params.length; i++) {
            if (i != 0) {
                paramResult += ",";
            }
            var param = params[i];
            param = param.trim();
            var paramArr = param.split(":");
            paramResult += paramArr[0];
            if (paramArr[1]) {
                paramResult += ":" + ansClassFullName(paramArr[1], memberof);
            }
        }
        paramResult += ")";
        tempObj.push(paramResult);

        className = className.substring(0, sIdx)
                    + preChar + (tempObj.length - 1) + nestChar
                    + className.substring(eIdx + 1);
        return ansClassFullName(className, memberof);
    }

    var arr = className.match(/\[(\s)*[^\s\[\]]+[^\]]*\]/);
    if (arr) { //
        var paramStr = arr[0].substring(1, arr[0].length - 1);

        var paramResult = "[";
        var params = paramStr.split(",");
        for (var i = 0; i < params.length; i++) {
            if (i != 0) {
                paramResult += ",";
            }
            var param = params[i];
            param = param.trim();
            var paramArr = param.split(":");
            paramResult += paramArr[0];
            if (paramArr[1]) {
                paramResult += ":" + ansClassFullName(paramArr[1], memberof);
            }
        }
        paramResult += "]";
        tempObj.push(paramResult);

        className = className.replace(arr[0], preChar + (tempObj.length - 1) + nestChar);

        return ansClassFullName(className, memberof);
    }


    if (className.lastIndexOf("{") >= 0) { //
        var sIdx = className.lastIndexOf("{");
        var eIdx = className.indexOf("}", sIdx);

        var paramStr = className.substring(sIdx + 1, eIdx);
        var paramResult = "{";
        var params = paramStr.split(";");
        for (var i = 0; i < params.length; i++) {

            if (i != 0) {
                paramResult += ";";
            }
            var param = params[i];
            param = param.trim();

            var paramArr = param.split(":");
            paramResult += paramArr[0];
            if (paramArr[1]) {
                paramResult += ":" + ansClassFullName(paramArr[1], memberof);
            }
        }
        paramResult += "}";
        tempObj.push(paramResult);

        className = className.substring(0, sIdx)
            + preChar + (tempObj.length - 1) + nestChar
            + className.substring(eIdx + 1);
        return ansClassFullName(className, memberof);
    }


    //(a1:ITextElement, a2:ITextElement)=>ITextElement
    if (className.match(/=>/)) {
        var array = className.split("=>");
        array[0] = array[0].trim();
        var paramResult = "=>" + ansClassFullName(array[1], memberof);
        tempObj.push(paramResult);


        return array[0]
            + preChar + (tempObj.length - 1) + nestChar
    }

    if (className.indexOf("<") >= 0) {
        var sIdx = className.lastIndexOf("<");
        var eIdx = className.indexOf(">", sIdx);

        var paramResult = "<";
        paramResult += ansClassFullName(className.substring(sIdx + 1, eIdx), memberof);
        paramResult += ">";
        tempObj.push(paramResult);

        className = className.substring(0, sIdx)
            + preChar + (tempObj.length - 1) + nestChar
            + className.substring(eIdx + 1);
        return ansClassFullName(className, memberof);
    }

    // number | string
    if (className.indexOf("|") >= 0) {
        var array = className.split("|");

        for (var i = 0; i < array.length; i++) {
            array[i] = ansClassFullName(array[i], memberof);
        }

        return array.join("|");
    }

    //ITextElement[]
    if (className.match(/\[(\s)*\]/)) {
        return ansClassFullName(className.substring(0, className.indexOf("[")), memberof) + '[]';
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
    //继承e
    if (classDes["augments"]) {
        var tempAugs = [];
        for (var i = 0; i < classDes["augments"].length; i++) {
            var tempAug = classDes["augments"][i];
            tempAugs.push(getClassFullName(tempAug, memberof));
        }
        classDes["augments"] = tempAugs;
    }

    //接口
    if (classDes["implements"]) {
        var tempImpls = [];
        for (var i = 0; i < classDes["implements"].length; i++) {
            var tempIm = classDes["implements"][i];
            tempImpls.push({"name": getClassFullName(tempIm, memberof)});
        }
        classDes["implements"] = tempImpls;
    }
}

//设置所有的类型
function setFullType(obj, memberof) {
    if (obj instanceof Object) {
        for (var key in obj) {
            if (key == "type" && obj[key] != null) {
                //if (obj[key].match(/(\s)*Array(\s)*</)) {
                //    obj[key] = getArrayType(obj[key], memberof);
                //}
                //else {
                    obj[key] = getClassFullName(obj[key], memberof);
                //}
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