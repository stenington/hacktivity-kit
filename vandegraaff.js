#!/usr/bin/env node

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

function dumpDocument(window){
  var doc = window.document.doctype.toString();
  doc += window.document.innerHTML;
  process.stdout.write(doc);
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
    makeStatic(contents, null, dumpDocument); 
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
        makeStatic(contents, url, dumpDocument);
      });
    })();
  }
}
