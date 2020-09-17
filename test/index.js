var fs = require('fs')
var path = require('path')
var test = require('tape')
var micromark = require('micromark/lib')
var syntax = require('../syntax')
var html = require('../html')

var input = fs.readFileSync(path.join(__dirname, 'input.md'))
var output = fs.readFileSync(path.join(__dirname, 'output.html'), 'utf8')

test('markdown -> html (micromark)', function (t) {
  t.deepEqual(
    micromark(input, {extensions: [syntax], htmlExtensions: [html]}),
    output,
    'should support task list items just like how github.com does it'
  )

  t.end()
})
