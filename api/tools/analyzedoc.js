/**
 * Created by yjtx on 15-6-5.
 */

var file = require("../core/file.js");
var trim = require("../core/trim");
var globals = require("../core/globals");
var path = require("path");

var flags = require("../tools/enumflag").getEnumFlag();

function simplify(doc) {
    //doc = doc.replace(/^\/(\/)+/, "");

    doc = doc.replace(/(\n\r|\r\n|\n|\r)/g, "\n");

    doc = doc.replace(/^\/(\*)+/, "");
    doc = doc.replace(/(\*)+\/$/, "");


    doc = doc.replace(/(\n)(\s)*(\*)+(\s)*@/g, "\n@");

    doc = doc.replace(/(\s)*(\*)+(\s)*/g, "");

    //doc = doc.replace(/(\n)(\s)*(\*)+[^\S\n]?/g, "\n");

    //去掉 @member
    doc = doc.replace(/@language.*/, "");

    //去掉 @member
    doc = doc.replace(/@member.*/, "");
    //去掉 @method
    doc = doc.replace(/@method.*/, "");
    //去掉 @class
    doc = doc.replace(/@class .*/, "");
    //去掉 @extends
    doc = doc.replace(/@extends.*/, "");
    //去掉 @constant
    doc = doc.replace(/@constant.*/, "");
    //去掉 @constructor
    doc = doc.replace(/@constructor.*/, "");
    //去掉 @implements
    doc = doc.replace(/@implements.*/, "");

    doc = doc.replace(/^(\s)*/, "");
    doc = doc.replace(/(\s)*$/, "");
    return doc;
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
    doc = simplify(doc);

    var docs;

    docs = doc.split(/\n\@/);
    if (docs == null) {
        docs = [doc];
    }

    var docInfo = {};
    for (var i = 0; i < docs.length; i++) {
        var item = docs[i];
        item = item.replace(/^(\s)*/, "");
        if (item == "") {
            continue;
        }

        //描述
        if (i == 0 && item.charAt(0) != "@") {
            docInfo["description"] = item;
            continue;
        }
        else if (i == 0) {
            item = item.substring(1);
        }

        if (item.indexOf("classdesc") == 0) {//兼容类描述
            if (item.match(/^classdesc(\s)+/)) {
                var temp = item.match(/^classdesc(\s)+/)[0];
                if (docInfo["description"] == null) {
                    docInfo["description"] = item.substring(temp.length);
                }
                else {
                    docInfo["description"] += "\n" + item.substring(temp.length);
                }
            }
            else {
                //console.log("sdf");
            }
        }
        else if (item.indexOf("private") == 0) {//private
            docInfo["private"] = true;
        }
        else if (item.indexOf("deprecated") == 0) {//deprecated
            docInfo["deprecated"] = true;
        }
        else if (item.indexOf("inheritDoc") == 0) {//deprecated
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
            docInfo["example"] = {};
            var temp = item.match(/^example(\s)+/)[0];
            var des1 = item.substring(temp.length);

            var reg = /<code>[\s\S]*<\/code>/;
            if (des1.match(reg)) {
                var code = des1.match(reg)[0];
                docInfo["example"]["code"] = des1.substring(des1.indexOf("<code>") + 6, des1.indexOf("</code>"));
                des1 = des1.replace(code, "");
            }
            docInfo["example"]["description"] = trim.trimAll(des1);
        }
        else if (item.indexOf("includeExample") == 0) {//example
            docInfo["example"] = {};
            var tname = item.match(/^includeExample(\s)+/)[0];
            var url = trim.trimAll(item.substring(tname.length));
            docInfo["example"]["code"] = file.read(path.join(globals.getExampleRootPath(), url));
            docInfo["example"]["description"] = "";
        }
        else if (item.indexOf("return") == 0) {//return(s)
            if (!item.match(/^return(s)?(\s)*(\{[\s\S]*\})?(\s)*/)) {
                console.log("sdf")
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
        else {//其他非特殊的标签  default version platform
            var docName = item.match(/^(\S)+/)[0];
            var arr = [ "copy", "default", "example",
                "includeExample", "inheritDoc",
                "param", "params", "private",
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
