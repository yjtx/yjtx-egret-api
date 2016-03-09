/**
 * Created by yjtx on 15-6-4.
 * 继承相关处理
 */
var globals = require("../core/globals");

var classObjs = {};

exports.dealWithInherite = function (tempClassObjs) {
    classObjs = tempClassObjs;
    var classList = sort(classObjs);

    //从父类中继承相关属性和方法
    inheriteMembersAndFunctions(classList);

    inheritWithInheritDoc(classList);

    inheritOthers(classList);
};

//排序 此次顺序为 所有接口：父接口、子接口  所有类：父类、子类 其他
function sort(tempClassObjs) {
    var interfaces = [];
    var classes = [];
    var others = [];

    var children = {};

    for (var key in tempClassObjs) {
        var item = tempClassObjs[key];
        if (item.class) {//取出
            children[key] = globals.clone(item["class"]["children"]) || [];
        }
    }

    var result = [];
    while (true) {
        var currentKey = "";
        for (var key in children) {
            if (children[key].length == 0) {//此为父类或者父接口
                currentKey = key;
                result.push(key);
                delete children[key];
                break;
            }
        }
        if (currentKey == "") {
            break;
        }
        for (var key in children) {
            var index = children[key].indexOf(currentKey);
            if (index >= 0) {//此为父类或者父接口
                children[key].splice(index, 1);
            }
        }
    }
    result.reverse();
    for (var i = 0; i < result.length; i++) {
        var key = result[i];
        var item = tempClassObjs[key];
        if (item.class) {//取出接口
            if (item.class.kind == "interface") {
                interfaces.push(item);
            }
            else {
                classes.push(item);
            }
        }
        else {
            others.push(item);
        }
    }

    return interfaces.concat(classes, others);
}

//从父类中继承相关属性和方法
function inheriteMembersAndFunctions(classList) {
    for (var i = 0; i < classList.length; i++) {
        var item = classList[i];

        if (item.class) {//class,interface
            if (item.class.augments && item.class.augments.length > 0) {//拥有父类
                var parentName = item.class.augments[0];
                var parent = getClass(parentName);
                if (parent == null) {
                    continue;
                }
                //方法继承
                var parentFs = parent["function"];
                for (var f = 0; f < parentFs.length; f++) {
                    if (parentFs[f]["type"] == null) {//构造函数排除
                        continue;
                    }
                    var itemFs = item["function"];
                    for (var j = 0; j < itemFs.length; j++) {
                        if (itemFs[j]["name"] == parentFs[f]["name"]) {//已经被重写
                            break;
                        }
                    }

                    if (j == itemFs.length) {//未被重写
                        var tempItem = globals.clone(parentFs[f]);
                        if (tempItem["inherited"] != true) {
                            tempItem["inherited"] = true;
                            tempItem["inherits"] = parentName;

                        }
                        itemFs.push(tempItem);
                    }
                }

                //属性继承
                var parentMs = parent["member"];
                for (var m = 0; m < parentMs.length; m++) {
                    var itemMs = item["member"];
                    for (var j = 0; j < itemMs.length; j++) {
                        if (itemMs[j]["name"] == parentMs[m]["name"]) {//已经被重写
                            break;
                        }
                    }

                    if (j == itemMs.length) {//未被重写
                        var tempItem = globals.clone(parentMs[m]);
                        if (tempItem["inherited"] != true) {
                            tempItem["inherited"] = true;
                            tempItem["inherits"] = parentName;

                        }
                        itemMs.push(tempItem);
                    }
                }
            }
        }
    }
}

function inheritWithInheritDoc(classList) {
    for (var i = 0; i < classList.length; i++) {
        var item = classList[i];
        if (item.class) {
            //方法继承
            var functions = item["function"];
            for (var f = 0; f < functions.length; f++) {
                if (functions[f]["inheritDoc"]) {
                    addParentDoc(functions[f], item.class.implements || [], item.class.augments ? [{"name" : item.class.augments[0]}] : []);
                }
            }

            //属性继承
            var memebers = item["member"];
            for (var m = 0; m < memebers.length; m++) {
                if (memebers[m]["inheritDoc"]) {
                    addParentDoc(memebers[m], item.class.implements || [], item.class.augments ? [{"name" : item.class.augments[0]}] : []);
                }
            }
        }
    }
}

