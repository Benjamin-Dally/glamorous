<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [Examples](#examples)
  * [Simple Example](#simple-example)
  * [Dynamic + Static Styles](#dynamic--static-styles)
  * [@supports + CSS Grid](#supports--css-grid)
  * [Ampersands & CSS Combinators](#ampersands--css-combinators)
  * [with Next.js](#with-nextjs)
  * [with create-react-app](#with-create-react-app)
  * [with ✨ polished](#with--polished)
  * [Providing props to underlying components](#providing-props-to-underlying-components)
  * [colour-contrast](#colour-contrast)
* [Third party examples on codesandbox](#third-party-examples-on-codesandbox)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Examples

### [Simple Example](https://github.com/MicheleBertoli/css-in-js/blob/master/glamorous/button.js)

This example includes both the object literal styles and prop based styles.
Additionally, shows how to implement pseudo selectors and a media query.

## Dynamic + Static Styles

One of the nice bits of glamorous is that it allows you to make a clear
separation between your dynamic and static styles by forcing you to choose
between an object literal and a function. Here's an example of having both
dynamic and static styles:

```javascript
const MyLink = glamorous.a(
  {
    color: 'blue',
    textDecoration: 'none',
  },
  ({size = 'small'}) => ({
    fontSize: size === 'big' ? 24 : 16,
  }),
  // you can continue to provide any number of arguments
  // and `glamor` will merge them. In the event of a
  // style conflict, the last one wins.
)
```

You can see a live preview of this example here: https://codesandbox.io/s/mZkpo0lKA

<details>
<summary>Note, you can also use arrays of styles if you need:</summary>

```javascript
const MyDiv = glamorous.div(
  [
    {
      [phoneMediaQuery]: {
        lineHeight: 1.2,
      },
    },
    {
      [phoneMediaQuery]: {
        lineHeight: 1.3, // this will win because it comes later
      },
    },
  ],
  ({big, square}) => {
    const bigStyles = big
      ? {
          [phoneMediaQuery]: {
            fontSize: 20,
          },
        }
      : {}

    const squareStyles = square
      ? {
          [phoneMediaQuery]: {
            borderRadius: 0,
          },
        }
      : {
          [phoneMediaQuery]: {
            borderRadius: '50%',
          },
        }
    // note that I'm returning an array here
    return [bigStyles, squareStyles]
  },
)

// result of <MyDiv big={true} square={false} /> will be:
// @media (max-width: 640px) {
//   .css-1bzhvkr,
//   [data-css-1bzhvkr] {
//     line-height: 1.3;
//     font-size: 20px;
//     border-radius: 50%;
//   }
// }
//
// <div
//   class="css-1bzhvkr"
// />
```

</details>

## @supports + CSS Grid

Want to use CSS Grid, but worried about browser support? Because `glamor`
supports the `@supports` statement, you can use that with `glamorous` easily.

Play with it [here](https://codesandbox.io/s/2k8yll8qj):

```javascript
const MyGrid = glamorous.div({
  margin: 'auto',
  backgroundColor: '#fff',
  color: '#444',
  // You can use @supports with glamor!
  // So you can use @supports with glamorous as well!
  '@supports (display: grid)': {
    display: 'grid',
    gridGap: 10,
    gridTemplateAreas: `
      "....... header header"
      "sidebar content content"
      "footer  footer  footer"
    `,
  },
})
```

## Ampersands & CSS Combinators

You can use an ampersand (`&`) as a reference to the generated selector. This approach can be useful for CSS combinators: adjacent sibling selectors (`+`), general sibling selectors (`~`) and child selectors (`>`).

Play with it [here](https://codesandbox.io/s/W7j7BAQ9x):

```javascript
const Item = glamorous.div({
  'background-color': 'red',
  '& + &': {
    'margin-top': '10px',
    'background-color': 'orange',
  },
  '&:first-of-type + &': {
    'background-color': 'yellow',
  },
  '& ~ &': {
    'background-color': 'green',
  },
  '& > &': {
    'background-color': 'blue',
  },
})
```

## with Next.js

Here's a [deployed example](https://with-glamorous-zrqwerosse.now.sh/) of using
`glamorous` with `Next.js`. See the code [here][next].

[next]: https://github.com/zeit/next.js/tree/master/examples/with-glamorous

## with create-react-app

[Here](https://github.com/patitonar/create-react-app-glamorous) is an example of using
`glamorous` with `create-react-app`.

## with ✨ polished

`glamorous` works with `✨ polished` mixins, helpers, and shorthands:

```jsx
const MyStyledParagraph = glamorous.p({
  fontSize: 20,
  color: lighten(0.5, '#000'),
})
```

You can also use [object spread properties](https://github.com/tc39/proposal-object-rest-spread) to apply more complex `✨ polished` mixins directly onto `glamorous` components:

```jsx
function GlamorousLogo() {
  return (
    <glamorous.Div
      width={400}
      height={400}
      border="2px solid"
      borderColor={mix(0.5, '#fff', '#000')}
      {...borderRadius('top', '5px')}
    />
  )
}
```

You can play more with `✨ polished` and `glamorous` [here](https://codesandbox.io/s/9Qo9kMgRZ).

## Providing props to underlying components

When you wrap a component with `glamorous`, you may want to have pre-defined props
that your component will pass by default. You may be tempted to make a new component
that forwards props to that component with some defaults, but don't do that!
[Just use `defaultProps`](https://codesandbox.io/s/82vZm5q2o)!

```jsx
const MyComponent = ({shouldRender, ...rest}) =>
  shouldRender ? <div {...rest} /> : null
const MyGlamorousComponent = glamorous(MyComponent)(({color, big}) => ({
  color,
  fontSize: big ? 46 : 30,
}))
MyGlamorousComponent.defaultProps = {
  shouldRender: true,
  color: '#F27777',
  big: true,
}
```

## colour-contrast

A brilliant app called [colour-contrast](https://colour-contrast.github.io/) ([source](https://github.com/colour-contrast/colour-contrast.github.io))
that uses [`styled-components`](https://github.com/styled-components/styled-components) was created by [James Gee](https://twitter.com/Geeman201).
[I](https://twitter.com/kentcdodds) forked it and made a version that uses `glamorous`. [colour-contrast.netlify.com](https://colour-contrast.netlify.com/) ([source](https://github.com/kentcdodds/colour-contrast.github.io))

Fun stuff!

# Third party examples on codesandbox

* [Material Design Component Styles with Glamorous on codesandbox.io](https://codesandbox.io/s/L9or75AEg) : How to design lean and themeable react component with glamorous.

* [React Transition Groups](https://codesandbox.io/s/0lKnOAP3) : An easy way to perform animations when a React component enters or leaves the DOM
