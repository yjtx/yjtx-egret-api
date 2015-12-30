var listAllData;

var classData = {};

var globalTypes = ["number", "string"];

function getGlobalTypeClass () {
    return "global.Types";
}

function isNormalType(type) {
    return globalTypes.indexOf(type) >= 0;
}

function getModule(className) {
    return classData[className];
}

function getClassHref(className) {
    return "#" + classData[className] + gapChar() + className;
}

function initAll() {
    getData("data/relation/list.json", function (data) {
        listAllData = JSON.parse(data);

        initModuleList();
    });
}

function initModuleList() {
    var selectType = document.getElementById("selectType");
    while (selectType.hasChildNodes()) {//当div下还存在子节点时 循环继续
        selectType.removeChild(selectType.firstChild);
    }

    var firstKey = "";
    for (var key in listAllData) {
        var option = document.createElement("option");
        option.setAttribute("value", key);
        option.setAttribute("data-update", new Date());
        option.innerText = key;

        selectType.appendChild(option);

        for (var key2 in listAllData[key]) {
            classData[listAllData[key][key2]] = key;
        }
    }

    for (var key in listAllData) {
        firstKey = key;
        break;
    }

    currentModule = getUrlModule() || firstKey;
    selectType.value = currentModule;

    changeModule(currentModule);
}


function selectType(module) {
    console.log(module);

    setHref(module);
}

function onClick(data, type) {
    console.log(type);
    if (type == "children") {
        var className = data.getAttribute("data-class-name");
        var module = getModule(className);
        console.log(className);
        setHref(module, className);
    }
    else if (type == "see") {
        var dataHref = data.getAttribute("data-href");

        var array = dataHref.split("#");
        className = array[0];
        var module = getModule(array[0]);
        console.log(className);
        setHref(module, className);
    }
}

function goto(node) {
    var className = node.getAttribute("data-class-name");
    var moduleKey = getModule(className);
    if (moduleKey == null) {
        console.warn("no " + className);
        return;
    }
    console.log(className);

    //setHref(moduleKey, className);
}


var currentModule;
function changeModule(moduleKey) {
    currentModule = moduleKey;

    changeClassList(currentModule);

    var className = getUrlClassName() || listAllData[moduleKey][0];
    changeClass(currentModule, className);
}

//刷新 class 列表
function changeClassList(moduleKey) {
    var list = document.getElementById("classList");
    clearList(list);

    var str = list.innerHTML;
    href = getMainHref() + "?m=" + moduleKey;

    var array = listAllData[moduleKey];
    for (var i = 0; i < array.length; i++) {
        var tempStr = str.replace(/\{class_name_desc\}/g, array[i].replace('globalFunction', "全局函数").replace('globalMember', "全局变量"));
        tempStr = tempStr.replace(/\{class_href\}/, "#" + moduleKey + gapChar() + array[i]);
        tempStr = tempStr.replace(/\{class_name\}/, array[i]);
        var node = document.createElement(list.firstElementChild.nodeName);
        node.innerHTML = tempStr;

        list.appendChild(node);
    }

    hideFirst(list);
}