function addParentDoc(item, interfaces, parents) {
    interfaces.sort();
    var list = interfaces.concat(parents);

    for (var i = 0; i < list.length; i++) {
        var parentName = list[i]["name"];
        var parent = getClass(parentName);
        if (parent == null) {
            continue;
        }

        var parentKindList = parent[item.kind];
        for (var j = 0; j < parentKindList.length; j++) {
            var parentItem = parentKindList[j];
            if (item.name == parentItem.name) {
                item["description"] = parentItem["description"];
                if (parentItem["returns"]) {
                    item["returns"] = globals.clone(parentItem["returns"]);
                }
                if (parentItem["params"]) {
                    item["params"] = globals.clone(parentItem["params"]);
                }

                if (parentItem["see"]) {
                    item["see"] = globals.clone(parentItem["see"]);
                }

                if (parentItem["default"] && !item["default"]) {
                    item["default"] = globals.clone(parentItem["default"]);
                }

                //暂时不将inheritDoc作为继承方法看待
                /*if (parent.class.kind == "class") {
                    if (parentItem["inherited"] == true) {
                        item["inherits"] = parentItem["inherits"];
                    }
                    else {
                        item["inherits"] = parentName;
                    }
                    item["inherited"] = true;
                }*/
                break;
            }
        }
    }
}

function inheritOthers(classList) {
    for (var i = 0; i < classList.length; i++) {
        var item = classList[i];

        if (!item.class) {
            continue;
        }

        var parentList = (item.class.implements || []).concat(item.class.augments || []);
        if (parentList.length > 0) {
            for (var m1 = 0; m1 < parentList.length; m1++) {
                if (typeof(parentList[m1]) != "string") {
                    var parentName = parentList[m1]["name"];
                }
                else {
                    parentName = parentList[m1];
                }
                var parent = getClass(parentName);
                if (parent == null) {
                    continue;
                }

                //event
                if (parent["class"]["event"]) {
                    var parentEs = parent["class"]["event"];
                    for (var j = 0; j < parentEs.length; j++) {
                        item["class"]["event"] = item["class"]["event"] || [];
                        var itemEs = item["class"]["event"];
                        for (var k = 0; k < itemEs.length; k++) {
                            if (itemEs[k]["name"] == parentEs[j]["name"]) {//已重写
                                break;
                            }
                        }

                        if (k == itemEs.length) {//未重写
                            var tempE = globals.clone(parentEs[j]);
                            if (tempE["inherited"] != true) {
                                tempE["inherited"] = true;
                                tempE["inherits"] = parentName;
                            }
                            itemEs.push(tempE);
                        }
                    }
                }

            }
        }


        if (item.class.augments && item.class.augments.length > 0) {//拥有父类
            var parentName = item.class.augments[0];
            var parent = getClass(parentName);
            if (parent != null) {
                //state 子类重写则不继承
                if (!item["class"]["state"] || item["class"]["state"].length == 0) {
                    if (parent["class"]["state"]) {
                        var parentSts = parent["class"]["state"];
                        var tempSts = globals.clone(parentSts);
                        item["class"]["state"] = tempSts;
                        for (var j = 0; j < tempSts.length; j++) {
                            if (tempSts[j]["inherited"] != true) {
                                tempSts[j]["inherited"] = true;
                                tempSts[j]["inherits"] = parentName;
                            }
                        }
                    }
                }

                //defaultProperty
                if (!item["class"]["defaultProperty"] && parent["class"]["defaultProperty"]) {
                    var pdy = parent["class"]["defaultProperty"];
                    item["class"]["defaultProperty"] = globals.clone(pdy);
                    if (!pdy["inherited"]) {
                        item["class"]["defaultProperty"]["inherited"] = true;
                        item["class"]["defaultProperty"]["inherits"] = parentName;
                    }
                }

                //skinPart  需要合并
                var parentMs = parent["member"];
                for (var m = 0; m < parentMs.length; m++) {
                    if (parentMs[m]["skinPart"] && parentMs[m]["skinPart"].length > 0) {//父类拥有skinPart
                        var itemMs = item["member"];
                        for (var j = 0; j < itemMs.length; j++) {
                            if (itemMs[j]["name"] == parentMs[m]["name"]) {//需要合并
                                if (itemMs[j]["inherits"] != parentName) {
                                    var tempSps = globals.clone(parentMs[m]["skinPart"]);
                                    if (itemMs[j]["skinPart"] == null) {
                                        itemMs[j]["skinPart"] = [];
                                    }
                                    for (var t1 = 0; t1 < tempSps.length; t1++) {
                                        if (tempSps[t1]["inherited"] != true) {
                                            tempSps[t1]["inherited"] = true;
                                            tempSps[t1]["inherits"] = parentName;
                                        }
                                    }
                                    itemMs[j]["skinPart"] = itemMs[j]["skinPart"].concat(tempSps);
                                }
                                else if (itemMs[j]["inherited"]) {//为继承属性
                                    var tempSps = itemMs[j]["skinPart"] || [];
                                    for (var t1 = 0; t1 < tempSps.length; t1++) {
                                        if (tempSps[t1]["inherited"] != true) {
                                            tempSps[t1]["inherited"] = true;
                                            tempSps[t1]["inherits"] = itemMs[j]["inherits"];
                                        }
                                    }
                                }

                                break;
                            }
                        }
                    }
                }
            }


        }
    }
}

//获取class相关数据
function getClass(className) {
    return classObjs[className];
}
