"use strict";
exports.__esModule = true;
var helloObj = {
    type: "div",
    props: {
        children: [
            {
                type: "h1",
                props: {
                    children: ["hello"]
                }
            },
            {
                type: "h2",
                props: {
                    children: ["react"]
                }
            },
        ]
    }
};
function createDOMElement(vDom) {
    if (typeof vDom === "string") {
        var textNode = document.createTextNode(vDom);
        return textNode;
    }
    var node = document.createElement(vDom.type);
    for (var key in vDom.props) {
        if (key === "children")
            vDom.props[key].forEach(function (vDom) {
                var child = createDOMElement(vDom);
                node.appendChild(child);
            });
        else
            node.setAttribute(key, vDom.props[key]);
    }
    return node;
}
function render(vDom, container) {
    var element = Recat.createDOMElement(vDom);
    container.appendChild(element);
}
var Recat = {
    createDOMElement: createDOMElement,
    render: render
};
render(helloObj, document.querySelector("body"));
