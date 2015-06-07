/**
 * Created by wander on 14-9-15.
 */


var file = require("../core/file.js");
var trim = require("../core/trim");
var path = require("path");

var flags = require("../tools/enumflag").getEnumFlag();

var TypeScript = require('../tools/enumflag').getTscApi();

function typeScriptCompiler(quitFunc, cmd) {
    file.save("tsc_config_temp.txt", cmd);//todo performance-optimize

    TypeScript.exit = function () {
        setTimeout(quitFunc, 1, arguments[0])
    };

    var nameArr = [];

    var objArr = [];

    var apiArr = [];
    var dtsArr = [];
    var arr = TypeScript.executeApi(["@tsc_config_temp.txt"]);
    arr.forEach(function (item) {
        if (item.filename.indexOf(".d.ts") >= 0) {
            dtsArr.push(item.locals);
        }
        else {
            objArr.push(item.locals);

            nameArr.push(item.filename);
            var root = {"filename": item.filename, "$_tree_": {}};
            apiArr.push(root);
            for (var key in item.locals) {
                if (key == "NaN" || key == "__proto__") {
                    continue;
                }
                check(item.locals[key], root["$_tree_"], item.text);
            }
        }
    });

    return apiArr;
}

function check(obj, parent, text) {
    var objName = obj.name;
    if (obj.name == "__constructor") {
        objName = "constructor";
    }
    parent[objName] = {};

    if (obj.declarations && obj.declarations.length) {
        getComments(text, obj.declarations[0].pos, parent[objName]);
    }

    switch (obj.flags) {
        case flags["ValueModule"]: //ValueModule
        case flags["NamespaceModule"]: //NamespaceModule
        case flags["Module"]: //NamespaceModule
        {
            parent[objName]["$_tree_"] = {};

            parent[objName]["bodyType"] = "module";
            for (var key in obj.exports) {
                if (["__proto__", "flags", "mergeId", "name", "parent"].indexOf(key) >= 0) {
                    continue;
                }

                check(obj.exports[key], parent[objName]["$_tree_"], text);
            }

            break;
        }
        case flags["FunctionScopedVariable"]://module var
        case flags["BlockScopedVariable"]://module var
        {
            getComments(text, obj.valueDeclaration.parent.pos, parent[objName]);

            parent[objName]["bodyType"] = "modulevar";
            parent[objName]["memberKind"] = "globalMember";

            setType(obj, parent[objName], text);

            addPublic(parent[objName]["content"], parent[objName], objName);
            break;
        }
        case flags["Property"]://变量
        {
            parent[objName]["bodyType"] = "Property";
            parent[objName]["memberKind"] = "member";

            setType(obj, parent[objName], text);

            var content = parent[objName]["content"];

            //获取值
            var firstIdx = content.indexOf('=');
            var endIdx = content.indexOf(';');
            if (endIdx > 0) {
                parent[objName]["default"] = trim.trimAll(content.substring(firstIdx + 1, endIdx));
            }
            else {
                parent[objName]["default"] = trim.trimAll(content.substring(firstIdx + 1));
            }

            addStatic(content, parent[objName]);
            addPublic(content, parent[objName], objName);
            break;
        }
        case flags["SetAccessor"]://module var set
        {
            parent[objName]["bodyType"] = "SetAccessor";

            var declarations = obj.declarations[0];
            var param = declarations.parameters[0];
            if (param.type) {
                parent[objName]["type"] = text.substring(param.type.pos, param.type.end);
            }
        }
        case flags["GetAccessor"]://module var get
        {
            if (parent[objName]["bodyType"] == null) {
                parent[objName]["bodyType"] = "GetAccessor";
            }
        }
        case flags["Accessor"]://module var set get
        {
            if (parent[objName]["bodyType"] == null) {
                parent[objName]["bodyType"] = "Accessor";
            }

            if (parent[objName].docs == null || parent[objName].docs.length == 0) {
                if (obj.declarations.length > 1) {//取set
                    getComments(text, obj.declarations[1].pos, parent[objName]);
                }
            }

            if (parent[objName]["type"] == null) {
                setType(obj, parent[objName], text);
            }

            parent[objName]["memberKind"] = "member";
            parent[objName]["scope"] = "instance";
            break;
        }
        case flags["Constructor"]://构造函数
        case flags["Method"]://方法
        {
            parent[objName]["bodyType"] = "function";
            parent[objName]["memberKind"] = "function";

            addStatic(parent[objName]["content"], parent[objName]);
        }
        case flags["Function"]://方法
        {
            if (parent[objName]["bodyType"] == null) {
                parent[objName]["bodyType"] = "modulefunction";
                parent[objName]["memberKind"] = "globalFunction";
            }

            var declarations = obj.declarations[0];
            if (declarations && declarations.parameters) {
                parent[objName]["parameters"] = [];

                addParams(declarations.parameters, parent[objName]["parameters"], text);
            }

            setType(obj, parent[objName], text);

            addPublic(parent[objName]["content"], parent[objName], objName);
            break;
        }
        case flags["Interface"]://接口
        {
            parent[objName]["bodyType"] = "interface";
        }
        case flags["Class"]://类
        {
            parent[objName]["$_tree_"] = {};
            if (parent[objName]["bodyType"] == null) {
                parent[objName]["bodyType"] = "class";
            }

            for (var key in obj.members) {
                if (["__proto__"].indexOf(key) >= 0) {
                    continue;
                }

                check(obj.members[key], parent[objName]["$_tree_"], text);
            }

            for (var key in obj.exports) {
                if (["__proto__", "flags", "id"].indexOf(key) >= 0) {
                    continue;
                }

                check(obj.exports[key], parent[objName]["$_tree_"], text);
            }


            if (obj["declarations"] && obj["declarations"].length) {
                var docInfo = obj["declarations"][0];

                initExtends(docInfo["baseTypes"] || [docInfo["baseType"]], parent[objName], text);
                initImplements(docInfo["implementedTypes"], parent[objName], text);
            }

            break;
        }

    }
}


