"use strict";

var _require = require("../util/dom");

var insertCSS = _require.insertCSS;


var SVG = "http://www.w3.org/2000/svg";
var XLINK = "http://www.w3.org/1999/xlink";

var prefix = "ProseMirror-icon";

var svgCollectionContainer = null;
var svgCollectionContainerId = prefix + "-collection-container";

function nodeById(id) {
  return document.getElementById(id);
}

function nodeExists(id) {
  return nodeById(id) != null;
}

function svgContainer() {
  if (!nodeExists(svgCollectionContainerId) || svgCollectionContainer != nodeById(svgCollectionContainerId)) {
    svgCollectionContainer = document.createElementNS(SVG, "svg");
    svgCollectionContainer.style.display = "none";
    svgCollectionContainer.id = svgCollectionContainerId;
    document.body.insertBefore(svgCollectionContainer, document.body.firstChild);
  }

  return svgCollectionContainer;
}

function hashPath(path) {
  var hash = 0;
  for (var i = 0; i < path.length; i++) {
    hash = (hash << 5) - hash + path.charCodeAt(i) | 0;
  }return hash;
}

function getIcon(icon) {
  var node = document.createElement("div");
  node.className = prefix;
  if (icon.path) {
    var name = "pm-icon-" + hashPath(icon.path).toString(16);
    if (!nodeExists(name)) buildSVG(name, icon);
    var svg = node.appendChild(document.createElementNS(SVG, "svg"));
    svg.style.width = icon.width / icon.height + "em";
    var use = svg.appendChild(document.createElementNS(SVG, "use"));
    use.setAttributeNS(XLINK, "href", /([^#]*)/.exec(document.location)[1] + "#" + name);
  } else if (icon.dom) {
    node.appendChild(icon.dom.cloneNode(true));
  } else {
    node.appendChild(document.createElement("span")).textContent = icon.text || '';
    if (icon.css) node.firstChild.style.cssText = icon.css;
  }
  return node;
}
exports.getIcon = getIcon;

function buildSVG(name, data) {
  var sym = document.createElementNS(SVG, "symbol");
  sym.id = name;
  sym.setAttribute("viewBox", "0 0 " + data.width + " " + data.height);
  var path = sym.appendChild(document.createElementNS(SVG, "path"));
  path.setAttribute("d", data.path);
  svgContainer().appendChild(sym);
}

insertCSS("\n." + prefix + " {\n  display: inline-block;\n  line-height: .8;\n  vertical-align: -2px; /* Compensate for padding */\n  padding: 2px 8px;\n  cursor: pointer;\n}\n\n." + prefix + " svg {\n  fill: currentColor;\n  height: 1em;\n}\n\n." + prefix + " span {\n  vertical-align: text-top;\n}");