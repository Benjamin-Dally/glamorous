/* eslint func-style:0 */
import React from 'react'
import * as glamor from 'glamor'
import {render} from 'enzyme'
import * as jestGlamorReact from 'jest-glamor-react'
import {oneLine} from 'common-tags'
// eslint-disable-next-line import/default
import glamorous from '../'

expect.extend(jestGlamorReact.matcher)
expect.addSnapshotSerializer(jestGlamorReact.serializer)

test('sanity test', () => {
  const Div = glamorous.div({marginLeft: 24})
  expect(render(<Div />)).toMatchSnapshotWithGlamor()
})

test('can use pre-glamorous components with css attributes', () => {
  expect(
    render(
      <glamorous.A
        display="flex"
        flexDirection="column"
        href="/is-forwarded"
        id="is-forwarded"
        className="is added to classes"
      />,
    ),
  ).toMatchSnapshotWithGlamor()
})

test('merges composed component styles for reasonable overrides', () => {
  const Parent = glamorous.div({
    marginTop: 1,
    marginRight: 1,
    paddingTop: 1,
    paddingRight: 1,
  })
  const Child = glamorous(Parent)({
    marginRight: 2,
    marginBottom: 2,
    paddingTop: 2,
    paddingRight: 2,
  })
  const Grandchild = glamorous(Child)({
    marginBottom: 3,
    marginLeft: 3,
  })
  const otherGlamorStyles1 = glamor.css({
    marginLeft: 4,
    paddingTop: 4,
  })
  const otherGlamorStyles2 = glamor.css({
    paddingTop: 5,
    paddingRight: 5,
  })
  const wrapper = render(
    <Grandchild
      className={
        oneLine`
          other classes
          ${otherGlamorStyles1}
          are not
          ${otherGlamorStyles2}
          removed
        `
      }
      css={{
        paddingRight: 6,
      }}
    />,
  )
  const el = wrapper.children()[0]
  // being explicit
  const included = ['other', 'classes', 'are', 'not', 'removed']
  included.forEach(className => {
    expect(el.attribs.class).toContain(className)
  })
  // still using a snapshot though for good measure
  expect(wrapper).toMatchSnapshotWithGlamor()
})

test('styles can be functions that accept props', () => {
  const MyDiv = glamorous.div({marginTop: 1}, ({margin}) => ({
    marginTop: margin,
  }))
  expect(render(<MyDiv margin={2} />)).toMatchSnapshotWithGlamor()
})

test('falls back to `name` if displayName cannot be inferred', () => {
  const MyDiv = props => <div {...props} />
  const MyComp = glamorous(MyDiv)()
  expect(MyComp.displayName).toBe('glamorous(MyDiv)')
})

test('falls back to `unknown` if name cannot be inferred', () => {
  const MyComp = glamorous(props => <div {...props} />)()
  expect(MyComp.displayName).toBe('glamorous(unknown)')
})

test('allows you to specify a displayName', () => {
  const MyComp = glamorous(props => <div {...props} />, {
    displayName: 'HiThere',
  })()
  expect(MyComp.displayName).toBe('HiThere')
})

test('will not forward `color` to a div', () => {
  expect(render(<glamorous.Div color="red" />)).toMatchSnapshotWithGlamor()
})

test('will forward `color` to an svg', () => {
  expect(render(<glamorous.Svg color="red" />)).toMatchSnapshotWithGlamor()
})

test('allows you to specify the tag rendered by a component', () => {
  const MySvgComponent = props => <svg {...props} />
  const MyStyledSvgComponent = glamorous(MySvgComponent, {rootEl: 'svg'})({
    height: 1,
    width: 1,
  })
  expect(
    render(
      <MyStyledSvgComponent height={2} noForward={true} css={{width: 2}} />,
    ),
  ).toMatchSnapshotWithGlamor()
})

test('forwards props when the GlamorousComponent.rootEl is known', () => {
  // this test demonstrates how to prevent glamorous from forwarding
  // props all the way down to components which shouldn't be getting them
  // (components you have no control over).

  // here's a component you can't change, it renders all props to it's
  // `rootEl` which is a `div` in this case. They probably shouldn't be doing
  // this, but there are use cases for libraries to do this:
  const SomeComponentIHaveNoControlOver = jest.fn(props => <div {...props} />)

  // to prevent glamorous from forwarding non-div attributes to this
  // component, you can make a glamorous version out of it and specify the
  // `rootEl` as `div` (doesn't matter a whole lot, except in the case of
  // `svg`, if it's an `svg`, then definitely put `svg` otherwise, put
  // something else...
  const MyWrappedVersion = glamorous(SomeComponentIHaveNoControlOver, {
    rootEl: 'div',
  })()
  // no need to pass anything. This will just create be a no-op class,
  // no problem
  const MyWrappedVersionMock = jest.fn(MyWrappedVersion)

  // from there we can use our wrapped version and it will function the
  // same as the original
  const MyMyWrappedVersion = jest.fn(props => (
    <MyWrappedVersionMock {...props} />
  ))

  // then if we make a parent glamorous, it will forward props down until
  // it hits our wrapper at which time it will check whether the prop is
  // valid for `rootEl === 'div'`, and if it's not then it wont forward the
  // prop along to `SomeComponentIHaveNoControlOver` and we wont have the
  // warning from react about noForward being an invalid property for a
  // `div`. Yay!
  const MyStyledMyMyWrappedVersion = glamorous(MyMyWrappedVersion)({
    padding: 1,
    margin: 1,
  })
  const secretMessage = 'He likes it! Hey Mikey!'
  const ui = render(
    <MyStyledMyMyWrappedVersion noForward={42}>
      {secretMessage}
    </MyStyledMyMyWrappedVersion>,
  )
  const {calls: [[calledProps]]} = SomeComponentIHaveNoControlOver.mock
  expect(calledProps.noForward).toBe(undefined)
  expect(MyWrappedVersionMock).toHaveBeenCalledWith(
    {
      className: expect.anything(),
      children: secretMessage,
      noForward: 42,
    },
    expect.anything(),
    expect.anything(),
  )
  expect(MyMyWrappedVersion).toHaveBeenCalledWith(
    {
      children: secretMessage,
      className: expect.anything(),
      noForward: 42,
    },
    expect.anything(),
    expect.anything(),
  )
  expect(ui).toMatchSnapshotWithGlamor()
})
