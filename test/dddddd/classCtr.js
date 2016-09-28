/**
 * Created by yjtx on 16/1/28.
 */
var headerStr = document.getElementById("classHeader").innerHTML;

var memberHide = true;
var methodyHide = true;

function v_initClass() {
    var rightcontent = document.getElementById("rightcontent");
    var str = getItemStr(rightcontent, "rightcontent");
    rightcontent.innerHTML = str;

    initClassData();

    initMethods();
    initMembers(apiData.member || apiData.globalMember || []);

    initExamples();

    initEvents();
}

function onClick(data, type) {
    return;
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
    return;
    var className = node.getAttribute("data-class-name");
    var moduleKey = getModule(className);
    if (moduleKey == null) {
        console.warn("no " + className);
        return;
    }

    changeClass(className);

    r_initClass();

    console.log(className);
}

var apiData;
var currentModule;
var currentClassName;

function initClassData() {
    currentModule = getCurrentModule();
    currentClassName = getCurrentClass();

    apiData = getClassData(getCurrentModule(), getCurrentClass());
    var classData = apiData.class;

    var node = document.getElementsByClassName("classTop")[0];
    node.setAttribute("id", currentModule + gapChar() + currentClassName);

    var node = document.getElementById("classHeader");

    if (classData) {
        var str = headerStr;
        if (classData.memberof && classData.memberof != "") {
            str = str.replace(/\{memberof_name\}/g, currentClassName);
        }
        else  {
            str = str.replace(/\{memberof_name\}/g, currentClassName);
        }
        str = str.replace(/\{example_href\}/g, getLink(currentModule + gapChar() + currentClassName + gapChar() + "example@@@"));

        str = str.replace(/\{memberof\}/g, classData.memberof);
        str = str.replace(/\{name\}/g, classData.name);
        str = str.replace(/\{description\}/g, classData.description);

        node.innerHTML = str;

        setDisplays("classBlock", classData.kind == "class");

        setDisplays("interfaceBlock", classData.kind == "interface");

        setDisplays("extendsBlock", !(classData.augments == null || classData.augments.length == 0));

        setDisplays("implementsBlock", !(classData.implements == null || classData.implements.length == 0));

        setDisplays("childrenBlock", !(classData.children == null || classData.children.length == 0));

        setDisplays("seeBlock", !(classData.see == null || classData.see.length == 0));

        createExtends(node);
        createImplements(node);
        createChildren(node);
        createSee();

        node.style.display = "block";
    }
    else {
        node.style.display = "none";
    }
}


function createExtends(node) {
    if (apiData.class && apiData.class.augments && apiData.class.augments.length > 0) {
        var parentNode = node.getElementsByClassName("parentsId")[0];
        var str = getItemStr(parentNode, "extendsList");

        var augments = apiData.class.augments;
        var innerHTML = "";
        for (var i = 0; i < augments.length; i++) {
            var tempStr = str.replace(/\{parent_name\}/g, augments[i]);

            tempStr = tempStr.replace(/\{parent_href\}/g, getClassHref(augments[i]));

            innerHTML += tempStr;
        }

        parentNode.innerHTML = innerHTML;
    }
}

function createImplements(node) {
    if (apiData.class && apiData.class.implements && apiData.class.implements.length > 0) {
        var parentNode = node.getElementsByClassName("implementsId")[0];
        var str = getItemStr(parentNode, "implementsList");

        var implements = apiData.class.implements;
        var innerHTML = "";
        for (var i = 0; i < implements.length; i++) {

            var tempStr = str.replace(/\{implement_name\}/g, implements[i]["name"]);
            tempStr = tempStr.replace(/\{implement_href\}/g, getClassHref(implements[i]["name"]));


            if (i == implements.length - 1) {
                tempStr = tempStr.replace("<span>, </span>", "");
            }
            innerHTML += tempStr;
        }
        parentNode.innerHTML = innerHTML;
    }
}

function createChildren(node) {

    if (apiData.class && apiData.class.children && apiData.class.children.length > 0) {
        var parentNode = node.getElementsByClassName("childrenId")[0];
        var str = getItemStr(parentNode, "childrenList");

        var children = apiData.class.children;
        var innerHTML = "";
        for (var i = 0; i < children.length; i++) {
            var tempStr = str.replace(/\{child_name\}/g, children[i]);
            tempStr = tempStr.replace(/\{child_href\}/g, getClassHref(children[i]));

            if (i == children.length - 1) {
                tempStr = tempStr.replace("<span>, </span>", "");
            }
            innerHTML += tempStr;
        }
        parentNode.innerHTML = innerHTML;
    }
}

function createSee() {
    if (apiData.class && apiData.class.see && apiData.class.see.length) {
        var seeListElement = document.getElementById("seeList1");
        var seeItemStr = getItemStr(seeListElement, "seeList");

        var children = apiData.class.see;
        var innerHTML = "";
        for (var i = 0; i < children.length; i++) {
            var des = children[i];
            var tempStr;
            if (des.indexOf("http:") >= 0) {
                var array = des.split(" ");
                tempStr = seeItemStr.replace(/\{see_name\}/g, array[0]);
                tempStr = tempStr.replace(/\{see_href\}/g, array[0]);
                tempStr = tempStr.replace(/\{see_description\}/g, array[1]);
            }
            else {
                tempStr = seeItemStr.replace(/\{see_name\}/g, des);
                tempStr = tempStr.replace(/\{see_description\}/g, des);

                if (getModule(des)) {
                    tempStr = tempStr.replace(/\{see_href\}/g, getLink(getModule(des) + gapChar() + des));
                }
                else {
                    tempStr = tempStr.replace(/\{see_href\}/g, getLink(des));
                }
            }

            innerHTML += tempStr;
        }

        seeListElement.innerHTML = innerHTML;
    }
}


