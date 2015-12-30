
function gapChar(){
    return "￥";
}

window.onhashchange = function (e) {
    console.dir(e.newURL);

    initHashChange(e.newURL);

    initModuleList();
};

function setHref(module, classname) {
    var href;
    if (module) {
        href = mainHref + "#" + module;

        if (classname) {
            href += gapChar() + classname;
        }
    }
    window.location.href = href;
}

var urlModule;
var urlClass;
var mainHref;
function initHashChange(href) {
    urlModule = "";
    urlClass = "";
    //#m-module_c-classname_m-member|f-method|e-example
    if (href.indexOf("#") >= 0) {
        var optionsStr = href.substr(href.indexOf("#") + 1, href.length);

        var array = optionsStr.split(gapChar());
        if (array.length > 0 && array[0].length > 0) {
            urlModule = array[0];
        }

        if (array.length > 1 && array[1].length > 0) {
            urlClass = array[1];
        }

        mainHref = href.substr(0, href.indexOf("#"));
    }
    else {
        mainHref = href;
    }
}

function getMainHref() {
    return mainHref;
}

function getUrlModule() {
    return urlModule;
}

function getUrlClassName() {
    return urlClass;
}

function getOption(key) {
    var search = location.search;
    if (search == "") {
        return "";
    }
    search = search.slice(1);
    var searchArr = search.split("&");
    var length = searchArr.length;
    for (var i = 0; i < length; i++) {
        var str = searchArr[i];
        var arr = str.split("=");
        if (arr[0] == key) {
            return arr[1];
        }
    }
}

initHashChange(window.location.href);