var analyzedoc = require("../tools/analyzedoc");

function setType(obj, currentInfo, text) {
    if (obj.valueDeclaration && obj.valueDeclaration.type) {
        currentInfo["type"] = text.substring(obj.valueDeclaration.type.pos, obj.valueDeclaration.type.end);
    }
    else {
        currentInfo["type"] = null;
    }
}

function getComments(text, pos, obj) {
    var contentpos = pos;

    var note1 = TypeScript.ts.getLeadingCommentRanges(text, pos);
    var noteStringBlocks = []
    for (var i1 = 0; note1 && i1 < note1.length; i1++) {
        noteStringBlocks.push(text.substring(note1[i1]["pos"], note1[i1]["end"]));

        contentpos = Math.max(contentpos, note1[i1]["end"] + 1);
    }
    /*var note2 = TypeScript.ts.getTrailingCommentRanges(text, obj.valueDeclaration.pos);
     var arr2 = []
     for (var i2=0; note2 && i2<note2.length;i2++) {
     arr2.push(text.substring(note2[i2]["pos"],note2[i2]["end"]));
     }*/

    var noteInfoBlocks = [];
    if (noteStringBlocks.length) {
        for (var i = 0; i < noteStringBlocks.length; i++) {
            var doc = noteStringBlocks[i];
            noteInfoBlocks.push(analyzedoc.analyze(doc));
        }
        obj["docs"] = noteInfoBlocks;
    }

    if (text.indexOf("{", contentpos) >= 0) {
        obj["content"] = text.substring(contentpos, text.indexOf("{", contentpos));
    }
    else {
        obj["content"] = text.substring(contentpos);
    }
}

//加入是否是static
function addStatic(content, obj) {
    //判断是否是 static
    if (content.match(/(^static )|( static )/)) {
        obj["scope"] = "static";
    }
    else {
        obj["scope"] = "instance";
    }
}

//是否是public
function addPublic(content, obj, name) {
    content = trim.trimAll(content);
    //判断是否是 static
    if (content.match(/(^private )|( private )/)) {
        obj["pType"] = "private";
    }
    else if (content.match(/(^protected )|( protected )/)) {
        obj["pType"] = "protected";
    }
    else {
        if (name.charAt(0) == "_") {
            obj["pType"] = "protected";
        }
        else if (name.charAt(0) == "$") {
            obj["pType"] = "private";
        }
        else {
            obj["pType"] = "public";
        }
    }
}

//参数列表
function addParams(parameters, parametersArr, text) {
    for (var i = 0; i < parameters.length; i++) {
        var param = parameters[i];

        var p = {};

        var value = text.substring(param.pos, param.end);
        if (param.name) {
            p["name"] = trim.trimAll(text.substring(param.name.pos, param.name.end));
        }
        if (value.indexOf("...") >= 0) {
            p["name"] = "..." + p["name"];
        }

        if (param.type) {
            p["type"] = trim.trimAll(text.substring(param.type.pos, param.type.end));
        }

        if (param.initializer) {
            p["default"] = trim.trimAll(text.substring(param.initializer.pos, param.initializer.end));
        }
        parametersArr.push(p);
    }
}

//extends
function initExtends(baseTypes, obj, text) {
    if (baseTypes == null || baseTypes.length == 0) {
        return;
    }
    obj["augments"] = [];
    for (var i = 0; i < baseTypes.length; i++) {
        var baseType = baseTypes[i];
        if (baseType == null) {
            continue;
        }
        obj["augments"].push(baseType["typeName"]["text"] || text.substring(baseType["typeName"].pos, baseType["typeName"].end));
    }
}

//implements
function initImplements(implementedTypes, obj, text) {
    if (implementedTypes == null) {
        return;
    }
    obj["implements"] = [];
    for (var i = 0; i < implementedTypes.length; i++) {
        obj["implements"].push(implementedTypes[i]["typeName"]["text"] || text.substring(baseType["typeName"].pos, baseType["typeName"].end));
    }
}

exports.compile = typeScriptCompiler;