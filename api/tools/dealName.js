/**
 * Created by yjtx on 15-6-4.
 * tsc 编译时将2个_的名字转成了3个_，需要先还原
 */

exports.dealName = function (tempClassObjs) {
    for (var key in tempClassObjs) {
        var item = tempClassObjs[key];

        changeName(item["function"] || []);
        changeName(item["member"] || []);
        changeName(item["globalMember"] || []);
        changeName(item["globalFunction"] || []);
    }

};

function changeName(list) {
    for (var i = list.length - 1; i >= 0; i--) {
        var item = list[i];
        if (item.name.indexOf("___") >= 0) {
            item.name = item.name.substr(1);
        }

        if (item.name.match(/_#static$/)) {
            item.name = item.name.replace(/_#static$/, "");
        }
    }
}