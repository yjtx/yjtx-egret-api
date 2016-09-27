/**
 * Created by yjtx on 15-6-5.
 * 将类名补全
 */
var trim = require("../core/trim");
var property = require("../tools/apiProperty");

exports.relative = function (tempClassObjs) {
    //去掉非公共的
    for (var key in tempClassObjs) {
        var item = tempClassObjs[key];

        if (item.class && item.class.filename) {
            item.class.filename = property.getRelativePath(item.class.filename).replace(/\//g, "\\");
        }
        else {
            deleteList(item["globalMember"] || []);
            deleteList(item["globalFunction"] || []);
        }

    }
};


function deleteList(list) {
    for (var i = list.length - 1; i >= 0; i--) {
        var item = list[i];
        item.filename = property.getRelativePath(item.filename).replace(/\//g, "\\");
    }
}
