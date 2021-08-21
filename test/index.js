import fs from 'node:fs'
import path from 'node:path'
import test from 'tape'
import {controlPictures} from 'control-pictures'
import {micromark} from 'micromark'
import {
  gfmTaskListItem as syntax,
  gfmTaskListItemHtml as html
} from '../dev/index.js'

const input = controlPictures(
  String(fs.readFileSync(path.join('test', 'input.md')))
)
const output = String(fs.readFileSync(path.join('test', 'output.html')))

test('markdown -> html (micromark)', (t) => {
  t.deepEqual(
    micromark(input, {extensions: [syntax], htmlExtensions: [html]}),
    output,
    'should support task list items just like how github.com does it'
  )

  t.deepEqual(
    micromark('*\n    [x]', {extensions: [syntax], htmlExtensions: [html]}),
    '<ul>\n<li>[x]</li>\n</ul>',
    'should not support laziness (1)'
  )

  t.deepEqual(
    micromark('*\n[x]', {extensions: [syntax], htmlExtensions: [html]}),
    '<ul>\n<li></li>\n</ul>\n<p>[x]</p>',
    'should not support laziness (2)'
  )

  t.end()
})
