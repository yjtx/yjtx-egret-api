function initExample(rootNode, exampleCode) {
    rootNode.innerHTML = exampleCode.replace(/<br\/>/g, "\n");

    var preNode = rootNode.firstElementChild;
    preNode.setAttribute("class", "prettyprint linenums");

    prettyPrint();
    return exampleCode;
}