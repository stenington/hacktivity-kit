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
  function buildTOC(root) {
    tocCount++;
    var toc = document.createElement('ol');
    var children = root.childNodes;
    for(var i = 0; i < children.length; i++) {
      var child = children[i];
      if( includeNode(child) ){
        var text = "";
        var titles = getElementsByClassName("title", null, child);
        if( titles.length > 0 ){
          text += titles[0].firstChild.nodeValue;
        }
        var subtitles = getElementsByClassName("subtitle", null, child);
        if( subtitles.length > 0 ){
          text += " " + subtitles[0].firstChild.nodeValue;
        }
        var toc_line = document.createElement('li');
        var link = document.createElement('a');
        child.id = child.id || "toc" + tocCount + "-chapter" + i;
        link.setAttribute('href', '#' + child.id);
        var toc_text = document.createTextNode(text);
        toc_line.appendChild(link);
        link.appendChild(toc_text);
        toc.appendChild(toc_line);
      }
    }
    return toc;
  };

  window.buildTOC = buildTOC;
})();
