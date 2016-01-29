/**
 * Created by yjtx on 16/1/28.
 */

var t_nodes = {};
function getItemStr(list, key) {
    if (t_nodes[key] == null) {
        leftOne(list);

        t_nodes[key] = list.innerHTML;
    }

    while (list.childElementCount > 0) {
        list.removeChild(list.lastElementChild);
    }

    return t_nodes[key];
}

function leftOne(list) {
    while (list.childElementCount > 1) {
        list.removeChild(list.lastElementChild);
    }
}
