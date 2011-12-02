/*
  For each .test element, compare DOM trees in 
  .actual and .expected for "visual" equality (html elements and text content).
  Publish results to #overall.

  Note: Keep this code prince-safe!
*/
(function(){
  function normalize(value){
    if( value ){
      value.replace(/\s+/, '');
    } 
    return value;
  }

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
      console.log("expected nodeType: " + expected.nodeType + ", got nodeType: " + actual.nodeType);
      return false;
    }

    if( expected.nodeValue && actual.nodeValue && expected.nodeValue !== actual.nodeValue ){
      console.log("expected nodeValue: " + expected.nodeValue + ", got nodeValue: " + actual.nodeValue);
      return false;
    }

    if( expected.hasAttribute && expected.hasAttribute('href') ){
      if( !actual.hasAttribute('href') || expected.getAttribute('href') !== actual.getAttribute('href') ){
        console.log("expected href: [" + expected.getAttribute('href') + "], got href: [" + actual.getAttribute('href') + "]");
        return false;
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
      for(var i = 0; i < expectedKids.length; i++){
        if( !looksLike(actualKids[i], expectedKids[i]) ){
          return false;
        }
      }
    }
    
    return nodeLooksLike(expected, actual);
  }

  console.log("\nColoring the tests...");
  var tests = getElementsByClassName("test", "div", document);
  var failCount = 0;
  tests.forEach(function(test, i, arr){
    var expected = getElementsByClassName("expected", null, test)[0];
    var actual = getElementsByClassName("actual", null, test)[0];
    if( looksLike(actual, expected) ){
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

