var ts = require("typescript");
var trim = require("../core/trim");
var globals = require("../core/globals");

exports.run = function run(fileNames, srcPath) {
    var options = {target: 2 /* ES6 */, module: 0 /* None */};
    var host = ts.createCompilerHost(options);
    var program = ts.createProgram(fileNames, options, host);
    var errors = program.getDiagnostics();
    if (errors.length > 0) {
        errors.forEach(function (diagnostic) {
            var lineChar = diagnostic.file.getLineAndCharacterFromPosition(diagnostic.start);
            console.log("" + diagnostic.file.filename + " (" + lineChar.line + "," + lineChar.character + "): " + diagnostic.messageText);
        });
        return;
    }

    var apiArr = [];
    program.getSourceFiles().forEach(function (sourceFile) {
        var filename = sourceFile.filename;
        if (filename.indexOf(srcPath) != 0) {
            return;
        }
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
        formatModule(statement, text, parent);
    }
}

function formatModule(statement, text, parent) {
    if (statement.flags & 2 /* Ambient */) {
        return;
    }

    if (statement.kind == 189 /* ModuleDeclaration */) {
        var objName = statement.name.text;
        if (parent[objName] == null) {
            parent[objName] = {"$_tree_": {}, "bodyType": "module"};
        }
        var tempParent = parent[objName]["$_tree_"];

        if (statement.body.statements) {
            var tempStatements = statement.body.statements;
            var length = tempStatements.length;
            for (var i = 0; i < length; i++) {
                var tempStatement = tempStatements[i];
                if (tempStatement.flags & 2 /* Ambient */) {
                }
                else if (tempStatement.kind == 189 /* ModuleDeclaration */) {
                    formatModule(tempStatement, text, parent[objName]["$_tree_"]);
                }
                else if (tempStatement.kind == 164 /* VariableStatement */) {
                    formatMember(tempStatement, text, parent[objName]["$_tree_"]);
                }
                else if (tempStatement.kind == 184 /* FunctionDeclaration */) {
                    formatMember(tempStatement, text, parent[objName]["$_tree_"]);

                }
                else if (tempStatement.kind == 186 /* InterfaceDeclaration */
                    || (tempStatement.kind == 185 /* ClassDeclaration */)
                    || (tempStatement.kind == 188 /* EnumDeclaration */) ) {
                    formatClass(tempStatement, text, parent[objName]["$_tree_"]);
                }
            }
        }
        else {
            var tempStatement = statement.body;
            if (tempStatement.flags & 2 /* Ambient */) {
            }
            else if (tempStatement.kind == 189 /* ModuleDeclaration */) {
                formatModule(tempStatement, text, parent[objName]["$_tree_"]);
            }
            //else if (tempStatement.kind == 164 /* VariableStatement */) {
            //    formatMember(tempStatement, text, parent[objName]["$_tree_"]);
            //}
            //else if (tempStatement.kind == 184 /* FunctionDeclaration */) {
            //    formatMember(tempStatement, text, parent[objName]["$_tree_"]);
            //
            //}
            //else if (tempStatement.kind == 186 /* InterfaceDeclaration */
            //    || (tempStatement.kind == 185 /* ClassDeclaration */)
            //    || (tempStatement.kind == 188 /* EnumDeclaration */) ) {
            //    formatClass(tempStatement, text, parent[objName]["$_tree_"]);
            //}
        }
    }
}

function formatClass(statement, text, parent) {
    if (!statement.name) {
        console.log("sdfsdf")
    }
    var objName = statement.name.getText();
    parent[objName] = {"$_tree_": {}};

    switch (statement.kind) {
        case 188 /* EnumDeclaration */ :
            parent[objName]["bodyType"] = "enum";
        case 186 /* InterfaceDeclaration */ :
            if (parent[objName]["bodyType"] == null) {
                parent[objName]["bodyType"] = "interface";
            }
        case 185 /* ClassDeclaration */ :
            if (parent[objName]["bodyType"] == null) {
                parent[objName]["bodyType"] = "class";
            }

            if (isExport(statement)) {//
                parent[objName]["public"] = "public";
            }
            else {
                parent[objName]["public"] = "private";
                //由于局部的enum可能会重复，导致生成问题，因此直接排除局部enum
                if (statement.kind == 188 /* EnumDeclaration */) {
                    delete parent[objName];
                    return;
                }
            }

            formatMembers(statement, text, parent[objName]["$_tree_"]);

            if (objName == "DisplayObject") {
                console.log("sdf");
            }

            if (statement.heritageClauses) {
                initExtends(statement.heritageClauses[0]["types"], parent[objName], text);
                if (statement.heritageClauses[1]) {
                    initImplements(statement.heritageClauses[1]["types"], parent[objName], text);
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
        obj["augments"].push(baseType.getText());
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
        obj["implements"].push(implementedTypes[i]["typeName"]["text"] || text.substring(implementedType["typeName"].pos, implementedType["typeName"].end));
    }
}


function formatMembers(declaration, text, parent, isStatic) {
    var members = declaration["members"];
    var length = members.length;

    var enumValue = 0;
    for (var i = 0; i < length; i++) {
        var member = members[i];
        formatMember(member, text, parent, isStatic);

        if (member.kind == 200 /* EnumMember */) {
            var name = member.name.getText();
            parent[name]["type"] = "number";
            if (parent[name]["default"] == null) {
                parent[name]["default"] = enumValue;
            }
            else {
                enumValue = parent[name]["default"];
            }
            enumValue++;
        }
    }
}

function formatMember(member, text, parent, isStatic) {
    var flags = member.flags;


    if (member.kind == 164 /* VariableStatement */) {
        var name = member.declarations[0].name.getText();

        if (parent[name] && parent[name]["bodyType"] == "interface") {
            parent[name]["bodyType"] = "class";

            formatMembers(member.declarations[0]["type"], text, parent[name]["$_tree_"], true);
            return;
        }
    }
    else if (member.kind == 126 /* Constructor */) {
        var name = "constructor";
    }
    else if (member.kind == 130 /* ConstructSignature */) {
        return;
    }
    else {
        var name = member.name.getText();
    }
    parent[name] = {};

    if (member.kind == 128 /* SetAccessor */) {
        parent[name]["bodyType"] = "SetAccessor";
        parent[name]["memberKind"] = "member";
    }
    else if (member.kind == 127 /* GetAccessor */) {
        parent[name]["bodyType"] = "GetAccessor";
        parent[name]["memberKind"] = "member";
    }
    else if (member.kind == 126 /* Constructor */) {
        parent[name]["bodyType"] = "function";
        parent[name]["memberKind"] = "function";
    }
    else if (member.kind == 125 /* Method */) {
        parent[name]["bodyType"] = "function";
        parent[name]["memberKind"] = "function";
    }
    else if (member.kind == 124 /* Property */) {
        parent[name]["bodyType"] = "Property";
        parent[name]["memberKind"] = "member";
    }
    else if (member.kind == 164 /* VariableStatement */) {
        parent[name]["bodyType"] = "modulevar";
        parent[name]["memberKind"] = "globalMember";
    }
    else if (member.kind == 184 /* FunctionDeclaration */) {
        parent[name]["bodyType"] = "modulefunction";
        parent[name]["memberKind"] = "globalFunction";

    }
    else if (member.kind == 200 /* EnumMember */) {
        parent[name]["bodyType"] = "Property";
        parent[name]["memberKind"] = "member";

    }

    //作用域
    if (name.charAt(0) == "$" || name.charAt(0) == "_") {
        parent[name]["pType"] = "protected";
    }
    else if (member.kind == 164 /* VariableStatement */) {
        if (isExport(member)) {
            parent[name]["pType"] = "public";
        }
        else {
            parent[name]["pType"] = "private";
        }
    }
    else if (member.kind == 184 /* FunctionDeclaration */) {
        if (isExport(member)) {
            parent[name]["pType"] = "public";
        }
        else {
            parent[name]["pType"] = "private";
        }
    }
    else {
        if (flags == 0 || (flags & 16 /* Public */)) {
            parent[name]["pType"] = "public";
        }
        else if (flags & 64 /* Protected */) {
            parent[name]["pType"] = "protected";
        }
        else {
            parent[name]["pType"] = "private";
        }
    }

    if (member.type) {//类型
        parent[name]["type"] = text.substring(member.type.pos, member.type.end);
    }

    if (member.initializer) {//默认值
        var str = trim.trimAll(text.substring(member.initializer.pos, member.initializer.end));
        parent[name]["default"] = str;
    }

    if (flags & 128 /* Static */) {
        parent[name]["scope"] = "static";
    }
    else if (member.kind == 200 /* EnumMember */) {
        parent[name]["scope"] = "static";
    }
    else if (isStatic) {
        parent[name]["scope"] = "static";
    }
    else {
        parent[name]["scope"] = "instance";
    }

    parent[name]["parameters"] = [];
    if (member.parameters && member.parameters.length) {
        for (var i1 = 0; i1 < member.parameters.length; i1++) {
            var parameter = member.parameters[i1];

            var tempParam = {};
            tempParam["name"] = parameter.name.getText();
            if (parameter.type) {
                tempParam["type"] = trim.trimAll(text.substring(parameter.type.pos, parameter.type.end));
            }

            if (parameter.initializer) {//默认值
                var str = trim.trimAll(text.substring(parameter.initializer.pos, parameter.initializer.end));
                tempParam["default"] = str;
            }
            parent[name]["parameters"].push(tempParam);
        }
    }

    getComments(text, member.pos, parent[name]);

}

var analyzedoc = require("../tools/analyzedoc");
function getComments(text, pos, obj) {
    var contentpos = pos;

    var note1 = ts.getLeadingCommentRanges(text, pos);
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

    var language = globals.getLanguage();
    var noteIdx = -1;
    for (var i2 = 0; i2 < noteStringBlocks.length; i2++) {
        var doc = noteStringBlocks[i2].toLowerCase();
        var reg = new RegExp("@language.*" + language);

        if (doc.match(reg)) {
            noteIdx = i2;
            break;
        }
    }

    var noteInfoBlocks = [];
    if (noteIdx != -1) {
        var doc = noteStringBlocks[noteIdx];
        noteInfoBlocks.push(analyzedoc.analyze(doc));
    }
    else {
        if (noteStringBlocks.length) {
            //for (var i = 0; i < noteStringBlocks.length; i++) {
            //    var doc = noteStringBlocks[i];
            //    noteInfoBlocks.push(analyzedoc.analyze(doc));
            //}
            var doc = noteStringBlocks[noteStringBlocks.length - 1];
            noteInfoBlocks.push(analyzedoc.analyze(doc));
        }
    }
    obj["docs"] = noteInfoBlocks;

    if (text.indexOf("{", contentpos) >= 0) {
        obj["content"] = trim.trimAll(text.substring(contentpos, text.indexOf("{", contentpos)));
    }
    else {
        obj["content"] = trim.trimAll(text.substring(contentpos));
    }
}

function isExport(statement) {
    if (!(statement.flags & 1 /* Export */)) {
        return false;
    }
    return true;
}