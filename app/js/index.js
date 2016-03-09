var e = require("electron");
var child_process = require('child_process');
var path = require('path');

function onBtnPath() {
    // 选择文件夹
    var inputPath =  e.remote.dialog.showOpenDialog({ properties: [ 'openDirectory' ]});
    if (inputPath) {
        var contentPath = document.getElementById("filesPath");
        contentPath.value = inputPath;
        console.log("filesPath: " + inputPath);
    }
}

function onBtnType() {
    var inputPath =  e.remote.dialog.showOpenDialog({ properties: [ 'openFile' ]});
    if (inputPath) {
        var contentPath = document.getElementById("typeFile");
        contentPath.value = inputPath;
        console.log("typeFile: " + inputPath);
    }
}

function onBtnExamples() {
  
    var inputPath =  e.remote.dialog.showOpenDialog({ properties: [ 'openDirectory' ]});
    if (inputPath) {
        var contentPath = document.getElementById("examplesPath");
        contentPath.value = inputPath;
        console.log("examplesPath: " + inputPath);
    }
}

function onDependencePath() {

    var inputPath =  e.remote.dialog.showOpenDialog({ properties: [ 'openDirectory' ]});
    if (inputPath) {
        var contentPath = document.getElementById("dependencePath");
        contentPath.value = inputPath;
        console.log("dependencePath: " + inputPath);
    }
}

/**
 * 执行命令
 */
function onBtnGo() {
    
    var inputPath = "";

    var filesPath = document.getElementById("filesPath");
    if (filesPath.value) {
        inputPath += ' --path ' + filesPath.value;
    }
    else {
        alert("请先选择源码文件夹");
        return;
    }

    var dependencePath = document.getElementById("dependencePath");
    if (dependencePath.value) {
        inputPath += ' --dependence  ' + dependencePath.value;
    }
    else {
        //alert("请先选择源码文件夹");
    }

    var examplesPath = document.getElementById("examplesPath");
    if (examplesPath.value) {
        inputPath += ' --examples  ' + examplesPath.value
    }
    else {
        //alert("请先选择源码文件夹");
    }

    var typeFile = document.getElementById("typeFile");
    if (typeFile.value) {
        inputPath += ' --type  ' + typeFile.value
    }
    else {
        //alert("请先选择源码文件夹");
    }

    inputPath += ' --output ' + path.join(__dirname, '../test/data/');

    console.log(process);

    var cmd = 'node  ' + path.join(__dirname, '../api/tscdoc.js ') + inputPath;
    
    createChildProcess(cmd, function (code) {
        if (code == 0) {
            var config = document.getElementById("config");
            var show = document.getElementById("show");
            var showFrame = document.getElementById("showFrame");

            config.style.display = "none";
            show.style.display = "block";
            showFrame.src = "../test/index.html";
            //window.open('../test/index.html');
        }
        else {
        }
    });
    
    var contentPath = document.getElementById("filePath");
    // contentPath.textContent = cmd;

    console.log("__dirname " + __dirname);
    console.log("cmd = " + cmd);
}

function showConfig() {
    var config = document.getElementById("config");
    config.style.display = "block";
    var show = document.getElementById("show");
    var showFrame = document.getElementById("showFrame");

    show.style.display = "none";

    console.log("showConfig");
}

function showApi() {
    var config = document.getElementById("config");
    var show = document.getElementById("show");
    var showFrame = document.getElementById("showFrame");

    config.style.display = "none";
    show.style.display = "block";
    showFrame.src = "../test/index.html";

    console.log("showApi");
}

function showDescription() {
    var config = document.getElementById("config");
    var show = document.getElementById("show");
    var showFrame = document.getElementById("showFrame");

    config.style.display = "none";
    show.style.display = "block";
    showFrame.src = "../readme/api.htm";

    console.log("showDescription");
}

/**
 * @cmd  执行shell命令：如  node  xxx.js 
 */
function createChildProcess(cmd, call) {
    var build = child_process.exec(cmd, {});
    build.stdout.on("data", function (data) {
        console.log(data);
    });
    build.stderr.on("data", function (data) {
        console.log(data);
    });
    build.on("exit", function (result) {
        call(result);
    });

    console.log(build);

    return build;
}


// e.remote.dialog.showOpenDialog


