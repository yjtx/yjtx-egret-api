var apiData;

var mainHref;
function init() {
    mainHref = window.location.href;
    var className = "";
    if (mainHref.indexOf("#") >= 0) {
        className = mainHref.substr(mainHref.indexOf("#") + 1, mainHref.length);

        mainHref = mainHref.substr(0, mainHref.indexOf("#"));

        var array = className.split("_");
        if (array[0].length > 0) {
            var module = getModule(array[0]);
            initModule(module, array[0]);
            return;
        }
    }
    for (var key in listData) {
        initModule(key);
        break;
    }
}

var listData = {};
var classData = {};

function initAll() {
    getData("data/relation/list.json", function (data) {
        listData = JSON.parse(data);

        for (var key in listData) {
            for (var key2 in listData[key]) {
                classData[listData[key][key2]] = key;
            }
        }

        init();
    });
}

function selectType(module) {
    console.log(module);

    window.location.href = mainHref + "#";
    initModule(module);
}

function onClick(data, type) {
    console.log(type);
    if (type == "children") {
        var className = data.getAttribute("data-class-name");
        var module = getModule(className);
        console.log(className);
        initModule(module, className);
    }
    else if (type == "see") {
        var dataHref = data.getAttribute("data-href");
        //window.location.href = mainHref + "#" + dataHref;

        var array = dataHref.split("#");
        className = array[0];
        var module = getModule(array[0]);
        console.log(className);
        initModule(module, className);
    }
}

function getModule(className) {
    return classData[className];
}

function initModule(module, className) {
    resetModuleList(module, listData[module], className);
}

initAll();
