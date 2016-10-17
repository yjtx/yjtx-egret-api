var ts = require("typescript");
var trim = require("../core/trim");
var globals = require("../core/globals");
var path = require("path");
var file = require("../core/file");

var TYPEFLAG = require("../tools/enumflag").getEnumFlag();


var currentFileName = "";
exports.run = function run(fileNames) {
    var options = {target: 2 /* ES6 */, module: 0 /* None */};
    var host = ts.createCompilerHost(options);
    var program = ts.createProgram(fileNames, options, host);
    //console.log(fileNames);
    //var errors = program.getDiagnostics();
    //if (errors.length > 0) {
    //    errors.forEach(function (diagnostic) {
    //        var lineChar = diagnostic.file.getLineAndCharacterFromPosition(diagnostic.start);
    //        console.log("" + diagnostic.file.filename + " (" + lineChar.line + "," + lineChar.character + "): " + diagnostic.messageText);
    //    });
    //    return;
    //}

    var apiArr = [];

    var libsNames = ["tools/node_modules/typescript/bin", "core/typescript/lib.d.ts"];
    program.getSourceFiles().forEach(function (sourceFile) {
        var filename = sourceFile.fileName;
        for (var i = 0; i < libsNames.length; i++) {
            if (file.escapePath(filename).match(libsNames[i])) {
                return;
            }
        }

        var sourcePaths = globals.getSourcePaths();
        if (!globals.isInDependence(filename)) {
            for (var pi = 0; pi < sourcePaths.length; pi++) {
                var tmpath = sourcePaths[pi];


                if (filename.indexOf(tmpath) == 0) {
                    // filename = path.relative(tmpath, filename).replace(/\//g, "\\");
                    break;
                }

            }
        }

        currentFileName = filename;

        var root = {"filename": filename, "$_tree_": {}};
        formatFile(sourceFile, root["$_tree_"]);

        apiArr.push(root);
    });

    return apiArr;
};

function formatFile(sourceFile, parent) {
    var text = sourceFile.text;
    var statements = sourceFile.statements;
    var length = statements.length;
    for (var i = 0; i < length; i++) {
        var statement = statements[i];

        if (statement.flags & TYPEFLAG.Ambient /* Ambient */) {
        }
        //else
        if (statement.kind == TYPEFLAG.ModuleDeclaration /* ModuleDeclaration */) {
            formatModule(statement, text, parent, statement.flags == TYPEFLAG.Ambient /* Ambient */ || statement.flags == 65540 ? -1 : 0);
        }
        else if (statement.kind == TYPEFLAG.VariableStatement /* VariableStatement */) {
            formatMember(statement, text, parent, null, -1);
        }
        else if (statement.kind == TYPEFLAG.FunctionDeclaration /* FunctionDeclaration */) {
            formatMember(statement, text, parent, null, -1);
        }
        else if (statement.kind == TYPEFLAG.InterfaceDeclaration /* InterfaceDeclaration */) {
            formatClass(statement, text, parent, false, -1);
        }
        else if ((statement.kind == TYPEFLAG.ClassDeclaration /* ClassDeclaration */)
            || (statement.kind == TYPEFLAG.EnumDeclaration /* EnumDeclaration */)) {
            formatClass(statement, text, parent, false, -1);
        }
    }
}

function formatModule(statement, text, parent, isPrivate) {
    if (statement.flags & TYPEFLAG.Ambient /* Ambient */) {
        //return;
    }

    if (statement.kind == TYPEFLAG.ModuleDeclaration /* ModuleDeclaration */) {
        var objName = statement.name.text;
        if (parent[objName] == null) {
            parent[objName] = {"$_tree_": {}, "bodyType": "module"};
        }
        var tempParent = parent[objName]["$_tree_"];

        var comments = {};
        getComments(text, statement.pos, comments);

        if (isPrivate != 1) {
            for (var i = 0; comments["docs"] && i < comments["docs"].length; i++) {
                var tdoc = comments["docs"][i];
                if (tdoc["private"] == true) {
                    isPrivate = 1;

                    break;
                }
            }
        }

        if (statement.body.statements) {
            var tempStatements = statement.body.statements;
            var length = tempStatements.length;
            for (var i = 0; i < length; i++) {
                var tempStatement = tempStatements[i];
                if (tempStatement.flags & TYPEFLAG.Ambient /* Ambient */) {
                }
                else if (tempStatement.kind == TYPEFLAG.ModuleDeclaration /* ModuleDeclaration */) {
                    formatModule(tempStatement, text, parent[objName]["$_tree_"], isPrivate);
                }
                else if (tempStatement.kind == TYPEFLAG.VariableStatement /* VariableStatement */) {
                    formatMember(tempStatement, text, parent[objName]["$_tree_"], null, isPrivate);
                }
                else if (tempStatement.kind == TYPEFLAG.FunctionDeclaration /* FunctionDeclaration */) {
                    formatMember(tempStatement, text, parent[objName]["$_tree_"], null, isPrivate);

                }
                else if (tempStatement.kind == TYPEFLAG.InterfaceDeclaration /* InterfaceDeclaration */
                    || (tempStatement.kind == TYPEFLAG.ClassDeclaration /* ClassDeclaration */)
                    || (tempStatement.kind == TYPEFLAG.EnumDeclaration /* EnumDeclaration */)) {
                    formatClass(tempStatement, text, parent[objName]["$_tree_"], true, isPrivate);
                }
            }
        }
        else {
            var tempStatement = statement.body;
            if (tempStatement.flags & TYPEFLAG.Ambient /* Ambient */) {
            }
            else if (tempStatement.kind == TYPEFLAG.ModuleDeclaration /* ModuleDeclaration */) {
                formatModule(tempStatement, text, parent[objName]["$_tree_"], isPrivate);
            }
        }

    }
}

