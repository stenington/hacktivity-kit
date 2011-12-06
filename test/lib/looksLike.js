/*
  For each .test element, compare DOM trees in 
  .actual and .expected for "visual" equality (html elements and text content).
  Publish results to #overall.

  Note: Keep this code prince-safe!

  TODO: Is there a requires mechanism prince is ok with? This script 
  requires getElementsByClassName, but prince can't handle require.js.
*/
(function(){

  /* TODO: Rename/rewrite. Will it normalize the children of the node passed in, or accept
     a list of children to normalize? Also consider normalizing the whole tree and calling once.
  */
  function normalizeChildren(children){
    var normalized = [];
    for(var i = 0; i < children.length; i++) {
      var node = children[i];
      if( !node ){
        continue;
      }
      if( node.nodeType == 3 && node.nodeValue.match(/^\s*$/) ){
        continue;
      }
      normalized.push(node);
    }
    return normalized;
  }
     
  function nodeLooksLike(actual, expected) {
    if( expected.nodeType !== actual.nodeType ){
      /* TODO: extract a utility method or something? */
      console.log("expected nodeType: " + expected.nodeType + ", got nodeType: " + actual.nodeType);
      return false;
    }

    if( expected.nodeValue && actual.nodeValue && expected.nodeValue !== actual.nodeValue ){
      console.log("expected nodeValue: " + expected.nodeValue + ", got nodeValue: " + actual.nodeValue);
      return false;
    }

    /* Only check for listed attributes if they're defined on the expected node */
    var attrs = ['href', 'class'];
    for(var i = 0; i < attrs.length; i++){
      var attr = attrs[i];
      if( expected.hasAttribute && expected.hasAttribute(attr) ){
        /* expected attribute of "*" means the actual must have the attribute, but it can be anything */
        if( expected.getAttribute(attr) === '*' ){
          if( !(actual.hasAttribute && actual.hasAttribute(attr)) ){
            return false;
          }
        }
        else if( !actual.hasAttribute(attr) || expected.getAttribute(attr) !== actual.getAttribute(attr) ){
          console.log("expected " + attr + ": [" + expected.getAttribute(attr) + "], got " + attr + ": [" + actual.getAttribute(attr) + "]");
          return false;
        }
      }
    }

    return true;
  }

  function looksLike(actual, expected){
    if( !actual && !expected ) {
      return true;
    } 
    else if( !actual || !expected ) {
      console.log("expected " + expected + ", got " + actual);
      return false;
    }

    if( expected.hasChildNodes() ){
      var expectedKids = normalizeChildren(expected.childNodes);
      var actualKids = normalizeChildren(actual.childNodes);
      if( expectedKids.length != actualKids.length ) {
        console.log("expected " + expectedKids.length + " child node(s), got " + actualKids.length);
        return false;
      }
      for(var i = 0; i < expectedKids.length; i++){
        if( !looksLike(actualKids[i], expectedKids[i]) ){
          return false;
        }
      }
    }
    
    return nodeLooksLike(actual, expected);
  }

  /* TODO: rewrite? This seems janky. Why do we need to introduce this weird clean top-level root? 
  */
  function contentsLookAlike(actualContainer, expectedContainer){
    var actuals = normalizeChildren(actualContainer.childNodes);
    var expecteds = normalizeChildren(expectedContainer.childNodes);
    var actualsRoot = document.createElement('div');
    var expectedsRoot = actualsRoot.cloneNode(false);
    for(var i = 0; i < actuals.length; i++){
      actualsRoot.appendChild(actuals[i]);
    }
    for(var i = 0; i < expecteds.length; i++){
      expectedsRoot.appendChild(expecteds[i]);
    }
    return looksLike(actualsRoot, expectedsRoot);
  }

  console.log("\nColoring the tests...");
  var tests = getElementsByClassName("test", "div", document);
  var failCount = 0;
  tests.forEach(function(test, i, arr){
    var expectedContainer = getElementsByClassName("expected", null, test)[0].cloneNode(true);
    var actualContainer = getElementsByClassName("actual", null, test)[0].cloneNode(true);
    if( contentsLookAlike(actualContainer, expectedContainer) ){
      test.className += " pass";
    }
    else {
      failCount++;
      test.className += " fail";
    }
  });
  var overall = document.getElementById("overall");
  var msg; 
  if( failCount == 0 ){
    msg = tests.length + " tests pass!";
    overall.className = "pass";
  }
  else {
    msg = failCount + " out of " + tests.length + " tests failed.";
    overall.className = "fail";
  }
  var msgNode = document.createTextNode(msg);
  overall.appendChild(msgNode);
  console.log(msg);
  console.log("done.");
})();

