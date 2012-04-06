/*    _
 *   (_)v^o
 *    |   |   vandegraaff.js - make static
 *    -----
 * 
 *   vandegraaff "compiles" a site with javascript into static HTML.
 *
 */

var fs = require('fs'),
    path = require('path'),
    jsdom = require('jsdom').jsdom;

/* 
 * Calls callback when window is ready 
 */
function whenReady(window, callback){
  if(window.document.readyState !== 'complete'){
    // Poll again in a bit
    setTimeout(function(){
      whenReady(window, callback);
    }, 100);
  }
  else {
    // I dunno... let's wait a bit longer for any scripts to finish?
    setTimeout(function(){ callback(window); }, 100);
  }
}

/* 
 * Loads HTML w/ javascript then removes scripts.
 * Callback is called with resulting window object.
 */  
function makeStatic(html, base, callback){
  var opts = {};
  if(base){
    opts.url = base;
  }
  var document = jsdom(html, null, opts);
  var window = document.createWindow();
  whenReady(window, function(window){
    var scripts = window.document.getElementsByTagName('script');
    for(var i = 0; i < scripts.length; i++){
      scripts[i].parentNode.removeChild(scripts[i]);
    }
    callback(window);
  });
}

function escapeXML(text) {
  // http://stackoverflow.com/questions/1091945/where-can-i-get-a-list-of-the-xml-document-escape-characters
  return text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/\</g, "&lt;")
    .replace(/\>/g, "&gt;");
}

function writeXMLElement(out, element) {
  var tagName = element.nodeName.toLowerCase(),
      i;
  out.write('<' + tagName);
  for (i = 0; i < element.attributes.length; i++) {
    var attr = element.attributes[i];
    out.write(' ' + attr.nodeName + '="' + escapeXML(attr.nodeValue) + '"');
  }
  if (element.childNodes.length) {
    out.write('>');
    for (i = 0; i < element.childNodes.length; i++) {
      var child = element.childNodes[i];
      if (child.nodeType == child.TEXT_NODE) {
        out.write(escapeXML(child.nodeValue));
      } else if (child.nodeType == child.ELEMENT_NODE) {
        writeXMLElement(out, child);
      } else {
        // TODO: Any other major element types to include in here?
        // Note that node types are enumerated at:
        // https://developer.mozilla.org/en/DOM/Node#Constants
        process.stderr.write("Ignoring node type " + child.nodeType + ".\n");
      }
    }
    out.write('</' + tagName + '>');
  } else {
    out.write('/>');
  }
}

// jsdom writes HTML, but Prince wants XHTML, so we convert here.
function dumpXHTMLDocument(window){
  var out = process.stdout;
  var html = window.document.documentElement;
  
  html.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  out.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n');
  writeXMLElement(out, html);
}

/*
 * Main
 */
if( process.argv.length == 2 ){
  // Read from stdin, write to stdout
  var contents = "";
  process.stdin.resume();
  process.stdin.on('data', function(chunk){
    contents += chunk; 
  });
  process.stdin.on('end', function(){
    makeStatic(contents, null, dumpXHTMLDocument); 
  });
}
else {
  // Batch mode - arguably not useful for more than one file though
  for( var i = 2; i < process.argv.length; i++ ){
    (function(){
      var infile = process.argv[i];
      var url = path.resolve(infile);

      fs.readFile(infile, function(err, contents){
        if (err) throw err;
        makeStatic(contents, url, dumpXHTMLDocument);
      });
    })();
  }
}
