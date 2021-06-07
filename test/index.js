import fs from 'fs'
import path from 'path'
import test from 'tape'
import {controlPictures} from 'control-pictures'
import {micromark} from 'micromark'
import {
  gfmTaskListItem as syntax,
  gfmTaskListItemHtml as html
} from '../dev/index.js'

const input = controlPictures(fs.readFileSync(path.join('test', 'input.md')))
const output = String(fs.readFileSync(path.join('test', 'output.html')))

test('markdown -> html (micromark)', (t) => {
  t.deepEqual(
    micromark(input, {extensions: [syntax], htmlExtensions: [html]}),
    output,
    'should support task list items just like how github.com does it'
  )

  t.end()
})