function initEvents() {
    setDisplays("eventsBlock", apiData.class && apiData.class.event && apiData.class.event.length);

    createEvents();
}

function createEvents() {
    var members = document.getElementById("events");
    var nodestr = getItemStr(members, "eventIntroList");

    var innerHTML = "";
    for (var i = 0; apiData.class && apiData.class.event && i < apiData.class.event.length; i++) {
        var member = apiData.class.event[i];

        var newNodestr = nodestr.replace(/\{name\}/g, member["name"]);
        newNodestr = newNodestr.replace(/\{description\}/g, getFirstSpan(member["description"]));

        innerHTML += newNodestr;
    }
    members.innerHTML = innerHTML;
}

function initExamples() {
    setDisplays("exampleBlock", apiData.class && apiData.class.example);

    if (apiData.class && apiData.class.example) {
        createExample();
    }
}

function createExample() {

    if (apiData.class) {
        var exampleTag = document.getElementById("exampleTag");
        exampleTag.firstElementChild.setAttribute("id", currentModule + gapChar() + currentClassName + gapChar() +"example@@@");

        var exampleNode = exampleTag.getElementsByClassName("exampleDetailDiv")[0];

        if (apiData.class.example) {
            initExample(exampleNode, apiData.class.example);
        }
    }
}


function initMethods() {
    var list = apiData.function || apiData.globalFunction || [];

    setDisplays("methodBlock", list.length > 0);

    if (list.length <= 0) {
        return;
    }

    createMethods(list);

    var title1 = document.getElementsByClassName("methodPublic")[0];
    var title2 = document.getElementsByClassName("methodDetail")[0];
    if (apiData.member) {
        title1.innerHTML = "公共方法";
        title2.innerHTML = "方法详细信息";
    }
    else {
        title1.innerHTML = "全局函数";
        title2.innerHTML = "函数详细信息";
    }

    createMethodDetails(list);
}

function createMethods(dataList) {

    var members = document.getElementById("methods");
    var nodestr = getItemStr(members, "methodsIntroList");

    for (var i = 0; i < dataList.length; i++) {
        var member = dataList[i];

        var newNodestr = getReplacedStr(nodestr, member);

        var newNode = document.createElement("tr");
        newNode.innerHTML = newNodestr;
        newNode.setAttribute("inherited", member["inherited"]);
        members.appendChild(newNode);
        if (methodyHide && member["inherited"]) {
            newNode.style.display = "none";
        }

        var functionType = newNode.getElementsByClassName("functionType1")[0];
        if (member["type"] == null) {
            functionType.parentNode.removeChild(functionType);
        }

        var paramsList1 = newNode.getElementsByClassName("paramsList1")[0];
        var paramsListStr = getItemStr(paramsList1, "methodsIntroParamsList");

        for (var j = 0; member.params && j < member.params.length; j++) {
            var param = member.params[j];

            var str = replaceParam(paramsListStr, param, true);

            var tempNode = document.createElement("span");
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
    }
}


function createMethodDetails(dataList) {
    var members = document.getElementById("methodDetails");

    var nodestr = getItemStr(members, "methodDetailsList");

    for (var i = 0; i < dataList.length; i++) {
        var member = dataList[i];

        var newNodestr = getReplacedStr(nodestr, member);

        var newNode = document.createElement("div");
        newNode.innerHTML = newNodestr;

        var functionType = newNode.getElementsByClassName("functionType2")[0];
        if (member["type"] == null) {
            functionType.parentNode.removeChild(functionType);
        }

        var seeMore = newNode.getElementsByClassName("seeMore")[0];
        if (member.see) {
            var seelist = newNode.getElementsByClassName("seelist")[0];
            var seeElementStr = getItemStr(seelist, "methodDetailsSeeList");
            for (var j = 0; j < member.see.length; j++) {
                var seeStr = member.see[j];
                var str = seeElementStr.replace(/\{desc\}/g, seeStr);

                var node = document.createElement("p");
                node.innerHTML = str;
                seelist.appendChild(node);
            }
        }
        else {
            seeMore.parentNode.removeChild(seeMore);
        }

        var paramsList2 = newNode.getElementsByClassName("paramsList2")[0];
        var paramsList2Str = getItemStr(paramsList2, "methodDetailsParam2List");

        var paramsList3 = newNode.getElementsByClassName("paramsList3")[0];
        var paramsList3Str = getItemStr(paramsList3, "methodDetailsParam3List");

        for (var j = 0; member.params && j < member.params.length; j++) {
            var param = member.params[j];

            var str = replaceParam(paramsList2Str, param, true);

            var paramsNode2 = document.createElement("span");
            paramsNode2.innerHTML = str;
            paramsList2.appendChild(paramsNode2);

            var str = replaceParam(paramsList3Str, param);
            var paramsNode3 = document.createElement("p");
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

        members.appendChild(newNode);

        setDisplays("methodExample", member.example, newNode);
        if (member.example) {
            var exampleNode = newNode.getElementsByClassName("exampleDetailDiv")[0];
            initExample(exampleNode, member.example);
        }
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
