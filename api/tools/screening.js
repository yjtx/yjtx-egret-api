/**
 * Created by yjtx on 15-6-4.
 */

exports.screening = function (tempClassObjs) {
    for (var key in tempClassObjs) {
        var item = tempClassObjs[key];
        if (item.class) {
            if (needDelete(item.class)) {
                delete tempClassObjs[key];
                continue;
            }
        }
        deleteList(item["function"] || []);
        deleteList(item["member"] || []);
        deleteList(item["globalMember"] || []);
        deleteList(item["globalFunction"] || []);
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
    return item.private == true || item.pType == "private" || item.pType == "protected";
}