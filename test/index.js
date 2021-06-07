var fs = require('fs')
var path = require('path')
var test = require('tape')
var controls = require('control-pictures')
var micromark = require('micromark')
var syntax = require('../syntax.js')
var html = require('../html.js')

var input = controls(fs.readFileSync(path.join(__dirname, 'input.md')))
var output = String(fs.readFileSync(path.join(__dirname, 'output.html')))

test('markdown -> html (micromark)', function (t) {
  t.deepEqual(
    micromark(input, {extensions: [syntax], htmlExtensions: [html]}),
    output,
    'should support task list items just like how github.com does it'
  )

  t.end()
})
