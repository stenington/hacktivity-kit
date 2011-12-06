
This is the content for the [hackasaurus.org][] hacktivity kit.

  [hackasaurus.org]: http://hackasaurus.org

## Prerequisites

You need [Prince 8.0][] to generate the PDF version of the kit. The free version is fine.

  [Prince 8.0]: http://www.princexml.com/download/

## Setup

The web version of the kit is simple HTML, CSS and JavaScript. To generate the PDF version, run this
at the terminal prompt:

    cd hacktivity-kit
    prince --javascript --style=print.css kit.html

This creates <samp>kit.pdf</samp> that you can open with your
favorite PDF viewer. 

## Testing

Prince does not offer as full-featured support for JavaScript as modern browsers do. Ideally, all 
tests should be viewed in both a browser *and* converted to PDF to ensure compatability in both
scenarios. However Prince can't handle libraries like jQuery or QUnit, so this becomes a challenge.

See <kbd>hacktivity-kit/test/toc.html</kbd> for an example of how we're approaching this for now with
colorTests. View it in a browser, and run it through Prince with: 

    prince -v --javascript toc.html

### colorTests

As an experiment, the current hacktivity tests make use of colorTests.js which is Prince-safe and 
should be kept so. 

When included, colorTests iterates through all the <code>.test</code> elements
in the DOM, comparing a <code>.expected</code> to a <code>.actual</code> element for "visual"
equality and coloring red for fail and green for pass. The final result is reported in a 
<code>#overall</code> element, if included. 

"Visual" equality in this case means the same HTML elements and text contents. There's limited support
for attribute checking as well. See the code in <kbd>hacktivity-kit/test/lib/colorTests.js</kbd> for
more details.


