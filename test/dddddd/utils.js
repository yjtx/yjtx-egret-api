
function trimLeft(str) {
    return str.replace(/^(\s)*/, "");
}

function trimRight(str) {
    return str.replace(/(\s)*$/, "");
}

function trimAll(str) {
    return trimRight(trimLeft(str));
}

function isIn(search, str) {
    search = search.toLowerCase();
    str = str.toLowerCase();
    var idx = 0;
    for (var i = 0; i < search.length; i++) {
        var c = search[i];

        idx = str.indexOf(c, idx);
        if (idx < 0) {
            return false;
        }
        idx++;
    }

    return true;
}


function setDisplays(className, isShow, parentNode) {
    var divs = (parentNode || document).getElementsByClassName(className);
    for (var i = 0; i < divs.length; i++) {
        var item = divs[i];

        if (!isShow) {
            item.style.display = "none";

            //item.parentNode.removeChild(item);
        }else {
            //item.style.display = "block";
        }
    }
}


function getLink(link) {
    return "#" + link;
}


function getFullMemberof(member) {
    if (member.kind == "globalFunction") {
        return member["memberof"] + ".globalFunction";
    }
    if (member.kind == "globalMemeber") {
        return member["memberof"] + ".globalMemeber";
    }

    var memberof = member["memberof"];
    if (getModule(memberof) == null) {
        return "";
    }

    return member["memberof"];
}

function getModuleof(memberof, kind) {
    if (kind == "globalFunction") {
        return currentModule;
    }
    if (kind == "globalMemeber") {
        return currentModule;
    }

    if (getModule(memberof) == null) {
        return null;
    }

    return getModule(memberof);
}

var globalTypes1 = ["Date", "Function", "T", "Map"];
var globalTypes2 = ["number", "string", "any", "array", "boolean", "enum", "void"];

function getGlobalTypeClass () {
    return "global.Types";
}

function isNormalType(type) {
    return type && (globalTypes1.indexOf(type) >= 0 || globalTypes2.indexOf(type.toLowerCase()) >= 0);
}

function getNormalType(type) {
    if (type) {
        if (globalTypes1.indexOf(type) >= 0) {
            return type;
        }
        else if (globalTypes2.indexOf(type.toLowerCase()) >= 0) {
            return type.toLowerCase();
        }
    }
    return type;
}

function getTypeClassName(type) {
    if (isNormalType(type)) {
        return getGlobalTypeClass();
    }

    if (type == undefined) {
        return "any";
    }

    return type;
}

function getClassHref(className) {
    if (getModule(className) == null) {
        return "javascript:void";
    }
    else {
        return getLink(getModule(className) + gapChar() + className);
    }
}


function replaceParam(paramsListStr, param, needDefault) {
    var str = paramsListStr.replace(/\{param_name\}/g, param.name);

    str = str.replace(/\{param_type_class\}/g, getTypeClassName(param.type));
    str = str.replace(/\{param_type\}/g, replaceChars(param.type || "any"));

    if (needDefault) {

        if (param.question == true) {
            str = str.replace(/:/, "?:");
        }
    
        if (param.default) {
            str = str.replace(/\{a_param_type_href\}/g, '{a_param_type_href} = ' + param.default);
        }
    }

    str = str.replace(/\{a_param_type_href\}/g, getTypeA(param["type"]));

    str = str.replace(/\{param_description\}/g, param.description);
    return str;
}

function getReplacedStr(newNodestr, member) {
    newNodestr = newNodestr.replace(/\{name\}/g, member["name"]);

    newNodestr = newNodestr.replace(/\{memberof\}/g, member["memberof"]);

    var memberofFull = getFullMemberof(member);
    newNodestr = newNodestr.replace(/\{memberof_full\}/g, memberofFull);

    var moduleof = getModuleof(member["memberof"], member["kind"]);
    newNodestr = newNodestr.replace(/\{moduleof\}/g, moduleof);
    newNodestr = newNodestr.replace(/\{type\}/g, replaceChars(member["type"] || "any"));
    newNodestr = newNodestr.replace(/\{version\}/g, member["version"] || "all");
    newNodestr = newNodestr.replace(/\{platform\}/g, member["platform"] || "Web,Runtime");

    newNodestr = newNodestr.replace(/\{a_type_href\}/g, getTypeA(member["type"]));

    var description = getFirstSpan(member["description"]);
    if (member["scope"] == "static") {
        if (member["kind"] == "member") {
            description = "【常量】" + description;
        }
        else {
            description = "【静态】" + description;
        }
        newNodestr = newNodestr.replace(/\{default\}/g, member["default"]);
    }

    if (member["rwType"] == 1) {
        description = "【只读】" + description;
    }
    if (member["rwType"] == 2) {
        description = "【只写】" + description;
    }

    if (member["deprecated"] != null) {
        description = "【废弃】" + description + " " + member["deprecated"] ;
    }

    newNodestr = newNodestr.replace(/\{description_1\}/g, description);
    newNodestr = newNodestr.replace(/\{description\}/g, member["description"]);

    newNodestr = newNodestr.replace(/\{inherited\}/g, member["inherited"] ? "block" : "none");

    if (moduleof == null) {
        newNodestr = newNodestr.replace(/\{moduleof_memberof_full\}/g, "");
    }
    else {
        newNodestr = newNodestr.replace(/\{moduleof_memberof_full\}/g, moduleof + gapChar() + memberofFull);
    }


    newNodestr = newNodestr.replace(/\{classModule_className_name\}/g, currentModule + gapChar() + currentClassName + gapChar() + member["name"]);

    return newNodestr;
}

