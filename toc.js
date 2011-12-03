/* 
  Builds a Table Of Contents for the given element.

  For each child node of the root, it creates an item in an 
  ordered list that links back to the child's id. The link text
  is taken from child elements with class "title" and optionally "subtitle".
*/

(function(){

  var tocCount = 0;

  function includeNode(node) {
    if(node.nodeType == 1 && node.className){
      var classes = node.className.split(/\s+/);
      if(classes.indexOf('chapter') !== -1){
        return true;
      }
    }
    return false;
  }

  function getTextFrom(className, parentEl) {
    var els = getElementsByClassName(className, null, parentEl);
    if( els.length > 0 ){
      return els[0].firstChild.nodeValue;
    }
    return "";
  }

  function makeUniqueId(i) {
    return "toc" + tocCount + "-chapter" + i;
  }

  function buildTocItem(node, i) {
    var text = getTextFrom("title", node); 
    if(getTextFrom("subtitle", node)){
      text += " " + getTextFrom("subtitle", node);
    }

    node.id = node.id || makeUniqueId(i);

    var toc_line = document.createElement('li');
    var link = document.createElement('a');
    link.setAttribute('href', '#' + node.id);
    var toc_text = document.createTextNode(text);
    toc_line.appendChild(link);
    link.appendChild(toc_text);
    return toc_line;
  }
      
  function buildTOC(root) {
    tocCount++;
    var toc = document.createElement('ol');
    toc.className = "toc";
    var children = root.childNodes;
    for(var i = 0; i < children.length; i++) {
      var child = children[i];
      if( includeNode(child) ){
        toc.appendChild(buildTocItem(child, i));
      }
    }
    return toc;
  };

  window.buildTOC = buildTOC;
})();
