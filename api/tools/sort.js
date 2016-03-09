/**
 * Created by yjtx on 15-6-4.
 */

exports.sortWithName = function (tempClassObjs) {

    for (var key in tempClassObjs) {
        var classInfo = tempClassObjs[key];

        //排序
        classInfo["function"].sort(function (a, b) {
            if (a["name"] == "constructor") {
                return -1;
            }
            if (b["name"] == "constructor") {
                return 1;
            }
            return a["name"] > b["name"] ? 1 : -1;
        });
        classInfo["member"].sort(function (a, b) {
            return a["name"] > b["name"] ? 1 : -1;
        });
        classInfo["globalFunction"].sort(function (a, b) {
            return a["name"] > b["name"] ? 1 : -1;
        });
        classInfo["globalMember"].sort(function (a, b) {
            return a["name"] > b["name"] ? 1 : -1;
        });
    }

    //修改构成函数的名称
    for (var key in tempClassObjs) {
        var classInfo = tempClassObjs[key];

        if (classInfo["function"] && classInfo["function"].length > 0) {
            var item = classInfo["function"][0];
            if (item["name"] == "constructor") {
                item["name"] = classInfo["class"]["name"];
            }
        }
    }
};
