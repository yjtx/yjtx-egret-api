
var m_urlModule;
var m_urlClass;
var m_mainHref;

function changeToModule(moduleName) {
    window.location.href = m_mainHref + "#" + moduleName;
}

function changeModule(moduleName) {
    if (m_urlModule == moduleName) {
        return false;
    }

    m_urlModule = moduleName;
    return true;
}

function changeClass(className) {
    if (m_urlClass == className) {
        return false;
    }

    m_urlClass = className;
    return true;
}

function gapChar(){
    return "____";//"￥";
}

function getCurrentModule() {
    return m_urlModule;
}

function getCurrentClass() {
    return m_urlClass;
}