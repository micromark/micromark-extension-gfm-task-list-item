import assert from 'node:assert/strict'
import {URL} from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import {micromark} from 'micromark'
import {createGfmFixtures} from 'create-gfm-fixtures'
import {controlPictures} from 'control-pictures'
import {
  gfmTaskListItem as syntax,
  gfmTaskListItemHtml as html
} from '../dev/index.js'

test('markdown -> html (micromark)', () => {
  assert.deepEqual(
    micromark('*\n    [x]', {extensions: [syntax], htmlExtensions: [html]}),
    '<ul>\n<li>[x]</li>\n</ul>',
    'should not support laziness (1)'
  )

  assert.deepEqual(
    micromark('*\n[x]', {extensions: [syntax], htmlExtensions: [html]}),
    '<ul>\n<li></li>\n</ul>\n<p>[x]</p>',
    'should not support laziness (2)'
  )
})

test('fixtures', async () => {
  const base = new URL('fixtures/', import.meta.url)

  await createGfmFixtures(base, {
    controlPictures: true,
    rehypeStringify: {closeSelfClosing: true}
  })

  const files = fs.readdirSync(base).filter((d) => /\.md$/.test(d))
  let index = -1

  while (++index < files.length) {
    const name = path.basename(files[index], '.md')
    const input = String(fs.readFileSync(new URL(name + '.md', base)))
    const expected = String(fs.readFileSync(new URL(name + '.html', base)))
    let actual = micromark(controlPictures(input), {
      extensions: [syntax],
      htmlExtensions: [html]
    })

    if (actual && !/\n$/.test(actual)) {
      actual += '\n'
    }

    // GH uses `=""` on the boolean attributes, but those are dropped by
    // `rehype-stringify`, so hide those changes.
    actual = actual.replace(/(checked|disabled)=""/g, '$1')

    // Note: GH uses a different algorithm in comments.
    // Notably:
    //
    // ```markdown
    // * [
    //   ] With a line feed
    //
    //  * [ ]
    //   Text.
    // ```
    //
    // The previous two do not form inputs in comments, but do form inputs in
    // files.

    assert.deepEqual(actual, expected, name)
  }
})
