var xhr;
var data;

var callDataFunc;
function getXHR() {
    if (window["XMLHttpRequest"]) {
        return new window["XMLHttpRequest"]();
    } else {
        return new ActiveXObject("MSXML2.XMLHTTP");
    }
}

function onReadyStageChange() {
    if (xhr.readyState == 4) {// 4 = "loaded"
        var ioError = (xhr.status >= 400 || xhr.status == 0);
        window.setTimeout(function () {
            if (ioError) {//请求错误

            }
            else {
                data = response();

                callDataFunc(data);
            }
        }, 0);

    }
}
function response() {
    if (!xhr) {
        return null;
    }
    if (xhr.response) {
        return xhr.response;
    }
    if (xhr.responseXML) {
        return xhr.responseXML;
    }
    if (xhr.responseText) {
        return xhr.responseText;
    }
    return null;
}

function getData(url, call) {
    callDataFunc = call;
    xhr = getXHR();
    xhr.onreadystatechange = onReadyStageChange;

    xhr.open("get", url, true);

    xhr.responseType = "text";
    xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.send(data);
}
