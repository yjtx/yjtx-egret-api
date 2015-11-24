var apiData;

var headerStr = document.getElementById("classHeader").innerHTML;

var apiDebug = false;

var currentModuleKey;
function resetModuleList(moduleKey, moduleData, className) {
    if (className == null || className == "") {
        for (var key in moduleData) {
            className = moduleData[key];
            break;
        }
    }

    if (currentModuleKey != moduleKey) {
        currentModuleKey = moduleKey;

        initClassList(moduleKey, moduleData);
    }

    getData("data/finalClasses/" + moduleKey + "/" + className + ".json", function (data) {
        apiData = JSON.parse(data);
        console.log(apiData);

        initHead();
    });

}

function clearList(list) {
    while (list.childElementCount > 1) {
        list.removeChild(list.lastElementChild);
    }

    if (!list.getAttribute("div_display")) {
        list.setAttribute("div_display", list.firstElementChild.style.display || "error");
    }
    if (!apiDebug) {
        var display = list.getAttribute("div_display");
        if (display == "error") {
            delete list.firstElementChild.style.display;
        }
        else {
            list.firstElementChild.style.display = display;
        }
    }
}

function hideFirst(list) {
    if (apiDebug) {
    }
    else {
        list.firstElementChild.style.display = "none";
    }
}

function goto(node) {
    var className = node.getAttribute("data-class-name");
    console.log(className);

    resetModuleList(currentModuleKey, null, className);
}

var memberHide = true;
var methodyHide = true;

function initClassList(moduleKey, listData) {
    var list = document.getElementById("classList");
    clearList(list);

    var str = list.innerHTML;
    var href = window.location.href;
    if (href.indexOf("?") >= 0) {
        href = href.substr(0, href.indexOf("?"));
    }
    else if (href.indexOf("#") >= 0) {
        href = href.substr(0, href.indexOf("#"));
    }

    var array = listData;
    for (var i = 0; i < array.length; i++) {
        var tempStr = str.replace(/\{class_name_desc\}/g, array[i].replace('globalFunction', "全局函数").replace('globalMember', "全局变量"));
        tempStr = tempStr.replace(/\{class_href\}/, href + "#" + array[i]);
        tempStr = tempStr.replace(/\{class_name\}/, array[i]);
        var node = document.createElement(list.firstElementChild.nodeName);
        node.innerHTML = tempStr;

        list.appendChild(node);
    }

    hideFirst(list);
}

function initHead() {
    var headerTable = document.getElementById("headerTable");

    //return;

    createMembers(apiData.member || apiData.globalMember || []);
    createMethods(apiData.function || apiData.globalFunction || []);

    createEvents();

    createPropertyDetails(apiData.member || apiData.globalMember || []);
    createMethodDetails(apiData.function || apiData.globalFunction || []);

    initClassData();
}

function initClassData() {
    var node = document.getElementById("classHeader");

    if (apiData.class) {
        var str = headerStr;
        str = str.replace(/\{memberof\}/g, apiData.class.memberof);
        str = str.replace(/\{name\}/g, apiData.class.name);
        str = str.replace(/\{description\}/g, apiData.class.description);

        node.innerHTML = str;

        createExtends(node);
        createChildren(node);
        createSee();

        node.style.display = "block";
    }
    else {
        node.style.display = "none";
    }

}

function createExtends(node) {
    var parentNode = node.getElementsByClassName("parentsId")[0];
    clearList(parentNode);

    if (apiData.class && apiData.class.augments && apiData.class.augments.length > 0) {
        var str = parentNode.innerHTML;

        var augments = apiData.class.augments;
        for (var i = 0; i < augments.length; i++) {
            var tempStr = str.replace(/\{parent_name\}/g, augments[i]);
            var node = document.createElement(parentNode.firstElementChild.nodeName);
            parentNode.appendChild(node);
            node.outerHTML = tempStr;
        }
    }

    hideFirst(parentNode);
}


function createChildren(node) {
    var parentNode = node.getElementsByClassName("childrenId")[0];
    clearList(parentNode);

    if (apiData.class && apiData.class.children && apiData.class.children.length > 0) {
        var str = parentNode.innerHTML;

        var children = apiData.class.children;
        for (var i = 0; i < children.length; i++) {
            var tempStr = str.replace(/\{child_name\}/g, children[i]);
            var node = document.createElement(parentNode.firstElementChild.nodeName);
            node.innerHTML = tempStr;
            parentNode.appendChild(node);

            if (i == children.length - 1) {
                node.lastElementChild.removeChild(node.lastElementChild.lastElementChild);
            }
        }
    }

    hideFirst(parentNode);
}

