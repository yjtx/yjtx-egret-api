/**
 * Created by yjtx on 15-6-4.
 */

exports.sortWithName = function (tempClassObjs) {

    for (var key in tempClassObjs) {
        var classInfo = tempClassObjs[key];

        //排序
        classInfo["function"].sort(function (a, b) {
            return a["name"] > b["name"] ? 1 : -1
        });
        classInfo["member"].sort(function (a, b) {
            return a["name"] > b["name"] ? 1 : -1
        });
        classInfo["globalFunction"].sort(function (a, b) {
            return a["name"] > b["name"] ? 1 : -1
        });
        classInfo["globalMember"].sort(function (a, b) {
            return a["name"] > b["name"] ? 1 : -1
        });
    }
};
