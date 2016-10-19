/**
 * Created by yjtx on 15-6-5.
 */

var file = require("../core/file.js");
var trim = require("../core/trim");
var globals = require("../core/globals");
var path = require("path");

var splitStr = "@**@@";
function simplify(doc) {
    var docs = [];
    //去掉 /*****   ***/
    doc = doc.replace(/^\/(\*)+/, "");
    doc = doc.replace(/(\*)+\/$/, "");

    //根据@ 取出各个注释的值
    var reg = /(\n\r|\r\n|\n|\r)(\s)*(\*)(\s)*@/g;
    doc = doc.replace(reg, splitStr);

    var docArr = doc.split("@**@");
    for (var i = 0; i < docArr.length; i++) {
        var tempDoc = docArr[i];
        tempDoc = trim.trimAll(tempDoc);
        var str = change(tempDoc);
        if (str != "") {
            docs.push(str);
        }
    }

    return docs;
}

function change(doc) {
    if (doc.indexOf("@classdesc") == 0) {
        doc = doc.replace(/^@classdesc/, "");
    }

    var arr = ["language", "member", "method", "class", "extends", "constant", "constructor", "implements"];
    for (var i = 0; i <arr.length; i++) {
        if (doc.indexOf("@" + arr[i]) == 0) {
            var reg = new RegExp("@" + arr[i] + ".*");
            doc = doc.replace(reg, "");
            break;
        }
    }

    doc = trim.trimAll(doc);

    //修改换行符
    doc = doc.replace(/(\n\r|\r\n|\n|\r)/g, "\n");
    doc = doc.replace(/\n[ \f\r\t\v]*\*/g, "\n*");


    var codeArr = [];
    var idx = 0;
    while (getContains(doc, idx, true) != null) {
        var first = getContains(doc, idx, true);
        idx = first.index + first.length;
        var last = getContains(doc, idx, false);
        if (last == null) {
            throw Error(doc + '中 ' + first.type + ' 没有对应的');
        }

        var codeStr = doc.substring(first.index + first.length, last.index);
        doc = doc.substring(0, first.index + first.length) + doc.substring(last.index);

        codeStr = codeStr.replace(/((^\*)|(\n\*))(\s)?/g, "\n");
        codeStr = replaceSpecial(codeStr);
        codeArr.push(codeStr);
    }


    doc = doc.replace(/((^\*)|(\n\*))( )?/g, "");
    doc = doc.replace(/(\n)/g, "");


    var idx = 0;
    while (getContains(doc, idx, true) != null) {
        var first = getContains(doc, idx, true);
        idx = first.index + first.length;
        var last = getContains(doc, idx, false);

        var str = codeArr.shift();
        doc = doc.substring(0, first.index + first.length) + str + doc.substring(last.index);

    }

    doc = trim.trimAll(doc);
    return doc;
}

function getContains(doc, idx, isHead) {
    if (isHead) {
        if (doc.indexOf("<code>", idx) >= 0) {
            return {"index":doc.indexOf("<code>", idx), "length":6, "type":"<code>"};
        }

        if (doc.indexOf("<pre>", idx) >= 0) {
            return {"index":doc.indexOf("<pre>", idx), "length":5, "type":"<pre>"};
        }
    }
    else {
        if (doc.indexOf("</code>", idx) >= 0) {
            return {"index":doc.indexOf("</code>", idx), "length":7, "type":"</code>"};
        }

        if (doc.indexOf("</pre>", idx) >= 0) {
            return {"index":doc.indexOf("</pre>", idx), "length":6, "type":"</pre>"};
        }
    }

    return null;
}

function replaceSpecial(value) {
    var replaceArr = [];
    replaceArr.push(["&amp;", "&"]);
    replaceArr.push(["&lt;", "<"]);
    replaceArr.push(["&gt;", ">"]);
    replaceArr.push(["&quot;", "\""]);
    replaceArr.push(["&apos;", "\'"]);
    replaceArr.push(["<br/>", "\n"]);
    replaceArr.push(["&nbsp;", " "]);

    for (var i = 0; i < replaceArr.length; i++) {
        var k = replaceArr[i][0];
        var v = replaceArr[i][1];

        var reg = new RegExp(v, "g");
        value = value.replace(reg, k);
    }
    return value;
}


//处理只能单行书写的注释
function dealLineParam(doc, docs) {
    var notes = [/@language/, /@version/, /@platform/];

    for (var i = 0; i < notes.length; i++) {
        if (doc.indexOf("@" + notes) >= 0) {

        }
    }
}