function createSee() {
    //return;
    var seeElement = document.getElementById("see");

    if (apiData.class && apiData.class.see && apiData.class.see.length) {
        var seeListElement = document.getElementById("seeList1");
        var seeItemStr = seeListElement.innerHTML;

        var children = apiData.class.see;
        for (var i = 0; i < children.length; i++) {
            var des = children[i];
            var tempStr;
            if (des.indexOf("http:") >= 0) {
                var array = des.split(" ");
                tempStr = seeItemStr.replace(/\{see_name\}/g, array[0]);
                tempStr = seeItemStr.replace(/\{see_href\}/g, array[0]);
                tempStr = tempStr.replace(/\{see_description\}/g, array[1]);
            }
            else if (des[0] == "\"") {
                tempStr = seeItemStr.replace(/\{see_name\}/g, des);
                tempStr = seeItemStr.replace(/\{see_href\}/g, "#");
                tempStr = tempStr.replace(/\{see_description\}/g, des);
            }
            else {
                tempStr = seeItemStr.replace(/\{see_name\}/g, des);
                tempStr = seeItemStr.replace(/\{see_href\}/g, "#");
                tempStr = tempStr.replace(/\{see_description\}/g, des);
            }

            var node = document.createElement(seeListElement.firstElementChild.nodeName);
            seeListElement.appendChild(node);
            node.outerHTML = tempStr;
        }

        seeListElement.removeChild(seeListElement.firstElementChild);

        seeElement.style.display = "block";
    }
    else {
        seeElement.style.display = "none";
    }
}


function createMembers(dataList) {
    var members = document.getElementById("members");
    clearList(members);

    var node = members;

    var nodestr = node.innerHTML;
    for (var i = 0; i < dataList.length; i++) {
        var member = dataList[i];

        var newNodestr = nodestr.replace(/\{name\}/g, member["name"]);
        newNodestr = newNodestr.replace(/\{memberof\}/g, member["memberof"]);
        newNodestr = newNodestr.replace(/\{type\}/g, member["type"]);
        newNodestr = newNodestr.replace(/\{default\}/g, member["default"]);

        var description = getFirstSpan(member["description"]);
        if (member["scope"] == "static") {
            description = "[常量]" + description;
        }
        if (member["rwType"] == 1) {
            description = "[只读]" + description;
        }
        if (member["rwType"] == 2) {
            description = "[只写]" + description;
        }

        newNodestr = newNodestr.replace(/\{description\}/g, description);
        newNodestr = newNodestr.replace(/\{inherited\}/g, member["inherited"] ? "block" : "none");



        var newNode = document.createElement(node.firstElementChild.nodeName);
        newNode.innerHTML = newNodestr;
        newNode.setAttribute("inherited", member["inherited"]);

        members.appendChild(newNode);

        if (memberHide && member["inherited"]) {
            newNode.style.display = "none";
        }

        if (member["default"] == null) {
            var defNode = newNode.getElementsByClassName("defaultValue")[0];
            defNode.parentNode.removeChild(defNode);
        }
    }

    hideFirst(members);
}