function replaceChars(str) {
    str = str.replace("<", "&lt;");
    str = str.replace(">", "&gt;");
    return str;
}

//获取类全称
function ansClassFullName(className, memberof) {

    if (className) {
        if (className.indexOf("(") >= 0) { //
            var sIdx = className.lastIndexOf("(");
            var eIdx = className.indexOf(")", sIdx);

            var paramStr = className.substring(sIdx + 1, eIdx);
            var paramResult = "(";
            var params = paramStr.split(",");
            for (var i = 0; i < params.length; i++) {
                if (i != 0) {
                    paramResult += ", ";
                }
                var param = params[i];
                param = param.trim();
                var paramArr = param.split(":");
                paramResult += paramArr[0];
                if (paramArr[1]) {
                    paramResult += ": " + ansClassFullName(paramArr[1], memberof);
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
                    paramResult += ", ";
                }
                var param = params[i];
                param = param.trim();
                var paramArr = param.split(":");
                paramResult += paramArr[0];
                if (paramArr[1]) {
                    paramResult += ": " + ansClassFullName(paramArr[1], memberof);
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
                    paramResult += "; ";
                }
                var param = params[i];
                param = param.trim();

                var paramArr = param.split(":");
                paramResult += paramArr[0];
                if (paramArr[1]) {
                    paramResult += ": " + ansClassFullName(paramArr[1], memberof);
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
            var paramResult = " => " + ansClassFullName(array[1], memberof);
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

            return array.join(" | ");
        }

        //ITextElement[]
        if (className.match(/\[(\s)*\]/)) {
            return ansClassFullName(className.substring(0, className.indexOf("[")), memberof) + '[]';
        }
    }

    var tempClassName = className;
    while (tempClassName && tempClassName.indexOf(preChar) == 0) {
        var sIdx = 0;
        var eIdx = tempClassName.indexOf(nestChar, sIdx);

        var id = parseInt(tempClassName.substring(sIdx + preChar.length, eIdx));
        tempClassName = tempObj[id]
            + tempClassName.substring(eIdx + nestChar.length);
    }

    if (tempClassName && (tempClassName.indexOf("{") == 0)) {
        //var link = '<span data-class-name="{type_class}">{type}</span>';
        return className;
    }
    else if (tempClassName && tempClassName.indexOf("Array" + preChar) == 0) {
        var link = '<a href="{type_href}" data-class-name="{type_class}">{type}</a>';
        link = link.replace(/\{type\}/g, replaceChars("Array"));
        link = link.replace(/\{type_class\}/g, getTypeClassName("Array"));
        link = link.replace(/\{type_href\}/g, getTypeHref("Array"));

        return link + tempClassName.substring(5);
    }
    else if (tempClassName && tempClassName.indexOf("Map" + preChar) == 0) {
        var link = '<a href="{type_href}" data-class-name="{type_class}">{type}</a>';
        link = link.replace(/\{type\}/g, replaceChars("Map"));
        link = link.replace(/\{type_class\}/g, getTypeClassName("Map"));
        link = link.replace(/\{type_href\}/g, getTypeHref("Map"));

        return link + tempClassName.substring(3);
    }


    var link = '<a href="{type_href}" data-class-name="{type_class}">{type}</a>';
    link = link.replace(/\{type\}/g, replaceChars(className || "any"));
    link = link.replace(/\{type_class\}/g, getTypeClassName(className));
    link = link.replace(/\{type_href\}/g, getTypeHref(className));

    return link;
}

var preChar = "%%-%%";
var nestChar = "**-**";
var tempObj = [];
function getTypeA(className, memberof) {
    tempObj = [];

    var tempClassName = ansClassFullName(className, memberof);

    while (tempClassName.indexOf(preChar) >= 0) {
        var sIdx = tempClassName.lastIndexOf(preChar);
        var eIdx = tempClassName.indexOf(nestChar, sIdx);

        var id = parseInt(tempClassName.substring(sIdx + preChar.length, eIdx));
        tempClassName = tempClassName.substring(0, sIdx)
            + tempObj[id]
            + tempClassName.substring(eIdx + nestChar.length);
    }

    tempObj = [];
    return tempClassName;
}


function getTypeHref(type) {
    if (isNormalType(type)) {
        var typeClass = getGlobalTypeClass();
        return getLink(getModuleof(typeClass) + gapChar() + typeClass + gapChar() + getNormalType(type));
    }
    else {
        return getClassHref(type);
    }

}


function getFirstSpan(des) {
    if (des == null) {
        return "";
    }
    var i1 = des.indexOf("。") < 0 ? des.length : des.indexOf("。");
    var i2 = des.indexOf("<br/>") < 0 ? des.length : des.indexOf("<br/>");

    return des.substr(0, Math.min(i1, i2));
}
