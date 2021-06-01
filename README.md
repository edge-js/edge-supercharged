<div align="center"><img src="https://res.cloudinary.com/adonis-js/image/upload/v1620150474/edge-banner_tzmnox.jpg" width="600px"></div>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of contents

- [Edge Supercharged](#edge-supercharged)
  - [Maintainers](#maintainers)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Edge Supercharged
> Supercharge your components and use them as edge tags

[![gh-workflow-image]][gh-workflow-url] [![typescript-image]][typescript-url] [![npm-image]][npm-url] [![license-image]][license-url] [![synk-image]][synk-url]

Edge supercharged enables you to use your components as edge tags. It began by scanning all the templates stored inside the `./components` directory of your view root and make them available as tags.

## Usage
Install the package from npm registry as follows

```sh
npm i edge-supercharged

# yarn
yarn add edge-supercharged
```

And use it as follows

```ts
const edge = require('edge.js').default
const { Supercharged } = require('edge-supercharged')

const supercharged = new Supercharged()
edge.use(supercharged.wire, {
  recurring: process.env.NODE_ENV === 'development'
})
```

During development, you must set the `recurring` option to true, so that edge reapplies the plugin on each render call. This will allow `edge-supercharged` to re-discover the components from the filesystem.

## Creating components

The components must live inside the `./components` directory relative to the views directory and then you can reference your components as tags.

Instead of using the component as follows

```edge
@component('button', { type: 'submit' })
  <span> Submit form </span>
@end
```

You can use it as follows:

```edge
@button({ type: 'submit' })
  <span> Submit form </span>
@end
```

#### [Learn more ➞](https://docs.adonisjs.com/guides/views/components#components-as-tags)

[gh-workflow-image]: https://img.shields.io/github/workflow/status/edge-js/edge-supercharged/test?style=for-the-badge
[gh-workflow-url]: https://github.com/edge-js/edge-supercharged/actions/workflows/test.yml "Github action"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]:  "typescript"

[npm-image]: https://img.shields.io/npm/v/edge-supercharged.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/edge-supercharged "npm"

[license-image]: https://img.shields.io/npm/l/edge-supercharged?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"

[synk-image]: https://img.shields.io/snyk/vulnerabilities/github/edge-js/edge-supercharged?label=Synk%20Vulnerabilities&style=for-the-badge
[synk-url]: https://snyk.io/test/github/edge-js/edge-supercharged?targetFile=package.json "synk"