function createMethods(dataList) {

    var members = document.getElementById("methods");
    clearList(members);

    var node = members;

    var nodestr = node.innerHTML;

    for (var i = 0; i < dataList.length; i++) {
        var member = dataList[i];

        var newNodestr = nodestr.replace(/\{name\}/g, member["name"]);
        newNodestr = newNodestr.replace(/\{memberof\}/g, member["memberof"]);
        newNodestr = newNodestr.replace(/\{type\}/g, member["type"]);

        var description = getFirstSpan(member["description"]);
        if (member["scope"] == "static") {
            description = "[静态]" + description;
        }

        newNodestr = newNodestr.replace(/\{description\}/g, description);
        newNodestr = newNodestr.replace(/\{inherited\}/g, getFirstSpan(member["inherited"] ? "block" : "none"));

        var newNode = document.createElement(node.firstElementChild.nodeName);
        newNode.innerHTML = newNodestr;
        newNode.setAttribute("inherited", member["inherited"]);
        members.appendChild(newNode);
        if (methodyHide && member["inherited"]) {
            newNode.style.display = "none";
        }

        var functionType = newNode.getElementsByClassName("functionType1")[0]
        if (member["type"] == null) {
            functionType.parentNode.removeChild(functionType);
        }

        var paramsList1 = newNode.getElementsByClassName("paramsList1")[0]
        var paramsListStr = paramsList1.innerHTML;

        for (var j = 0; member.params && j < member.params.length; j++) {
            var param = member.params[j];

            var str = paramsListStr.replace(/\{param_name\}/g, param.name);
            str = str.replace(/\{param_type\}/g, param.type);

            var tempNode = document.createElement(paramsList1.firstElementChild.nodeName);
            tempNode.innerHTML = str;

            paramsList1.appendChild(tempNode);

            if (j == member.params.length - 1) {
                tempNode.lastElementChild.removeChild(tempNode.lastElementChild.lastElementChild);

                if (param.name.indexOf("...") == 0) {
                    tempNode.lastElementChild.removeChild(tempNode.lastElementChild.lastElementChild);
                    tempNode.lastElementChild.removeChild(tempNode.lastElementChild.lastElementChild);
                }
            }
        }
        paramsList1.removeChild(paramsList1.firstElementChild);
    }

    hideFirst(members);
}


function createEvents() {

    var members = document.getElementById("events");
    clearList(members);

    var node = members;

    var nodestr = node.innerHTML;
    console.log(nodestr);
    for (var i = 0; apiData.class && apiData.class.event && i < apiData.class.event.length; i++) {
        var member = apiData.class.event[i];

        var newNodestr = nodestr.replace(/\{name\}/g, member["name"]);
        newNodestr = newNodestr.replace(/\{description\}/g, getFirstSpan(member["description"]));

        var newNode = document.createElement(node.firstElementChild.nodeName);
        newNode.innerHTML = newNodestr;

        members.appendChild(newNode);
    }

    hideFirst(members);
}


function createPropertyDetails(dataList) {
    var members = document.getElementById("propertyDetails");
    clearList(members);

    var node = members;

    var nodestr = node.innerHTML;
    console.log(nodestr);
    for (var i = 0; i < dataList.length; i++) {
        var member = dataList[i];

        var newNodestr = nodestr.replace(/\{name\}/g, member["name"]);
        newNodestr = newNodestr.replace(/\{memberof\}/g, member["memberof"]);
        newNodestr = newNodestr.replace(/\{type\}/g, member["type"]);
        newNodestr = newNodestr.replace(/\{version\}/g, member["version"]);
        newNodestr = newNodestr.replace(/\{platform\}/g, member["platform"]);
        newNodestr = newNodestr.replace(/\{description\}/g, member["description"]);

        var newNode = document.createElement(node.firstElementChild.nodeName);
        newNode.innerHTML = newNodestr;

        if (member["rwType"] == 1) {
            var rwNode = newNode.getElementsByClassName("setProperty")[0];
            rwNode.parentNode.removeChild(rwNode);
        }
        if (member["rwType"] == 2) {
            var rwNode = newNode.getElementsByClassName("getProperty")[0];
            rwNode.parentNode.removeChild(rwNode);
        }

        members.appendChild(newNode);
    }

    hideFirst(members);
}

