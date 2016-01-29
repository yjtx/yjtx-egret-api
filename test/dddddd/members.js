function initMembers(list) {
    setDisplays("memberBlock", list.length > 0);

    if (list.length <= 0) {
        return;
    }

    createMembers(list);

    var title1 = document.getElementsByClassName("memberPublic")[0];
    var title2 = document.getElementsByClassName("memberDetail")[0];
    if (apiData.member) {
        title1.innerHTML = "公共属性";
        title2.innerHTML = "属性详细信息";
    }
    else {
        title1.innerHTML = "全局变量";
        title2.innerHTML = "变量详细信息";
    }

    createPropertyDetails(list);
}

function createMembers(dataList) {
    var members = document.getElementById("members");

    var innerHTML = "";
    var nodestr = getItemStr(members, "membersIntroList");
    for (var i = 0; i < dataList.length; i++) {
        var member = dataList[i];

        var newNodestr = getReplacedStr(nodestr, member);

        var newNode = document.createElement("tr");
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
}

function createPropertyDetails(dataList) {
    var members = document.getElementById("propertyDetails");

    var node = members;

    var nodestr = getItemStr(members, "membersDetailList");
    for (var i = 0; i < dataList.length; i++) {
        var member = dataList[i];
        var newNodestr = getReplacedStr(nodestr, member);

        var newNode = document.createElement("div");
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

        setDisplays("memberExample", member.example, null, newNode);
        if (member.example) {
            var exampleNode = newNode.getElementsByClassName("exampleDetailDiv")[0];
            initExample(exampleNode, member.example);
        }
    }
}
