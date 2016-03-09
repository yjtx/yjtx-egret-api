/**
 * Created by yjtx on 15-6-4.
 */
/**
 * 在class中插入children字段
 * @param tempClassArr
 */

var globals = require("../core/globals")

//补全 继承以及children
exports.addClassChildren = function (tempClassArr) {
    var classChildren = {};
    var classParent = {};

    for (var tempKey in tempClassArr) {
        var item = tempClassArr[tempKey];

        if (item.class) {//class interface
            var classInfo = item.class;
            if (classInfo["augments"] && classInfo["augments"].length) {
                var tempParent = classInfo["augments"][0];
                if (classChildren[tempParent] == null) {
                    classChildren[tempParent] = [];
                }
                classChildren[tempParent].push(tempKey);

                classParent[tempKey] = tempParent;
            }
        }
    }

    //补全继承关系，显示所有的继承类
    for (var key in tempClassArr) {
        var item = tempClassArr[key];

        if (item.class) {//class interface
            var classInfo = item.class;
            if (classInfo["augments"] && classInfo["augments"].length) {
                var parentName = classInfo["augments"][0];
                while (classParent[parentName]) {

                    classInfo["augments"].push(classParent[parentName]);
                    parentName = classParent[parentName];
                }
            }
        }
    }

    //显示所有的子类
    for (var key in tempClassArr) {
        var item = tempClassArr[key];

        if (item.class) {//class interface
            if (classChildren[key]) {
                var classInfo = item.class;
                classInfo["children"] = globals.clone(classChildren[key]);
            }
        }
    }
};