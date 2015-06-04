/**
 * Created by yjtx on 15-6-4.
 */
/**
 * 在class中插入children字段
 * @param tempClassArr
 */
exports.addClassChildren = function (tempClassArr) {
    var classChildren = {};
    for (var tempKey in tempClassArr) {
        var item = tempClassArr[tempKey];

        if (item.class) {//class interface
            var classInfo = item.class;
            if (classInfo["augments"] && classInfo["augments"].length) {
                var classParent = classInfo["augments"][0];
                if (classChildren[classParent] == null) {
                    classChildren[classParent] = [];
                }
                classChildren[classParent].push(tempKey);
            }
        }
    }

    for (var key in tempClassArr) {
        var item = tempClassArr[key];

        if (item.class) {//class interface
            if (classChildren[key]) {
                var classInfo = item.class;
                classInfo["children"] = classChildren[key];
            }
        }
    }
};