/**
 * Created by yjtx on 15-6-4.
 */

exports.screening = function (tempClassObjs) {
    //去掉非公共的
    for (var key in tempClassObjs) {
        var item = tempClassObjs[key];

        if (item.class) {
            if (needDelete(item) || needDelete(item.class)) {
                delete tempClassObjs[key];
                continue;
            }
        }

        deleteList(item["function"] || []);
        deleteList(item["member"] || []);
        deleteList(item["globalMember"] || []);
        deleteList(item["globalFunction"] || []);
    }

    //
    for (var key in tempClassObjs) {
        var item = tempClassObjs[key];
        if (item.class) {
            if (item.class.augments) {
                for (var i = 0; i < item.class.augments.length; i++) {
                    var tempK = item.class.augments[i];
                    if (tempClassObjs[tempK] == null) {
                        item.class.augments.splice(i, item.class.augments.length - i);
                        break;
                    }
                }
            }

            if (item.class.implements) {
                for (var i = 0; i < item.class.implements.length; i++) {
                    var tempK = item.class.implements[i]["name"];
                    if (tempClassObjs[tempK] == null) {
                        item.class.implements.splice(i, 1);
                        i--;
                    }
                }
            }

            if (item.class.children) {
                for (var i = 0; i < item.class.children.length; i++) {
                    var tempK = item.class.children[i];
                    if (tempClassObjs[tempK] == null) {
                        item.class.children.splice(i, 1);
                        i--;
                    }
                }
            }
        }
    }
};


function deleteList(list) {
    for (var i = list.length - 1; i >= 0; i--) {
        var item = list[i];
        if (needDelete(item)) {
            list.splice(i, 1);
        }
    }
}

function needDelete(item) {
    var bo = item.private == true || item.pType == "private" || item.pType == "protected";

    delete item.pType;

    return bo;
}