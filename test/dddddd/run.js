function run() {
    //取list 数据
    loadListData(r_1);
}

function r_1() {
    //解析 href
    m_initHref(window.location.href);

    var isM = changeModule(r_urlModule);
    var isC = changeClass(r_urlClass);

    if (isM) {
        //创建 select
        v_initSelect();
        r_initList();
    }

    if (isM || isC) {
        r_initClass();
    }
}

function r_initList() {
    //创建 list
    v_initList();
}

function r_initClass() {
    var m = getCurrentModule();
    var c = getCurrentClass();

    if (isClassDataLoaded(m, c)) {
        v_initClass();
    }
    else {
        loadClassData(m, c, function () {

            v_initClass();

            var href = window.location.href;
            if (href.indexOf("#") > 0) {
                window.location.href = window.location.href
            }
        });
    }
}


window.onhashchange = function (e) {
    console.dir(e.newURL);

    r_1();
};


var r_urlModule;
var r_urlClass;

function m_initHref(href) {

    r_urlModule = "";
    r_urlClass = "";
    //#m-module_c-classname_m-member|f-method|e-example
    if (href.indexOf("#") >= 0) {
        var optionsStr = href.substr(href.indexOf("#") + 1, href.length);

        var array = optionsStr.split(gapChar());
        if (array.length > 0 && array[0].length > 0) {
            r_urlModule = array[0];
        }

        if (array.length > 1 && array[1].length > 0) {
            r_urlClass = array[1];
        }

        m_mainHref = href.substr(0, href.indexOf("#"));
    }
    else {
        m_mainHref = href;
    }

    if (r_urlModule == "") {
        r_urlModule = getFirstModuleName();
    }

    if (r_urlClass == "") {
        r_urlClass = getFirstClassName(r_urlModule);
    }
}
