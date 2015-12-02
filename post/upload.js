var params = require("./core/params_analyze.js");

var upload = require('./core/upload');

function getOption(type) {
    if (params.getArgv()["opts"][type]) {
        return params.getArgv()["opts"][type][0];
    }
    return null;
}

var files = [
    {urlKey: "file1", urlValue: "resource/bg1.jpg"},
    {urlKey: "file2", urlValue: "resource/bg2.png"},
    {urlKey: "file3", urlValue: "resource/effect.mp3"},
    {urlKey: "filezip", urlValue: "resource/zips.zip"}
];

//node ssss.js --files file1=bg1.jpg,file2=bg2.png,file3=effect.mp3,filezip=dragonbones.zip
var fileStr = getOption("--files");
if (fileStr) {
    var array = fileStr.split(",");
    if (array.length) {
        files = [];
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            var tempA = item.split("=");
            files.push({urlKey: tempA[0], urlValue: tempA[1]});
        }
    }
    console.log(files);
}

var options = {
    method: "post",
    port: "80" ,
    host: "10.0.5.163",
    path: "/cn/api/JkensAPIUpdate/add_post"
};

var method = getOption("--method");
var port = getOption("--port");
var host = getOption("--host");
var path = getOption("--path");
if (method && port && host && path) {
    options = {
        method: method,
        port: port,
        host: host,
        path: path
    };

    console.log(options);
}

function onResponse(value) {
    console.log(value);
    count++;

    if (count == files.length) {
        return;
    }
    upload.init(options, onResponse);
    upload.upload(files[count]["urlKey"], files[count]["urlValue"]);
}

var count = 0;
upload.init(options, onResponse);
upload.upload(files[count]["urlKey"], files[count]["urlValue"]);