exports.analyze = function analyze(doc) {
    //doc = simplify(doc);

    var docs = simplify(doc);

    //docs = doc.split(/@\*\*@/);
    //if (docs == null) {
    //    docs = [doc];
    //}

    var docInfo = {};
    for (var i = 0; i < docs.length; i++) {
        var item = docs[i];
        item = item.replace(/^(\s)*/, "");
        if (item == "") {
            continue;
        }

        if (item.charAt(0) != "@") {
            if (docInfo["description"] == null) {
                docInfo["description"] = trim.trimAll(item);
            }
            else {
                docInfo["description"] += trim.trimAll(item);
            }
            continue;
        }
        else {
            item = item.substring(1);
        }

        if (item.indexOf("private") == 0 || item.indexOf("internal") == 0) {//private，internal
            docInfo["private"] = true;
        }
        else if (item.indexOf("deprecated") == 0) {//deprecated
            //docInfo["deprecated"] = true;

            var temp = item.match(/^deprecated(\s)*/)[0];
            var des1 = item.substring(temp.length);
            docInfo["deprecated"] = trim.trimAll(des1);
        }
        else if (item.indexOf("readOnly") == 0) {//readOnly
            docInfo["rwType"] = 1;
        }
        else if (item.indexOf("writeOnly") == 0) {//writeOnly
            docInfo["rwType"] = 2;
        }
        else if (item.indexOf("inheritDoc") == 0) {//inheritDoc
            docInfo["inheritDoc"] = true;
        }
        else if (item.indexOf("param") == 0) {//param
            if (docInfo["params"] == null) {
                docInfo["params"] = {};
            }

            var itemArr = item.split(/^param(\s)+/);
            var paramName = itemArr[itemArr.length - 1].match(/^(\S)+/)[0];

            itemArr = itemArr[itemArr.length - 1].split(/^(\S)+(\s)+(\{(\s|\S)*\})?(\s)*/);
            var des = "";
            des = itemArr[itemArr.length - 1];

            docInfo["params"][paramName] = des;
        }
        else if (item.indexOf("example") == 0) {//example
            var temp = item.match(/^example(\s)*/)[0];
            var des1 = item.substring(temp.length);
            docInfo["example"] = trim.trimAll(des1);
        }
        else if (item.indexOf("includeExample") == 0) {//example
            var tname = item.match(/^includeExample(\s)+/)[0];
            var url = trim.trimAll(item.substring(tname.length));

            var expath = globals.getExampleRootPath();
            if (expath != null) {
                var content = file.read(path.join(expath, url));
                content = content.replace(/\r\n|\n\r|\r/g, "\n");
            }
            else {
                content = "";
            }

            //去掉language
            var lang = globals.getLanguage();
            var langReg = new RegExp(lang, "ig");
            var first = 0;
            var end = 0;
            while (true) {
                first = content.indexOf("/**", first);
                if (first < 0) {
                    break;
                }
                end = content.indexOf("*/", first);
                if (end < 0) {
                    break;
                }
                end = content.indexOf("\n", end) + 1;
                var comment = content.substring(first, end);
                if (comment.match(/@language/)) {
                    if (comment.match(langReg)) {
                        content = content.replace(/\n(\s)*\* @language.*/, "");
                        first = first + 1;
                    }
                    else {
                        content = content.replace(comment, "");
                    }
                }
                else {
                    first = first + 1;
                }

            }

            content = replaceSpecial(content);
            docInfo["example"] = "<pre>" + content + "</pre>";
        }
        else if (item.indexOf("return") == 0) {//return(s)
            if (!item.match(/^return(s)?(\s)*(\{[\s\S]*\})?(\s)*/)) {
            }
            var temp = item.match(/^return(s)?(\s)*(\{[\s\S]*\})?(\s)*/)[0];

            docInfo["returns"] = item.substring(temp.length);
        }
        else if (item.indexOf("event") == 0) {//event
            var temp = item.match(/^event(\s)+/)[0];
            if (docInfo["event"] == null) {
                docInfo["event"] = [];
            }
            var des1 = trim.trimAll(item.substring(temp.length));
            var eventType = des1.match(/(\S)+/)[0];
            var des2 = trim.trimAll(des1.substring(eventType.length));
            docInfo["event"].push({"name": eventType, "description": des2});
        }
        /*else if (item.indexOf("link") == 0) {
            var temp = item.match(/^link(\s)+/)[0];
            docInfo["see"] = item.substring(temp.length);
        }*/
        else if (item.indexOf("see") == 0) {
            var temp = item.match(/^see(\s)+/)[0];
            if (docInfo["see"] == null) {
                docInfo["see"] = [];
            }
            docInfo["see"].push(trim.trimAll(item.substring(temp.length)));
        }
        else if (item.indexOf("state") == 0) {//state
            var temp = item.match(/^state(\s)+/)[0];
            if (docInfo["state"] == null) {
                docInfo["state"] = [];
            }
            var des1 = trim.trimAll(item.substring(temp.length));
            var eventType = des1.match(/(\S)+/)[0];
            var des2 = trim.trimAll(des1.substring(eventType.length));
            docInfo["state"].push({"name": eventType, "description": des2});
        }
        else if (item.indexOf("skinPart") == 0) {//skinPart
            var reg = /^skinPart(\s)+/;
            if (item.match(reg)) {
                var temp = item.match(reg)[0];
                if (docInfo["skinPart"] == null) {
                    docInfo["skinPart"] = [];
                }
                var des1 = trim.trimAll(item.substring(temp.length));
                if (des1.match(/(\S)+/)) {
                    var eventType = des1.match(/(\S)+/)[0];
                    var des2 = trim.trimAll(des1.substring(eventType.length));
                    docInfo["skinPart"].push({"name": eventType, "description": des2});
                }
            }
        }
        else if (item.indexOf("defaultProperty") == 0) {
            var temp = item.match(/^defaultProperty(\s)+/)[0];
            var des1 = item.substring(temp.length);
            docInfo["defaultProperty"] = {"name" : des1};
        }
        else {//其他非特殊的标签  default version platform

            var docItems = item.match(/^(\S)+/);
            if (docItems == null) {
                console.warn("@ " + item);
            }

            var docName =docItems[0];
            var arr = [ "copy", "default", "example",
                "includeExample", "inheritDoc",
                "param", "params", "private", "internal",
                "return", "returns", "event",
                "version", "platform", "deprecated",
                "see", "state", "skinPart"];

            if (arr.indexOf(docName) >= 0) {
                docInfo[docName] = trim.trimAll(item.substring(docName.length) || "");
            }
        }
    }

    return docInfo;
};
