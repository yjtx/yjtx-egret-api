var params = require("./core/params_analyze.js");

var upload = require('./core/upload');

function getOption(type) {
    if (params.getArgv()["opts"][type]) {
        return params.getArgv()["opts"][type][0];
    }
    return null;
}

var files = [
    {urlKey: "file1", urlValue: "resource/bg1.jpg", params:{}},
    {urlKey: "file2", urlValue: "resource/bg2.png", params:{}},
    {urlKey: "file3", urlValue: "resource/effect.mp3", params:{}},
    {urlKey: "filezip", urlValue: "resource/zips.zip", params:{}}
];

//node ssss.js --files [["file1", "resource/bg1.jpg", {type:1212,version2323}]]
var fileStr = getOption("--files");
console.log("fileStr   " + fileStr);
if (fileStr) {
    var infoArr = JSON.parse(fileStr);
    files = [];
    for (var key in infoArr) {
        var info = infoArr[key];

        files.push({urlKey: info[0], urlValue: info[1], params:info[2]});
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
    upload.upload(files[count]["urlKey"], files[count]["urlValue"], files[count]["params"]);
}

var count = -1;
onResponse({});