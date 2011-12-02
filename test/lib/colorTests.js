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
  };

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
     
  function looksLike(actual, expected){
    if( !actual && !expected ) {
      return true;
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
    
    if( expected.nodeType !== actual.nodeType ){
      return false;
    }

    if( expected.nodeValue && actual.nodeValue && expected.nodeValue !== actual.nodeValue ){
      return false;
    }

    return true;
  };

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

