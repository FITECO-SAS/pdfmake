# pdfmake [![Node.js CI][githubactions_img]][githubactions_url] [![GitHub][github_img]][github_url] [![npm][npm_img]][npm_url]

[githubactions_img]: https://github.com/bpampuch/pdfmake/actions/workflows/node.js.yml/badge.svg?branch=master
[githubactions_url]: https://github.com/bpampuch/pdfmake/actions

[github_img]: https://img.shields.io/github/release/bpampuch/pdfmake.svg?colorB=0E7FBF
[github_url]: https://github.com/bpampuch/pdfmake/releases/latest

[npm_img]: https://img.shields.io/npm/v/pdfmake.svg?colorB=0E7FBF
[npm_url]: https://www.npmjs.com/package/pdfmake


PDF document generation library for server-side and client-side in pure JavaScript.

Check out [the playground](http://bpampuch.github.io/pdfmake/playground.html) and [examples](https://github.com/bpampuch/pdfmake/tree/master/examples).

### Features

* line-wrapping,
* text-alignments (left, right, centered, justified),
* numbered and bulleted lists,
* tables and columns
  * auto/fixed/star-sized widths,
  * col-spans and row-spans,
  * headers automatically repeated in case of a page-break,
  * snaking columns (newspaper-style layout where content flows column-to-column),
* images and vector graphics,
* convenient styling and style inheritance,
* page headers and footers:
  * static or dynamic content,
  * access to current page number and page count,
* background-layer,
* page dimensions and orientations,
* margins,
* document sections,
* custom page breaks,
* font embedding,
* support for complex, multi-level (nested) structures,
* table of contents,
* helper methods for opening/printing/downloading the generated PDF,
* setting of PDF metadata (e.g. author, subject).

## MyFiteco: `isFooter` (not upstream)

This fork (`@myfiteco/pdfmake`) reads a custom node flag `isFooter: true` in the layout engine. It is **not** an official pdfmake option and is unrelated to the document `footer` callback (page numbers, etc.).

When a content node has `isFooter: true`:

1. its height is measured (measurement ignores layout constraints such as `unbreakable`, `dontBreakRows`, `headerRows`, and `keepWithHeaderRows`, and unwraps single-child `unbreakable` stack wrappers so height is not over-estimated);
2. if it does not fit in the remaining usable height of the current page, it is moved to the next page;
3. it is then stuck to the **bottom of the usable area** (above the pdfmake pagination footer).

Without `isFooter`, the same node stays immediately below the previous content.

Typical caller (keep this on the document definition, not in the engine):

```js
{
  content: [
    { text: 'Lignes...' },
    {
      isFooter: true,
      id: 'footer-page',
      stack: [{
        unbreakable: true,
        stack: [
          { columns: [ /* tableaux dontBreakRows, infos société… */ ] },
        ],
      }],
    },
  ],
}
```

- Table layout constraints (`dontBreakRows`, `headerRows`, `keepWithHeaderRows`) and `unbreakable` are ignored during height measurement only.
- Single-child `unbreakable` stack wrappers are unwrapped for measurement only.
- A 1 pt tolerance avoids spurious page breaks when the footer barely fits (floating-point rounding).
- `isFooter: true`: pin the block to the bottom of the last page.
- `pageBreakBefore` is **not** recommended by default (it could create an empty intermediate page when combined with a mis-measured footer height). Use it only if you have a specific pagination requirement.

## TypeScript

This package ships its own types (`index.d.ts`). In a consumer library:

```ts
import pdfmake from '@myfiteco/pdfmake';
import type { TDocumentDefinitions, Content } from '@myfiteco/pdfmake';
// or: import type { Content } from '@myfiteco/pdfmake/interfaces';

const dd: TDocumentDefinitions = {
  content: [
    { text: 'Lignes...' },
    {
      isFooter: true,
      id: 'footer-page',
      table: {
        widths: ['100%'],
        dontBreakRows: true,
        body: [[{ text: 'Banque / TVA' }]],
      },
    },
  ],
};

pdfmake.createPdf(dd);
```

## Documentation

**Documentation URL: https://pdfmake.github.io/docs/**

Source of documentation: https://github.com/pdfmake/docs **Improvements are welcome!**

## Building from sources

using npm:
```
git clone https://github.com/bpampuch/pdfmake.git
cd pdfmake
npm install
npm run build
```

using yarn:
```
git clone https://github.com/bpampuch/pdfmake.git
cd pdfmake
yarn
yarn run build
```

## License
MIT

## Authors
* [@bpampuch](https://github.com/bpampuch) (founder)
* [@liborm85](https://github.com/liborm85)

pdfmake is based on a truly amazing library [pdfkit](https://github.com/devongovett/pdfkit) (credits to [@devongovett](https://github.com/devongovett)).

Thanks to all contributors.