function formatClass(statement, text, parent, hasModule, isPrivate) {
    var objName = statement.name.text;
    parent[objName] = {"$_tree_": {}};

    switch (statement.kind) {
        case TYPEFLAG.EnumDeclaration /* EnumDeclaration */
        :
            parent[objName]["bodyType"] = "enum";
        case TYPEFLAG.InterfaceDeclaration /* InterfaceDeclaration */
        :
            if (parent[objName]["bodyType"] == null) {
                parent[objName]["bodyType"] = "interface";
            }
        case TYPEFLAG.ClassDeclaration /* ClassDeclaration */
        :
            if (parent[objName]["bodyType"] == null) {
                parent[objName]["bodyType"] = "class";
            }

            if (isPrivate == 1) {
                parent[objName]["pType"] = "private";
            }
            else if (isPrivate == -1) {
                parent[objName]["pType"] = "public";
            }
            else if (!hasModule) {
                parent[objName]["pType"] = "public";
            }
            else if (isExport(statement)) {//
                parent[objName]["pType"] = "public";
            }
            else {
                parent[objName]["pType"] = "private";
                //由于局部的enum可能会重复，导致生成问题，因此直接排除局部enum
                if (statement.kind == TYPEFLAG.EnumDeclaration /* EnumDeclaration */) {
                    delete parent[objName];
                    return;
                }
            }

            formatMembers(statement["members"], text, parent[objName]["$_tree_"], false, isPrivate);

            if (statement.heritageClauses) {
                for (var i2 = 0; i2 < statement.heritageClauses.length; i2++) {
                    var heritageClause = statement.heritageClauses[i2];
                    if (heritageClause.token == TYPEFLAG.ImplementsKeyword /*ImplementsKeyword*/) {
                        initImplements(heritageClause["types"], parent[objName], text);
                    }
                    else if (heritageClause.token == TYPEFLAG.ExtendsKeyword /*ExtendsKeyword*/) {
                        initExtends(heritageClause["types"], parent[objName], text);
                    }
                }
            }

            getComments(text, statement.pos, parent[objName]);
            break;
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
        obj["augments"].push(baseType["expression"]["text"] || text.substring(baseType["expression"].pos, baseType["expression"].end));
    }
}

//implements
function initImplements(implementedTypes, obj, text) {
    if (implementedTypes == null) {
        return;
    }
    obj["implements"] = [];
    for (var i = 0; i < implementedTypes.length; i++) {
        var implementedType = implementedTypes[i];
        obj["implements"].push(implementedType["expression"]["text"] || text.substring(implementedType["expression"].pos, implementedType["expression"].end));
    }
}


function formatMembers(members, text, parent, isStatic, isPrivate) {
    if (members == null) {
        return;
    }
    var length = members.length;
    
    var enumValue = 0;
    for (var i = 0; i < length; i++) {
        var member = members[i];
        formatMember(member, text, parent, isStatic, isPrivate);

        if (member.kind == TYPEFLAG.EnumMember /* EnumMember */) {
            var name = member.name.text;
            parent[name]["type"] = "number";
            if (parent[name]["default"] == null) {
                parent[name]["default"] = enumValue + "";
            }
            else {
                enumValue = parseInt(parent[name]["default"]);
            }
            enumValue++;
        }
    }
}

