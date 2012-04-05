
This is the content for the [hackasaurus.org][] hacktivity kit.

  [hackasaurus.org]: http://hackasaurus.org

## Prerequisites

### Conversion toolchain

Prince does not offer as full-featured support for JavaScript as modern browsers do. To
allow the use of libraries like jQuery (which Prince currently cannot handle) the files
get "compiled" into static HTML before feeding them to Prince.

#### jsdom

vandegraaff.js is a node.js script that uses [jsdom][] to load the page, allow any initial 
JavaScript to run, and dump a static HTML version out. This gets sent to...

  [jsdom]: https://github.com/tmpvar/jsdom

#### Prince

You need [Prince 8.0][] to generate the PDF version of the kit. The free version is fine.

  [Prince 8.0]: http://www.princexml.com/download/

## Sample command

    cat kit.html | node vandegraaff.js | prince -s stylesheets/print.css -o kit.pdf -

This creates <samp>kit.pdf</samp> that you can open with your
favorite PDF viewer. 

With <kbd>-v</kbd>, Prince may report errors like: 

    prince: kit.html:9: error: Tag section invalid<

These don't affect processing and should disappear with upcoming releases of Prince.

## Testing

Ideally, all tests should be viewed in both a browser *and* converted to PDF to ensure compatability in both
scenarios. The strategy above should work for [QUnit][] pages, which can be compiled to static HTML and
viewed in a browser for pass/fail status.

  [QUnit]: http://docs.jquery.com/QUnit


