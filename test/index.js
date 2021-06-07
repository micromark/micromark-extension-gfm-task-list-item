import fs from 'fs'
import path from 'path'
import test from 'tape'
import {controlPictures} from 'control-pictures'
import {micromark} from 'micromark'
import {
  gfmTaskListItem as syntax,
  gfmTaskListItemHtml as html
} from '../index.js'

var input = controlPictures(fs.readFileSync(path.join('test', 'input.md')))
var output = String(fs.readFileSync(path.join('test', 'output.html')))

test('markdown -> html (micromark)', function (t) {
  t.deepEqual(
    micromark(input, {extensions: [syntax], htmlExtensions: [html]}),
    output,
    'should support task list items just like how github.com does it'
  )

  t.end()
})
