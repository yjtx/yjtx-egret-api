/**
 * 将TypeScript和EXML编译为JavaScript
 */
var path = require("path");
var globals = require("./core/globals");
var file = require("./core/file.js");
var params = require("./core/params_analyze.js");
var typeScriptCompiler = require("./tools/egret_tsc_api.js");

function run(opts) {
    if (opts["--output"] == null || opts["--output"].length == 0 || opts["--output"][0] == "") {
        console.log("请设置输出api地址  egret tscdoc --output path");
        return;
    }
    var outputPath = opts["--output"][0];
    var egretPath = opts["--path"][0];

    //var tsList = [];
    //var moduleArr = ["core", "res", "html5", "native", "gui", "socket", "dragonbones"];
    //for (var i = 0; i < moduleArr.length; i++) {
    //    tsList = tsList.concat(getModuleList(moduleArr[i], egretPath));
    //}

    var ignoreList = [/oldVersion.*NativeVersionController.ts/];
    var tsList = file.getDirectoryAllListing(path.join(egretPath));
    tsList = tsList.filter(function (item) {
        for (var i = 0; i < ignoreList.length; i++) {
            if (item.match(ignoreList[i])) {
                return false;
            }
            else if (!item.match(/\.ts$/)) {
                return false
            }
        }
        return true;
    });

    var apiArr = require("./tools/egret_tsc_api1").run(tsList, egretPath);

    //return;
    //
    //var cmd = tsList.join(" ") + " -d -t ES5 --out " + globals.addQuotes(path.join(outputPath, "a.d.ts"));
    //var apiArr = typeScriptCompiler.compile(function () {
    //}, cmd);
    var tempClassArr = require("./tools/save_docs").screening(apiArr);

    //补全类名路径
    require("./tools/fillname").fillname(tempClassArr);

    //
    var classChildren = require("./tools/addClassChildren");
    classChildren.addClassChildren(tempClassArr);

    //对 3个“_”的名字改成2个_
    require("./tools/dealName").dealName(tempClassArr);

    //处理继承相关信息
    require("./tools/inherit").dealWithInherite(tempClassArr);
    //处理copy相关信息
    require("./tools/copy").dealWithCopy(tempClassArr);
    //对文件内membe等按字母排序
    require("./tools/sort").sortWithName(tempClassArr);

    //require("./tools/screening").screening(tempClassArr);

    file.remove(outputPath);
    require("./tools/save").save(tempClassArr);

    file.remove("tsc_config_temp.txt");
}

function getModuleList(moduleName, egretPath) {
    var modulePath = path.join(egretPath, "tools/lib/manifest", moduleName + ".json");

    var moduleConfig = JSON.parse(file.read(modulePath));

    //获取源文件地址
    var tsList = moduleConfig.file_list;
    tsList = tsList.map(function (item) {
        return globals.addQuotes(path.join(egretPath, moduleConfig.source, item));
    }).filter(function (item) {
        return item.indexOf(".js") == -1;
    });

    return tsList;
}

var option = params.getArgv();
run(option.opts);