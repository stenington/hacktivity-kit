
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
      var toc_text = document.createTextNode(text);
      toc_line.appendChild(toc_text);
      toc.appendChild(toc_line);
    }
  }
  return toc;
};
