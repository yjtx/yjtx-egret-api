/**
 * 将TypeScript和EXML编译为JavaScript
 */
var path = require("path");
var globals = require("./core/globals");
var file = require("./core/file.js");
var params = require("./core/params_analyze.js");

function run(opts) {
    if (opts["--output"] == null || opts["--output"].length == 0 || opts["--output"][0] == "") {
        console.log("请设置输出api地址  egret tscdoc --output path");
        return;
    }

    require("./tools/apiProperty").init();

    var tsList = require("./tools/filesScreening").screening();

    var apiArr = require("./tools/egret_tsc_api").run(tsList);

    var tempClassArr = require("./tools/save_docs").screening(apiArr);


    var typesClasses = ["global.Types"];
    for (var i = 0; i < typesClasses.length; i++) {
        var typeClass = typesClasses[i];
        var types = file.read(path.join(globals.getApiParserRoot(), "normalJsons/" + typeClass + ".json"));
        var typeJson = JSON.parse(types);
        tempClassArr[typeJson["class"]["memberof"]+"."+typeJson["class"]["name"]] = typeJson;
    }

    //补全类名路径
    require("./tools/fillname").fillname(tempClassArr);

    //
    var classChildren = require("./tools/addClassChildren");
    classChildren.addClassChildren(tempClassArr);

    //对 3个“_”的名字改成2个_，去掉 static 的名称的 _#static
    require("./tools/dealName").dealName(tempClassArr);

    //处理继承相关信息
    require("./tools/inherit").dealWithInherite(tempClassArr);
    //处理copy相关信息
    require("./tools/copy").dealWithCopy(tempClassArr);
    //对文件内member等按字母排序
    require("./tools/sort").sortWithName(tempClassArr);

    //剔除不需要显示的
    require("./tools/screening").screening(tempClassArr);

    var outputPath = globals.getOutputPath();
    file.remove(outputPath);

    require("./tools/save").save(tempClassArr);

    file.remove("tsc_config_temp.txt");
}

var option = params.getArgv();
run(option.opts);