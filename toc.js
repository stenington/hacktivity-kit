/* 
  Builds a Table Of Contents for the given element.

  For each child node of the root, it creates an item in an 
  ordered list that links back to the child's id. The link text
  is taken from child elements with class "title" and optionally "subtitle".
*/

function buildTOC(root) {
  var toc = document.createElement('ol');
  var children = root.childNodes;
  for(var i = 0; i < children.length; i++) {
    var child = children[i];
    if( child.nodeType == 1 ) {
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
      var id = child.id || "";
      link.setAttribute('href', '#' + id);
      var toc_text = document.createTextNode(text);
      toc_line.appendChild(link);
      link.appendChild(toc_text);
      toc.appendChild(toc_line);
    }
  }
  return toc;
};
