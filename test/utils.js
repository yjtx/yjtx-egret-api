
var apiDebug = false;

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