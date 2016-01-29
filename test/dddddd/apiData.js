/**
 * Created by yjtx on 16/1/28.
 *
 * 记录数据
 */
var d_listData = {};
function loadListData(callback) {
    getData("data/relation/list.json", function (data) {
        d_listData = JSON.parse(data);

        for (var key in d_listData) {
            for (var key2 in d_listData[key]) {
                classData[d_listData[key][key2]] = key;
            }
        }

        callback();
    });
}

var d_classesData = {};
function loadClassData(moduleName, className, callback) {
    getData("data/finalClasses/" + moduleName + "/" + className + ".json", function (data) {
        var apiData = JSON.parse(data);

        d_classesData[moduleName + "/" + className] = apiData;

        callback();
    });
}

function getFirstModuleName() {
    for (var key in d_listData) {
        return key;
    }

    return null;
}

function getModuleNames() {
    var arr = [];
    for (var key in d_listData) {
        arr.push(key);
    }

    return arr;
}

function getClassNamesByModule(moduleName) {
    return d_listData[moduleName];
}

//获取类信息
function getClassData(moduleName, className) {
    return d_classesData[moduleName + "/" + className];
}

//是否已经加载过
function isClassDataLoaded(moduleName, className) {
    return d_classesData[moduleName + "/" + className] != null;
}

//获取第一个模块的类名字
function getFirstClassName(moduleName) {
    var list = d_listData[moduleName];

    return list[0];
}

var classData = {};
function getModule(className) {
    return classData[className];
}