function createMethodDetails(dataList) {
    var members = document.getElementById("methodDetails");
    clearList(members);

    var node = members;

    var nodestr = node.innerHTML;

    for (var i = 0; i < dataList.length; i++) {
        var member = dataList[i];

        var newNodestr = nodestr.replace(/\{name\}/g, member["name"]);
        newNodestr = newNodestr.replace(/\{memberof\}/g, member["memberof"]);
        newNodestr = newNodestr.replace(/\{type\}/g, member["type"]);
        newNodestr = newNodestr.replace(/\{version\}/g, member["version"]);
        newNodestr = newNodestr.replace(/\{platform\}/g, member["platform"]);
        newNodestr = newNodestr.replace(/\{description\}/g, member["description"]);

        var newNode = document.createElement(node.firstElementChild.nodeName);
        newNode.innerHTML = newNodestr;

        var functionType = newNode.getElementsByClassName("functionType2")[0]
        if (member["type"] == null) {
            functionType.parentNode.removeChild(functionType);
        }

        var seeMore = newNode.getElementsByClassName("seeMore")[0]
        if (member.see) {
            var seelist = newNode.getElementsByClassName("seelist")[0]
            var seeElementStr = seelist.innerHTML;
            for (var j = 0; j < member.see.length; j++) {
                var seeStr = member.see[j];
                var str = seeElementStr.replace(/\{desc\}/g, seeStr);

                var node = seelist.firstElementChild.cloneNode();
                node.innerHTML = str;
                seelist.appendChild(node);
            }

            seelist.removeChild(seelist.firstElementChild);
        }
        else {
            seeMore.parentNode.removeChild(seeMore);
        }


        var paramsList2 = newNode.getElementsByClassName("paramsList2")[0]
        var paramsList2Str = paramsList2.innerHTML;

        var paramsList3 = newNode.getElementsByClassName("paramsList3")[0]
        var paramsList3Str = paramsList3.innerHTML;

        var parstr1 = "";
        var parstr3 = "";
        for (var j = 0; member.params && j < member.params.length; j++) {
            var param = member.params[j];

            var str = paramsList2Str.replace(/\{param_name\}/g, param.name);
            str = str.replace(/\{param_type\}/g, param.type);

            var paramsNode2 = document.createElement(paramsList2.firstElementChild.nodeName);
            paramsNode2.innerHTML = str;
            paramsList2.appendChild(paramsNode2);

            var str = paramsList3Str.replace(/\{param_name\}/g, param.name);
            str = str.replace(/\{param_type\}/g, param.type);
            str = str.replace(/\{param_description\}/g, param.description);
            var paramsNode3 = document.createElement(paramsList3.firstElementChild.nodeName);
            paramsNode3.innerHTML = str;
            paramsList3.appendChild(paramsNode3);


            if (j == member.params.length - 1) {
                paramsNode2.lastElementChild.removeChild(paramsNode2.lastElementChild.lastElementChild);

                if (param.name.indexOf("...") == 0) {
                    paramsNode2.lastElementChild.removeChild(paramsNode2.lastElementChild.lastElementChild);
                    paramsNode2.lastElementChild.removeChild(paramsNode2.lastElementChild.lastElementChild);

                    var lastElementChild = paramsNode3.lastElementChild.lastElementChild;
                    paramsNode3.lastElementChild.removeChild(paramsNode3.lastElementChild.lastElementChild);
                    paramsNode3.lastElementChild.removeChild(paramsNode3.lastElementChild.lastElementChild);
                    paramsNode3.lastElementChild.removeChild(paramsNode3.lastElementChild.lastElementChild);

                    paramsNode3.lastElementChild.appendChild(lastElementChild);
                }
            }
        }

        paramsList2.removeChild(paramsList2.firstElementChild);
        paramsList3.removeChild(paramsList3.firstElementChild);

        members.appendChild(newNode);
    }

    hideFirst(members);
}

function getFirstSpan(des) {
    if (des == null) {
        return "";
    }
    var i1 = des.indexOf("。") < 0 ? des.length : des.indexOf("。");
    var i2 = des.indexOf("<br/>") < 0 ? des.length : des.indexOf("<br/>");

    return des.substr(0, Math.min(i1, i2));
}


function setValue(element, value) {
    if ("innerText" in element) {
        element.innerText = value;
    }
    else if ("textContent" in element) {
        element.textContent = value;
    }
}

function InheritedProperty() {
    memberHide = !memberHide;
    var members = document.getElementById("members");
    for (var i = 0; i < members.childElementCount; i++) {
        var node = members.children[i];

        var inherited = node.getAttribute("inherited") == "true";
        if (memberHide && inherited) {
            node.style.display = "none";
        }
        else {
            if (node.style.display == "none") {
                node.style.display = "table-row";
            }
        }
    }
}

function InheritedMethod() {
    methodyHide = !methodyHide;
    var members = document.getElementById("methods");
    for (var i = 0; i < members.childElementCount; i++) {
        var node = members.children[i];

        var inherited = node.getAttribute("inherited") == "true";
        if (methodyHide && inherited) {
            node.style.display = "none";
        }
        else {
            if (node.style.display == "none") {
                node.style.display = "table-row";
            }
        }
    }
}