/* eslint func-style:0, react/prop-types:0 */
import React from 'react'
import {render} from 'enzyme'
import * as glamor from 'glamor'
import glamorous from '../'

jest.mock('../constants')

test('withComponent composes the component with provided styles', () => {
  const Text = glamorous.span({color: 'red', fontSize: 20})
  const View = Text.withComponent('div')
  expect(render(<View />)).toMatchSnapshot()
})

test('withComponent creates a new component with the provided tag', () => {
  const Text = glamorous.span({color: 'red', fontSize: 20})
  const View = Text.withComponent('div')
  expect(Text.comp).toBe('span')
  expect(View.comp).toBe('div')
})

test('forwardProps are applied to the new component', () => {
  const forwardProps = ['shouldRender']
  const Text = glamorous(
    ({shouldRender, ...props}) => (shouldRender ? <span {...props} /> : null),
    {forwardProps},
  )({color: 'red', fontSize: 20})
  const View = Text.withComponent('div')
  expect(View.forwardProps).toEqual(forwardProps)
})

test('forwardProps can be overridden for the new component', () => {
  const Text = glamorous(
    ({shouldRender, ...props}) => (shouldRender ? <span {...props} /> : null),
    {forwardProps: ['shouldRender']},
  )({color: 'red', fontSize: 20})
  const forwardProps = ['other-thing']
  const View = Text.withComponent('div', {forwardProps})
  expect(View.forwardProps).toEqual(forwardProps)
})

test('forwards options', () => {
  const propsToApply = {id: 'my-span', faded: true}
  const Text = glamorous
    .span({color: 'red', fontSize: 20})
    .withProps(propsToApply)
  const View = Text.withComponent('div', {displayName: 'View'})
  expect(View.displayName).toBe('View')
  expect(View.propsToApply).toEqual([propsToApply])
})

test('resulting component can have its styles extended further', () => {
  const Text = glamorous.span({color: 'red', fontSize: 20})
  const View = Text.withComponent('div')
  const StyledView = glamorous(View)({color: 'blue'})
  expect(render(<StyledView />)).toMatchSnapshot(
    'overriding styles via wrapping with glamorous',
  )
  expect(render(<View css={{fontSize: 25}} />)).toMatchSnapshot(
    'overriding styles via css prop',
  )
  expect(
    render(<View className={glamor.css({color: 'green'})} />),
  ).toMatchSnapshot('overriding styles via className')
})

test('resulting component gets sent valid props', () => {
  const A = glamorous.div({}).withComponent('a')
  const rendered = render(<A href="https://glamorous.rocks" />)
  expect(rendered.prop('href')).toBe('https://glamorous.rocks')
})