function formatMember(member, text, parent, isStatic, isPrivate) {
    var flags = member.flags;

    var name = "";
    if (member.kind == TYPEFLAG.VariableStatement /* VariableStatement */) {
        var declarations = member.declarationList.declarations;
        name = declarations[0].name.text;

        if (parent[name] && parent[name]["bodyType"] == "interface") {
            parent[name]["bodyType"] = "class";

            formatMembers(declarations[0]["type"]["members"], text, parent[name]["$_tree_"], true, isPrivate);
            return;
        }

        if (declarations && declarations.length > 0) {
            if (member.declarationList.flags & TYPEFLAG.Const /* Const */) {
                var nextMembers;

                if (declarations[0].initializer && declarations[0].initializer.properties) {
                    nextMembers = declarations[0].initializer.properties;
                }
                else if (declarations[0].type && declarations[0].type.members) {
                    nextMembers = declarations[0].type.members;
                }

                if (nextMembers) {
                    parent[name] = {};
                    parent[name]["bodyType"] = "class";
                    parent[name]["$_tree_"] = {};

                    formatMembers(nextMembers, text, parent[name]["$_tree_"], true, isPrivate);

                    getComments(text, member.pos, parent[name]);
                    return;
                }

            }
        }

        if (declarations && declarations.length > 0 && declarations[0]["type"]) {
            if ( declarations[0]["type"]["parameters"]) {
                member.parameters = declarations[0]["type"]["parameters"];
                member.type = declarations[0]["type"]["type"];
                member.kind = TYPEFLAG.FunctionDeclaration /* FunctionDeclaration */;
            }
            else {
                member.type = declarations[0]["type"];
            }

        }

    }
    else if (member.kind == TYPEFLAG.Constructor /* Constructor */) {
        name = "constructor";
    }
    else if (member.kind == TYPEFLAG.ConstructSignature /* ConstructSignature */) {
        name = "constructor";
    }
    else if (member.kind == TYPEFLAG.CallSignature /* CallSignature */) {//(source: string, subString: string): boolean;
        name = "(";
        for (var i = 0; i < member.parameters.length; i++) {
            if (i != 0) {
                name += ", ";
            }
            //name += member.parameters[i].text;


            var parameter = member.parameters[i];
            name += parameter.name.text + ":" + (parameter.type.text || text.substring(parameter.type.pos, parameter.type.end));
        }
        name += ")";
    }
    else if (member.kind == TYPEFLAG.IndexSignature /* IndexSignature */) {//[key:string]:BBB;
        name = "[";
        for (var i = 0; i < member.parameters.length; i++) {
            if (i != 0) {
                name += ", ";
            }
            //name += parameter.text || text.substring(parameter.type.pos, member.type.end);

            var parameter = member.parameters[i];
            name += parameter.name.text + ":" + (parameter.type.text || text.substring(parameter.type.pos, parameter.type.end));
        }
        name += "]";

    }
    else {
        if (member.name == null) {

            if(text.substring(member.pos, member.end) == ";") {
                return;
            }
            console.log("文件有问题  " + currentFileName);
            console.log(text.substring(member.pos, member.end));
        }

        name = member.name.text;

        //解决静态变量和属性重名后被替换的问题
        if (isStatic || flags & TYPEFLAG.Static /* Static */) {
            name += "_#static";
        }
    }


    if (parent[name] == null || member.kind == TYPEFLAG.Constructor /* Constructor */ || member.kind == TYPEFLAG.ConstructSignature /* ConstructSignature */) {
        parent[name] = {};
    }

    if (member.kind == TYPEFLAG.SetAccessor /* SetAccessor */) {
        if (parent[name]["bodyType"] == "GetAccessor") {
            parent[name]["bodyType"] = "Property";

            if (parent[name]["noNote"] == true) {//已经有注释，无需继续解析
                getComments(text, member.pos, parent[name]);
            }
            else {//只需要再解析注释
            }
            return;
        }
        else {
            parent[name]["bodyType"] = "SetAccessor";
            parent[name]["memberKind"] = "member";
        }
    }
    else if (member.kind == TYPEFLAG.GetAccessor /* GetAccessor */) {
        if (parent[name]["bodyType"] == "SetAccessor") {
            parent[name]["bodyType"] = "Property";

            if (parent[name]["noNote"] == true) {//已经有注释，无需继续解析
                getComments(text, member.pos, parent[name]);
            }
            else {//只需要再解析注释
            }
            return;
        }
        else {
            parent[name]["bodyType"] = "GetAccessor";
            parent[name]["memberKind"] = "member";
        }
    }
    else if (member.kind == TYPEFLAG.Constructor /* Constructor */ || member.kind == TYPEFLAG.ConstructSignature /* ConstructSignature */) {
        parent[name]["bodyType"] = "function";
        parent[name]["memberKind"] = "function";
    }
    else if (member.kind == TYPEFLAG.Method /* Method */
        || member.kind == TYPEFLAG.MethodSignature /* MethodSignature */
        || member.kind == TYPEFLAG.MethodDeclaration /* MethodDeclaration */) {
        parent[name]["bodyType"] = "function";
        parent[name]["memberKind"] = "function";
    }
    else if (member.kind == TYPEFLAG.Property /* Property */
        || member.kind == TYPEFLAG.PropertySignature /* PropertySignature */
        || member.kind == TYPEFLAG.PropertyDeclaration /* PropertyDeclaration */
        || member.kind == TYPEFLAG.IndexSignature /* IndexSignature */
        || member.kind == TYPEFLAG.CallSignature /* CallSignature */) {
        parent[name]["bodyType"] = "Property";
        parent[name]["memberKind"] = "member";
    }
    else if (member.kind == TYPEFLAG.VariableStatement /* VariableStatement */) {
        parent[name]["bodyType"] = "modulevar";
        parent[name]["memberKind"] = "globalMember";


    }
    else if (member.kind == TYPEFLAG.FunctionDeclaration /* FunctionDeclaration */) {
        parent[name]["bodyType"] = "modulefunction";
        parent[name]["memberKind"] = "globalFunction";

    }
    else if (member.kind == TYPEFLAG.EnumMember /* EnumMember */) {
        parent[name]["bodyType"] = "Property";
        parent[name]["memberKind"] = "member";

    }
    else if (member.kind == TYPEFLAG.PropertyAssignment /* PropertyAssignment */) {
        parent[name]["bodyType"] = "Property";
        parent[name]["memberKind"] = "member";
    }

    //作用域
    if (isPrivate == 1) {
        parent[name]["pType"] = "private";
    }
    else if (name.charAt(0) == "$" || name.charAt(0) == "_") {
        parent[name]["pType"] = "protected";
    }
    else if (isPrivate == -1) {
        if (flags & TYPEFLAG.Protected /* Protected */) {
            parent[name]["pType"] = "protected";
        }
        else if (flags & TYPEFLAG.Private /* Private */) {
            parent[name]["pType"] = "private";
        }
        else {
            parent[name]["pType"] = "public";
        }
    }
    else if (member.kind == TYPEFLAG.VariableStatement /* VariableStatement */) {
        if (isExport(member)) {
            parent[name]["pType"] = "public";
        }
        else {
            parent[name]["pType"] = "private";
        }
    }
    else if (member.kind == TYPEFLAG.FunctionDeclaration /* FunctionDeclaration */) {
        if (isExport(member)) {
            parent[name]["pType"] = "public";
        }
        else {
            parent[name]["pType"] = "private";
        }
    }
    else {
        if (flags == 0 || (flags & TYPEFLAG.Public /* Public */)) {
            parent[name]["pType"] = "public";
        }
        else if (flags & TYPEFLAG.Protected /* Protected */) {
            parent[name]["pType"] = "protected";
        }
        else if (flags & TYPEFLAG.Private /* Private */) {
            parent[name]["pType"] = "private";
        }
        else {
            parent[name]["pType"] = "public";
        }
    }
    if (member.type && !(member.kind == TYPEFLAG.Constructor /* Constructor */ || member.kind == TYPEFLAG.ConstructSignature /* ConstructSignature */)) {//类型
        parent[name]["type"] = text.substring(member.type.pos, member.type.end);
    }
    else if (member.kind == TYPEFLAG.PropertyAssignment /* PropertyAssignment */) {
        var tempT = text.substring(member.initializer.pos, member.initializer.end).trim();
        if (tempT == "true" || tempT == "false") {
            parent[name]["type"] = "boolean";
        }
        else if (!isNaN(tempT)) {
            parent[name]["type"] = "number";
        }
        else {
            parent[name]["type"] = "string";
        }
    }

    //默认值
    getDefault(member, parent[name], text);

    if (name == "constructor") {
        parent[name]["scope"] = "instance";
    }
    else if (flags & TYPEFLAG.Static /* Static */) {
        parent[name]["scope"] = "static";
    }
    else if (member.kind == TYPEFLAG.EnumMember /* EnumMember */) {
        parent[name]["scope"] = "static";
    }
    else if (isStatic) {
        parent[name]["scope"] = "static";
    }
    else {
        parent[name]["scope"] = "instance";
    }

    if (member.parameters) {
        parent[name]["parameters"] = [];
        if (member.parameters.length) {
            if (member.kind == TYPEFLAG.SetAccessor /* SetAccessor */) {
                var parameter = member.parameters[0];
                parent[name]["type"] = trim.trimAll(text.substring(parameter.type.pos, parameter.type.end));
            }
            else {
                for (var i1 = 0; i1 < member.parameters.length; i1++) {
                    var parameter = member.parameters[i1];

                    var tempParam = {};
                    tempParam["name"] = parameter.name.text;
                    if (parameter.dotDotDotToken) {
                        tempParam["name"] = "..." + tempParam["name"];
                    }

                    if (parameter.questionToken) {
                        tempParam["question"] = true;
                    }
                    if (parameter.type) {
                        tempParam["type"] = trim.trimAll(text.substring(parameter.type.pos, parameter.type.end));
                    }

                    //默认值
                    getDefault(parameter, tempParam, text);

                    parent[name]["parameters"].push(tempParam);
                }
            }
        }
    }

    getComments(text, member.pos, parent[name]);
}

