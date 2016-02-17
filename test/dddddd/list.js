function v_initSelect() {
    var selectType = document.getElementById("selectType");

    var str = getItemStr(selectType, M_SELECT);

    var moduleNames = getModuleNames();

    var innerHTML = "";
    for (var i = 0; i < moduleNames.length; i++) {
        var key = moduleNames[i];

        var tempStr = str.replace(/\{module_key\}/g, key);
        tempStr = tempStr.replace(/\{date_now\}/, new Date());

        innerHTML += tempStr;
    }
    selectType.innerHTML = innerHTML;

    selectType.value = getCurrentModule();
}

function selectType(moduleName) {
    changeToModule(moduleName);
}

var lastSelectedIndex = 0;
function v_initList() {
    var array = getClassNamesByModule(getCurrentModule());
    var currentClass = getCurrentClass();

    var moduleName = getCurrentModule();

    var list = document.getElementById("classList");

    var str = getItemStr(list, M_LIST);

    var searchTxt = getSearchText();

    var defaultFirstName = "";

    var innerHTML = "";
    lastSelectedIndex = 0;
    for (var i = 0, count = 0; i < array.length; i++) {
        var classname = array[i];

        if (searchTxt.length <= 1 || isIn(searchTxt, classname)) {
            if (defaultFirstName == "") {
                defaultFirstName = classname;
            }
            var tempStr = str.replace(/\{class_name_desc\}/g, array[i].replace('globalFunction', "全局函数").replace('globalMember', "全局变量"));
            tempStr = tempStr.replace(/\{class_href\}/g, "#" + moduleName + gapChar() + array[i]);
            tempStr = tempStr.replace(/\{class_name\}/g, array[i]);
            tempStr = tempStr.replace(/\{data-index\}/g, count);

            if (classname == currentClass) {
                tempStr = tempStr.replace(/\{class_selected\}/g, "class_selected");
                lastSelectedIndex = count;
            }
            else {
                tempStr = tempStr.replace(/\{class_selected\}/g, "class_unselected");
            }

            innerHTML += tempStr;

            count++;
        }
    }

    list.innerHTML = innerHTML;

    return defaultFirstName;
}

function listSelected(node) {
    var list = document.getElementById("classList");
    list.children[lastSelectedIndex].firstElementChild.className = "class_unselected";
    node.className = "class_selected";

    lastSelectedIndex = node.getAttribute("data-index");
}

function searchClass() {
    r_initList();
}

function getSearchText() {
    var searchInput = document.getElementById("searchInput");
    var text = searchInput.value;

    text = trimAll(text);
    return text;
}
