import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import test from 'node:test'
import {micromark} from 'micromark'
import {createGfmFixtures} from 'create-gfm-fixtures'
import {controlPictures} from 'control-pictures'
import {gfmTaskListItem, gfmTaskListItemHtml} from '../dev/index.js'

test('markdown -> html (micromark)', () => {
  assert.deepEqual(
    micromark('*\n    [x]', {
      extensions: [gfmTaskListItem],
      htmlExtensions: [gfmTaskListItemHtml]
    }),
    '<ul>\n<li>[x]</li>\n</ul>',
    'should not support laziness (1)'
  )

  assert.deepEqual(
    micromark('*\n[x]', {
      extensions: [gfmTaskListItem],
      htmlExtensions: [gfmTaskListItemHtml]
    }),
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

  const files = await fs.readdir(base)
  const extname = '.md'
  let index = -1

  while (++index < files.length) {
    const d = files[index]

    if (!d.endsWith(extname)) {
      continue
    }

    const name = d.slice(0, -extname.length)
    const input = String(await fs.readFile(new URL(d, base)))
    const expected = String(await fs.readFile(new URL(name + '.html', base)))
    let actual = micromark(controlPictures(input), {
      extensions: [gfmTaskListItem],
      htmlExtensions: [gfmTaskListItemHtml]
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
