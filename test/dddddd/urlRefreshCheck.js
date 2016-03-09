var u_tempModule;
var u_tempClass;
var u_tempNode;

var u_listData;
function initAll() {
    getData("data/relation/list.json", function (data) {
        u_listData = JSON.parse(data);

        initModuleList();
    });
}

function refresh (moduleName, className, nodeName) {
    if (u_tempModule != moduleName) {
        //刷新列表
        u_initList(moduleName, className);
        u_getClassData(moduleName, className);
    }
    else if (u_tempClass != className) {
        //刷新页面
        u_getClassData(moduleName, className);
    }
    else if (u_tempNode != nodeName) {
        //重新赋值 href
        //window.location.href = window.location.href;
    }
}

function u_initList(moduleName, className) {

}

var u_classJsons = {};
function u_initClass(moduleName, className) {
    initClass();

    window.location.href = window.location.href;
}

function u_getClassData(moduleName, className) {
    var apiData;
    if (u_classJsons[moduleName + "/" + className]) {
        apiData = classJsons[moduleName + "/" + className];
        u_initClass();
    }
    else {
        getData("data/finalClasses/" + moduleName + "/" + className + ".json", function (data) {
            apiData = JSON.parse(data);

            u_classJsons[moduleName + "/" + className] = apiData;

            u_initClass();
        });
    }
}

function getCurrentModule() {
    return u_tempModule;
}

function getCurrentClass() {
    return u_tempClass;
}