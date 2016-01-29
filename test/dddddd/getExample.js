function initExample(rootNode, exampleCode) {
    rootNode.innerHTML = exampleCode.replace(/<br\/>/g, "\n");

    var nodes = rootNode.getElementsByTagName("pre");
    for (var i = 0; nodes && i < nodes.length; i++) {
        var preNode = nodes[i];
        preNode.setAttribute("class", "prettyprint linenums");
    }

    prettyPrint();
    return exampleCode;
}