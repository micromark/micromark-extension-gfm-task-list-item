# micromark-extension-gfm-task-list-item

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[micromark][] extension to support GFM [task list items][].

## Contents

*   [What is this?](#what-is-this)
*   [When to use this](#when-to-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`gfmTaskListItem`](#gfmtasklistitem)
    *   [`gfmTaskListItemHtml`](#gfmtasklistitemhtml)
*   [Authoring](#authoring)
*   [HTML](#html)
*   [CSS](#css)
*   [Syntax](#syntax)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package contains extensions that add support for tasklists enabled by GFM
to [`micromark`][micromark].
It matches how task list items work on `github.com`.

## When to use this

These tools are all low-level.
In many cases, you want to use [`remark-gfm`][plugin] with remark instead.

Even when you want to use `micromark`, you likely want to use
[`micromark-extension-gfm`][micromark-extension-gfm] to support all GFM
features.
That extension includes this extension.

When working with `mdast-util-from-markdown`, you must combine this package with
[`mdast-util-gfm-task-list-item`][util].

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, 16.0+, or 18.0+), install with [npm][]:

```sh
npm install micromark-extension-gfm-task-list-item
```

In Deno with [`esm.sh`][esmsh]:

```js
import {gfmTaskListItem, gfmTaskListItemHtml} from 'https://esm.sh/micromark-extension-gfm-task-list-item@1'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {gfmTaskListItem, gfmTaskListItemHtml} from 'https://esm.sh/micromark-extension-gfm-task-list-item@1?bundle'
</script>
```

## Use

```js
import {micromark} from 'micromark'
import {
  gfmTaskListItem,
  gfmTaskListItemHtml
} from 'micromark-extension-gfm-task-list-item'

const output = micromark('* [x] a\n* [ ] b', {
  extensions: [gfmTaskListItem],
  htmlExtensions: [gfmTaskListItemHtml]
})

console.log(output)
```

Yields:

```html
<ul>
<li><input checked="" disabled="" type="checkbox"> a</li>
<li><input disabled="" type="checkbox"> b</li>
</ul>
```

## API

This package exports the identifiers `gfmTaskListItem` and
`gfmTaskListItemHtml`.
There is no default export.

The export map supports the endorsed [`development` condition][condition].
Run `node --conditions development module.js` to get instrumented dev code.
Without this condition, production code is loaded.

### `gfmTaskListItem`

Syntax extension for micromark (passed in `extensions`).

### `gfmTaskListItemHtml`

HTML extension for micromark (passed in `htmlExtensions`).

## Authoring

When authoring markdown with task lists, it’s recommended to use a lowercase
`x` (instead of an uppercase one) for checked items and a space (instead of a
tab or a line ending) for unchecked items.

## HTML

GFM task list items relate to the `<input>` element in HTML.
See [*§ 4.10.5.1.15 Checkbox state (`type=checkbox`)*][html-checkbox]
in the HTML spec for more info.
The structure for unchecked and checked items looks as follows:

```html
<!--…-->
<li><input type="checkbox" disabled="" /> foo</li>
<li><input type="checkbox" disabled="" checked="" /> bar</li>
<!--…-->
```

## CSS

GitHub itself uses slightly different markup for task list items than they
define in their spec.
When following the spec, as this extension does, only inputs are added.
They can be styled with the following CSS:

```css
input[type="checkbox"] {
  margin: 0 .2em .25em -1.6em;
  vertical-align: middle;
}

input[type="checkbox"]:dir(rtl) {
  margin: 0 -1.6em .25em .2em;
}
```

For the complete actual CSS see
[`sindresorhus/github-markdown-css`][github-markdown-css].

## Syntax

Task lists form with, roughly, the following BNF:

```bnf
; Note: task list items form only in the first child, after definitions, of a
; list, if that child is a paragraph.
; Restriction: must be follow by `whitespace` (after trimming).
task_list_item ::= '[' ( checked | unchecked ) ']'
checked ::= 'x' | 'X'
unchecked ::= whitespace
whitespace ::= '\t' | '\r\n' | '\r' | '\n' | ' '
```

## Types

This package is fully typed with [TypeScript][].
It exports no additional types.

## Compatibility

This package is at least compatible with all maintained versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, 16.0+, and 18.0+.
It also works in Deno and modern browsers.

## Security

This package is safe.

## Related

*   [`syntax-tree/mdast-util-gfm-task-list-item`][util]
    — support GFM task list items in mdast
*   [`syntax-tree/mdast-util-gfm`][mdast-util-gfm]
    — support GFM in mdast
*   [`remarkjs/remark-gfm`][plugin]
    — support GFM in remark

## Contribute

See [`contributing.md` in `micromark/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/micromark/micromark-extension-gfm-task-list-item/workflows/main/badge.svg

[build]: https://github.com/micromark/micromark-extension-gfm-task-list-item/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/micromark/micromark-extension-gfm-task-list-item.svg

[coverage]: https://codecov.io/github/micromark/micromark-extension-gfm-task-list-item

[downloads-badge]: https://img.shields.io/npm/dm/micromark-extension-gfm-task-list-item.svg

[downloads]: https://www.npmjs.com/package/micromark-extension-gfm-task-list-item

[size-badge]: https://img.shields.io/bundlephobia/minzip/micromark-extension-gfm-task-list-item.svg

[size]: https://bundlephobia.com/result?p=micromark-extension-gfm-task-list-item

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/micromark/micromark/discussions

[npm]: https://docs.npmjs.com/cli/install

[esmsh]: https://esm.sh

[license]: license

[author]: https://wooorm.com

[contributing]: https://github.com/micromark/.github/blob/HEAD/contributing.md

[support]: https://github.com/micromark/.github/blob/HEAD/support.md

[coc]: https://github.com/micromark/.github/blob/HEAD/code-of-conduct.md

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[typescript]: https://www.typescriptlang.org

[condition]: https://nodejs.org/api/packages.html#packages_resolving_user_conditions

[micromark]: https://github.com/micromark/micromark

[micromark-extension-gfm]: https://github.com/micromark/micromark-extension-gfm

[util]: https://github.com/syntax-tree/mdast-util-gfm-task-list-item

[mdast-util-gfm]: https://github.com/syntax-tree/mdast-util-gfm

[plugin]: https://github.com/remarkjs/remark-gfm

[task list items]: https://github.github.com/gfm/#task-list-items-extension-

[github-markdown-css]: https://github.com/sindresorhus/github-markdown-css

[html-checkbox]: https://html.spec.whatwg.org/multipage/input.html#checkbox-state-\(type=checkbox\)
