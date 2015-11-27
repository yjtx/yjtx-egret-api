
var apiData;

var memberHide = true;
var methodyHide = true;
var headerStr = document.getElementById("classHeader").innerHTML;

function changeClass(moduleKey, className) {
    getData("data/finalClasses/" + moduleKey + "/" + className + ".json", function (data) {
        apiData = JSON.parse(data);

        initClass();
    });
}

function initClass() {
    initClassData();

    createMembers(apiData.member || apiData.globalMember || []);
    createMethods(apiData.function || apiData.globalFunction || []);

    createEvents();

    createPropertyDetails(apiData.member || apiData.globalMember || []);
    createMethodDetails(apiData.function || apiData.globalFunction || []);

    createExample();

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
            tempStr = tempStr.replace(/\{parent_href\}/g, "#" + getModule(augments[i]) + "_" + augments[i]);

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
            tempStr = tempStr.replace(/\{child_href\}/g, "#" + getModule(children[i]) + "_" + children[i]);

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
                tempStr = tempStr.replace(/\{see_href\}/g, array[0]);
                tempStr = tempStr.replace(/\{see_description\}/g, array[1]);
            }
            else if (des[0] == "\"") {
                tempStr = seeItemStr.replace(/\{see_name\}/g, des);
                tempStr = tempStr.replace(/\{see_href\}/g, "#" + des);
                tempStr = tempStr.replace(/\{see_description\}/g, des);
            }
            else {
                tempStr = seeItemStr.replace(/\{see_name\}/g, des);
                tempStr = tempStr.replace(/\{see_href\}/g, "#" + des);
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
        newNodestr = newNodestr.replace(/\{memberof\}/g, getMemberof(member));
        newNodestr = newNodestr.replace(/\{moduleof\}/g, getModule(getMemberof(member)));
        newNodestr = newNodestr.replace(/\{type\}/g, member["type"]);

        var description = getFirstSpan(member["description"]);
        if (member["scope"] == "static") {
            description = "[常量] " + description;
            newNodestr = newNodestr.replace(/\{default\}/g, member["default"]);
        }

        if (member["rwType"] == 1) {
            description = "[只读] " + description;
        }
        if (member["rwType"] == 2) {
            description = "[只写] " + description;
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

        if (member["scope"] != "static") {
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
        newNodestr = newNodestr.replace(/\{memberof\}/g, getMemberof(member));
        newNodestr = newNodestr.replace(/\{moduleof\}/g, getModule(getMemberof(member)));
        newNodestr = newNodestr.replace(/\{type\}/g, member["type"]);

        var description = getFirstSpan(member["description"]);
        if (member["scope"] == "static") {
            description = "[静态] " + description;
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
            str = str.replace(/\{param_href\}/g, getClassHref(param.type));

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
    for (var i = 0; i < dataList.length; i++) {
        var member = dataList[i];

        var newNodestr = nodestr.replace(/\{name\}/g, member["name"]);
        newNodestr = newNodestr.replace(/\{memberof\}/g, getMemberof(member));
        newNodestr = newNodestr.replace(/\{moduleof\}/g, getModule(getMemberof(member)));
        newNodestr = newNodestr.replace(/\{type\}/g, member["type"]);
        newNodestr = newNodestr.replace(/\{version\}/g, member["version"] || "all");
        newNodestr = newNodestr.replace(/\{platform\}/g, member["platform"] || "Web,Runtime");
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

        if (member.example) {
            var exampleNode = newNode.getElementsByClassName("exampleDetailDiv")[0];
            initExample(exampleNode, member.example);
        }

    }

    hideFirst(members);
}

function getMemberof(member) {
    if (member.kind == "globalFunction") {
        return member["memberof"] + ".globalFunction";
    }
    if (member.kind == "globalMemeber") {
        return member["memberof"] + ".globalMemeber";
    }

    return member["memberof"];
}

function createMethodDetails(dataList) {
    var members = document.getElementById("methodDetails");
    clearList(members);

    var node = members;

    var nodestr = node.innerHTML;

    for (var i = 0; i < dataList.length; i++) {
        var member = dataList[i];

        var newNodestr = nodestr.replace(/\{name\}/g, member["name"]);
        newNodestr = newNodestr.replace(/\{memberof\}/g, getMemberof(member));
        newNodestr = newNodestr.replace(/\{moduleof\}/g, getModule(getMemberof(member)));
        newNodestr = newNodestr.replace(/\{type\}/g, member["type"]);
        newNodestr = newNodestr.replace(/\{version\}/g, member["version"] || "all");
        newNodestr = newNodestr.replace(/\{platform\}/g, member["platform"] || "Web,Runtime");
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
            str = str.replace(/\{param_href\}/g, getClassHref(param.type));

            var paramsNode2 = document.createElement(paramsList2.firstElementChild.nodeName);
            paramsNode2.innerHTML = str;
            paramsList2.appendChild(paramsNode2);

            var str = paramsList3Str.replace(/\{param_name\}/g, param.name);
            str = str.replace(/\{param_type\}/g, param.type);
            str = str.replace(/\{param_href\}/g, getClassHref(param.type));
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

        if (member.example) {
            var exampleNode = newNode.getElementsByClassName("exampleDetailDiv")[0];
            initExample(exampleNode, member.example);
        }
    }

    hideFirst(members);
}

function createExample() {

    var exampleNode = document.getElementById("exampleDetailDiv");
    if (apiData.class && apiData.class.example) {

        var exampleTag = document.getElementById("exampleTag");
        exampleTag.firstElementChild.setAttribute("id", apiData.class.memberof + "." + apiData.class.name + "__example__");

        initExample(exampleNode, apiData.class.example);
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
                if (!apiDebug) {
                    node.style.display = "table-row";
                }
            }
        }
    }

    hideFirst(members);
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
                if (!apiDebug) {
                    node.style.display = "table-row";
                }
            }
        }
    }

    hideFirst(members);
}