function getDefault(parameter, tempParam, text) {
    if (parameter.initializer) {//默认值
        var str = trim.trimAll(text.substring(parameter.initializer.pos, parameter.initializer.end));
        tempParam["default"] = str;
    }
}

var analyzedoc = require("../tools/analyzedoc");
function getComments(text, pos, obj) {
    var contentpos = pos;

    var note1 = ts.getLeadingCommentRanges(text, pos);
    var noteStringBlocks = [];
    for (var i1 = 0; note1 && i1 < note1.length; i1++) {
        noteStringBlocks.push(text.substring(note1[i1]["pos"], note1[i1]["end"]));

        contentpos = Math.max(contentpos, note1[i1]["end"] + 1);
    }
    /*var note2 = TypeScript.ts.getTrailingCommentRanges(text, obj.valueDeclaration.pos);
     var arr2 = []
     for (var i2=0; note2 && i2<note2.length;i2++) {
     arr2.push(text.substring(note2[i2]["pos"],note2[i2]["end"]));
     }*/

    var language = globals.getLanguage();
    var noteIdx = -1;
    var baseIdx = -1;
    for (var i2 = noteStringBlocks.length - 1; i2 >= 0; i2--) {
        var doc = noteStringBlocks[i2].toLowerCase();
        var reg = new RegExp("@language[\\s]+" + language);

        if (doc.match(reg)) {
            noteIdx = i2;
        }
        else if (!doc.match(/@language[\s]+/) && !doc.match(/^[\s]*\/\/+/)) {
            baseIdx = i2;
        }
    }

    var notes = {};
    if (baseIdx != -1) {
        var doc = noteStringBlocks[baseIdx];
        if (doc == null) {
            console.log("sss")
        }

        addTo(notes, analyzedoc.analyze(doc));
    }

    if (noteIdx != -1) {//当前语言的注释
        var doc = noteStringBlocks[noteIdx];
        if (doc == null) {
            console.log("sss")
        }
        addTo(notes, analyzedoc.analyze(doc));
    }

    var noteInfoBlocks = [];

    if (baseIdx == -1 && noteIdx == -1) {//没有找到基础注释
        if (noteStringBlocks.length) {//找到注释的最后靠近api的那个注释
            var doc = noteStringBlocks[noteStringBlocks.length - 1];

            var docInfo = analyzedoc.analyze(doc);
            noteInfoBlocks.push(docInfo);

            obj["noNote"] = (docInfo["copy"] == null && docInfo["inheritDoc"] == null) && (docInfo["description"] == null || docInfo["description"] == "");
        }
        else {
            obj["noNote"] = true;
        }
    }
    else {
        obj["noNote"] = (notes["copy"] == null && notes["inheritDoc"] == null) && (notes["description"] == null || notes["description"] == "");
        noteInfoBlocks.push(notes);
    }

    obj["docs"] = noteInfoBlocks;

    if (text.indexOf("{", contentpos) >= 0) {
        obj["content"] = trim.trimAll(text.substring(contentpos, text.indexOf("{", contentpos)));
    }
    else {
        obj["content"] = trim.trimAll(text.substring(contentpos));
    }
}

function addTo(orgObj, addObj) {
    for (var key in addObj) {
        orgObj[key] = addObj[key];
    }
}

function isExport(statement) {

    if (!(statement.flags & TYPEFLAG.Export /* Export */)) {
        return false;
    }
    return true;
}