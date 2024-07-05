import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import test from 'node:test'
import {micromark} from 'micromark'
import {createGfmFixtures} from 'create-gfm-fixtures'
import {controlPictures} from 'control-pictures'
import {
  gfmTaskListItem,
  gfmTaskListItemHtml
} from 'micromark-extension-gfm-task-list-item'

test('markdown -> html (micromark)', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(
        await import('micromark-extension-gfm-task-list-item')
      ).sort(),
      ['gfmTaskListItem', 'gfmTaskListItemHtml']
    )
  })

  await t.test(
    'should skip `tasklistCheck` construct if `disable.null` includes `tasklistCheck`',
    async function () {
      assert.deepEqual(
        micromark('* [ ] foo', {
          extensions: [gfmTaskListItem(), {disable: {null: ['tasklistCheck']}}],
          htmlExtensions: [gfmTaskListItemHtml()]
        }),
        '<ul>\n<li>[ ] foo</li>\n</ul>'
      )
    }
  )

  await t.test('should not support laziness (1)', async function () {
    assert.deepEqual(
      micromark('*\n    [x]', {
        extensions: [gfmTaskListItem()],
        htmlExtensions: [gfmTaskListItemHtml()]
      }),
      '<ul>\n<li>[x]</li>\n</ul>'
    )
  })

  await t.test('should not support laziness (2)', async function () {
    assert.deepEqual(
      micromark('*\n[x]', {
        extensions: [gfmTaskListItem()],
        htmlExtensions: [gfmTaskListItemHtml()]
      }),
      '<ul>\n<li></li>\n</ul>\n<p>[x]</p>'
    )
  })
})

test('fixtures', async function (t) {
  const base = new URL('fixtures/', import.meta.url)

  await createGfmFixtures(base, {
    controlPictures: true,
    rehypeStringify: {closeSelfClosing: true}
  })

  const files = await fs.readdir(base)
  const extname = '.md'

  for (const d of files) {
    if (!d.endsWith(extname)) {
      continue
    }

    const name = d.slice(0, -extname.length)

    await t.test(name, async function () {
      const input = String(await fs.readFile(new URL(d, base)))
      const expected = String(await fs.readFile(new URL(name + '.html', base)))
      let actual = micromark(controlPictures(input), {
        extensions: [gfmTaskListItem()],
        htmlExtensions: [gfmTaskListItemHtml()]
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
    })
  }
})
