<img src="https://github.com/paypal/glamorous/raw/master/other/glamorous.png" alt="glamorous logo" title="glamorous" align="right" width="150" height="150" />

# glamorous

React component styling solved with an elegant ([inspired](#inspiration)) API,
small footprint (<5kb gzipped), and great performance (via [`glamor`][glamor]).

> Read [the intro blogpost][intro-blogpost]

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![Dependencies][dependencyci-badge]][dependencyci]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npm-stat]
[![MIT License][license-badge]][LICENSE]

[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Chat][chat-badge]][chat]
[![Donate][donate-badge]][donate]
[![Code of Conduct][coc-badge]][coc]
[![Roadmap][roadmap-badge]][roadmap]
[![Examples][examples-badge]][examples]

[![gzip size][gzip-badge]][unpkg-dist]
[![size][size-badge]][unpkg-dist]
[![module formats: umd, cjs, and es][module-formats-badge]][unpkg-dist]
[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

## The problem

You like CSS in JS, but you don't like having to create entire component
functions just for styling purposes. You don't want to give a name to something
that's purely style-related. And it's just kind of annoying to do the
style-creating, `className` assigning, and props-forwarding song and dance.

For example, this is what you have to do with raw `glamor` (or `aphrodite` or
similar for that matter):

```javascript
const styles = glamor.css({
  fontSize: 20,
  textAlign: 'center',
})
function MyStyledDiv({className = '', ...rest}) {
  return (
    <div
      className={`${styles} ${className}`}
      {...rest}
    />
  )
}
```

## This solution

With `glamorous`, that example above looks as simple as this:

```javascript
const MyStyledDiv = glamorous.div({
  fontSize: 20,
  textAlign: 'center',
})
```

In fact, it's even better, because there are a bunch of features that make
composing these components together really nice!

Oh, and what if you didn't care to give `MyStyledDiv` a name? If you just want
a div that's styled using glamor? You can do that too:

```javascript
const { Div } = glamorous

function App() {
  return (
    <Div
      fontSize={20}
      textAlign="center"
    >
      Hello world!
    </Div>
  )
}
```

So that's the basics of this solution... Let's get to the details!

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
npm install --save glamorous
```

This also depends on `react` and `glamor` so you'll need those in your project
as well (if you don't already have them):

```
npm install --save react glamor
```

You can then use one of the module formats:

- `main`: `dist/glamorous.cjs.js` - exports itself as a CommonJS module
- `global`: `dist/glamorous.umd.js` and `dist/glamorous.umd.min.js` - exports
  itself as a [umd][umd] module which is consumable in several environments, the
  most notable as a global.
- `jsnext:main` and `module`: `dist/glamorous.es.js` - exports itself using the
  ES modules specification, you'll need to configure webpack to make use of this
  file do this using the [resolve.mainFields][mainFields] property.

The most common use-case is consuming this module via CommonJS:

```javascript
const glamorous = require('glamorous')
// etc.
```

If you're transpiling (and/or using the `jsnext:main`):

```javascript
import glamorous from 'glamorous'
```

If you want to use the global:

```html
<!-- Load dependencies -->
<script src="https://unpkg.com/react/dist/react.js"></script>
<script src="https://unpkg.com/glamor/umd/index.js"></script>
<!-- load library -->
<script src="https://unpkg.com/glamorous/dist/glamorous.umd.js"></script>
<script>
// Use window.glamorous here...
</script>
```

## Terms and concepts

### glamorous

The `glamorous` function is the main (only) export. It allows you to create
glamorous components that render the styles to the component you give it. This
is done by forwarding a `className` prop to the component you tell it to render.
But before we get into how you wrap custom components, let's talk about the
built-in DOM components.

#### built-in DOM component factories

For every DOM element, there is an associated `glamorous` component factory
attached to the `glamorous` function. As above, you can access these factories
like so: `glamorous.div`, `glamorous.a`, `glamorous.article`, etc.

#### glamorousComponentFactory

Whether you create one yourself or use one of the built-in ones mentioned above,
each `glamorousComponentFactory` allows you to invoke it with styles and it
returns you a new component which will have those styles applied when it's
rendered. This is accomplished by generating a `className` for the styles you
give and forwarding that `className` onto the rendered element. So if you're
wrapping a component you intend to style, you'll need to make sure you accept
the `className` as a prop and apply it to where you want the styles applied in
your custom component (normally the root element).

##### ...styles

The `glamorousComponentFactory` accepts any number of style object arguments.
These can be style objects or functions which are invoked with `props` on every
render and return style objects. To learn more about what these style objects
can look like, please take a look at the [`glamor`][glamor] documentation.

#### GlamorousComponent

The `GlamorousComponent` is what is returned from the
`glamorousComponentFactory`. Its job is to get all the styles together get a
`className` (from [`glamor`][glamor]) and forward that on to your component.

For examples below, we'll use this as our GlamorousComponent:

```javascript
const MyStyledDiv = glamorous.div({margin: 1, fontSize: 1, padding: 1})
```

It does a few interesting things based on the props you pass it:

##### `className`

For each `className` you provide, the `GlamorousComponent` will check to see
whether it is a [`glamor`][glamor] generated `className` (can be from raw glamor
or from `glamorous`, doesn't matter). If it is, it will get the original styles
that were used to generate that `className` and merge those with the styles for
the element that's rendered in a way that the provided `className`'s styles win
in the event of a conflict.

If the `className` is not generated by `glamor`, then it will simply be
forwarded along with the `GlamorousComponent`-generated `className`.

```javascript
const myCustomGlamorStyles = glamor.css({fontSize: 2})
<MyStyledDiv className={`${myCustomGlamorStyles} custom-class`} />
// styles applied:
// {margin: 1, fontSize: 2, padding: 1}
// as well as any styles custom-class applies
```

##### `cssOverrides`

This is an object and if provided, it will be merged with this component's and
take highest priority over the component's predefined styles.

```javascript
const myCustomGlamorStyles = glamor.css({fontSize: 2, padding: 2})
<MyStyledDiv
  className={`${myCustomGlamorStyles} custom-class`}
  cssOverrides={{padding: 3}}
/>
// styles applied:
// {margin: 1, fontSize: 2, padding: 3}
// as well as any styles custom-class applies
```

##### other props

Only props that are safe to forward to the specific `element` that will
ultimately be rendered will be forwarded. So this is totally legit:

```javascript
<MyStyledDiv size="big" />
```

A use case for doing something like this would be for dynamic styles:

```javascript
const staticStyles = {color: 'green'}
const dynamicStyles = props => {fontSize: props.size === 'big' ? 32 : 24}
const MyDynamicallyStyledDiv = glamorous.div(staticStyles, dynamicStyles)
```

> The exception to this prop forwarding is the pre-created `GlamorousComponent`s
> (see below).

#### built-in GlamorousComponents

Often you want to style something without actually giving it a name (because
naming things is hard). So glamorous also exposes a pre-created
`GlamorousComponent` for each DOM node type which make this reasonable to do:

```javascript
const { Div, Span, A, Img } = glamorous

function MyUserInterface({name, tagline, imageUrl, homepage, size}) {
  const nameSize = size
  const taglineSize = size * 0.5
  return (
    <Div display="flex" flexDirection="column" justifyContent="center">
      <A href={homepage} textDecoration="underline" color="#336479">
        <Img borderRadius="50%" height={180} src={imageUrl} />
        <Div fontSize={nameSize} fontWeight="bold">{name}</Div>
      </A>
      <Span fontSize={taglineSize} color="#767676">
        {tagline}
      </Span>
    </Div>
  )
}
```

Having to name all of that stuff could be tedious, so having these pre-built
components is handy. The other handy bit here is that the props _are_ the styles
for these components. Notice that glamorous can distinguish between props that
are for styling and those that are have semantic meaning (like with the `Img`
and `A` components which make use of `src` and `href` props).

One other tip... This totally works:

```javascript
<glamorous.Div color="blue">
  JSX is pretty wild!
</glamorous.Div>
```

### Server Side Rendering (SSR)

Because both `glamor` and `react` support SSR, `glamorous` does too! I actually
do this on [my personal site](https://github.com/kentcdodds/kentcdodds.com)
which is generated at build-time on the server. Learn about rendering
[`react` on the server][react-ssr] and [`glamor` too][glamor-ssr].

## Inspiration

This package was inspired by the work from people's work on the following
projects:

- [styled-components](https://github.com/styled-components/styled-components)
- [jsxstyle](https://github.com/smyte/jsxstyle)

The biggest inspiration for building this is because I love the API offered by
`styled-components`, but I wanted:

1. Not to ship a CSS parser to the browser (because it's huge and less
  performant).
2. Support for RTL (via something like [rtl-css-js][rtl-css-js])
3. Support for using _real_ JavaScript objects rather than a CSS string (better
  tooling support, ESLint, etc.)

> You can get around the parser issue if you use a certain babel plugin, but
> then you can't do any dynamic construction of your CSS string (like
> [this][styled-components-util]) which is a bummer for custom utilities.

## Other Solutions

There are actually quite a few solutions to the general problem of styling in
React. This isn't the place for a full-on comparison of features, but I'm
unaware of any which supports _all_ of the features which this library supports.

## Support

If you need help, please fork [this codepen][help-pen] and bring it up in
[the chat][chat]

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;"/><br /><sub>Kent C. Dodds</sub>](https://kentcdodds.com)<br />[💻](https://github.com/paypal/glamorous/commits?author=kentcdodds) [📖](https://github.com/paypal/glamorous/commits?author=kentcdodds) 🚇 [⚠️](https://github.com/paypal/glamorous/commits?author=kentcdodds) | [<img src="https://avatars0.githubusercontent.com/u/587016?v=3" width="100px;"/><br /><sub>Ives van Hoorne</sub>](http://ivesvh.com)<br />💡 | [<img src="https://avatars3.githubusercontent.com/u/4614574?v=3" width="100px;"/><br /><sub>Gerardo Nardelli</sub>](https://gnardelli.com)<br />[📖](https://github.com/paypal/glamorous/commits?author=patitonar) |
| :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/paypal/glamorous.svg?style=flat-square
[build]: https://travis-ci.org/paypal/glamorous
[coverage-badge]: https://img.shields.io/codecov/c/github/paypal/glamorous.svg?style=flat-square
[coverage]: https://codecov.io/github/paypal/glamorous
[dependencyci-badge]: https://dependencyci.com/github/paypal/glamorous/badge?style=flat-square
[dependencyci]: https://dependencyci.com/github/paypal/glamorous
[version-badge]: https://img.shields.io/npm/v/glamorous.svg?style=flat-square
[package]: https://www.npmjs.com/package/glamorous
[downloads-badge]: https://img.shields.io/npm/dm/glamorous.svg?style=flat-square
[npm-stat]: http://npm-stat.com/charts.html?package=glamorous&from=2017-04-01
[license-badge]: https://img.shields.io/npm/l/glamorous.svg?style=flat-square
[license]: https://github.com/paypal/glamorous/blob/master/other/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[donate]: http://kcd.im/donate
[chat]: https://gitter.im/paypal/glamorous
[chat-badge]: https://img.shields.io/gitter/room/paypal/glamorous.svg?style=flat-square
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/paypal/glamorous/blob/master/other/CODE_OF_CONDUCT.md
[roadmap-badge]: https://img.shields.io/badge/%F0%9F%93%94-roadmap-CD9523.svg?style=flat-square
[roadmap]: https://github.com/paypal/glamorous/blob/master/other/ROADMAP.md
[examples-badge]: https://img.shields.io/badge/%F0%9F%92%A1-examples-8C8E93.svg?style=flat-square
[examples]: https://github.com/paypal/glamorous/blob/master/other/EXAMPLES.md
[github-watch-badge]: https://img.shields.io/github/watchers/paypal/glamorous.svg?style=social
[github-watch]: https://github.com/paypal/glamorous/watchers
[github-star-badge]: https://img.shields.io/github/stars/paypal/glamorous.svg?style=social
[github-star]: https://github.com/paypal/glamorous/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20glamorous!%20https://github.com/paypal/glamorous%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/paypal/glamorous.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[glamor]: https://github.com/threepointone/glamor
[rtl-css-js]: https://github.com/kentcdodds/rtl-css-js
[gzip-badge]: http://img.badgesize.io/https://unpkg.com/glamorous/dist/glamorous.umd.min.js?compression=gzip&label=gzip%20size&style=flat-square
[size-badge]: http://img.badgesize.io/https://unpkg.com/glamorous/dist/glamorous.umd.min.js?label=size&style=flat-square
[unpkg-dist]: https://unpkg.com/glamorous/dist/
[module-formats-badge]: https://img.shields.io/badge/module%20formats-umd%2C%20cjs%2C%20es-green.svg?style=flat-square
[mainFields]: https://webpack.js.org/configuration/resolve/#resolve-mainfields
[umd]: https://github.com/umdjs/umd
[styled-components-util]: https://codepen.io/kentcdodds/pen/MpxMge
[intro-blogpost]: https://medium.com/p/fb3c9f4ed20e
[react-ssr]: https://facebook.github.io/react/docs/react-dom-server.html
[glamor-ssr]: https://github.com/threepointone/glamor/blob/5e7d988211330b8e2fca5bb8da78e35051444efd/docs/server.md
[help-pen]: http://kcd.im/glamorous-help
