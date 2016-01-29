
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

var globalTypes = ["number", "string", "Date", "any", "array", "boolean", "enum", "void", "Function"];

function getGlobalTypeClass () {
    return "global.Types";
}

function isNormalType(type) {
    return globalTypes.indexOf(type) >= 0;
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


function replaceParam(paramsListStr, param) {
    var str = paramsListStr.replace(/\{param_name\}/g, param.name);

    str = str.replace(/\{param_type_class\}/g, getTypeClassName(param.type));
    str = str.replace(/\{param_type\}/g, replaceChars(param.type || "any"));

    str = str.replace(/\{param_type_href\}/g, getTypeHref(param.type));

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


    var typeclass= getTypeClassName(member["type"]);
    newNodestr = newNodestr.replace(/\{type_class\}/g, typeclass);

    newNodestr = newNodestr.replace(/\{type_href\}/g, getTypeHref(member["type"]));

    var description = getFirstSpan(member["description"]);
    if (member["scope"] == "static") {
        if (member["kind"] == "member") {
            description = "[常量] " + description;
        }
        else {
            description = "[静态] " + description;
        }
        newNodestr = newNodestr.replace(/\{default\}/g, member["default"]);
    }

    if (member["rwType"] == 1) {
        description = "[只读] " + description;
    }
    if (member["rwType"] == 2) {
        description = "[只写] " + description;
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

function getTypeHref(type) {
    if (isNormalType(type)) {
        var typeClass = getGlobalTypeClass();
        return getLink(getModuleof(typeClass) + gapChar() + typeClass + gapChar() + type);
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
