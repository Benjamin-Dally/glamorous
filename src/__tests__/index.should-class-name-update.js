/* eslint func-style:0, react/prop-types:0 */
import React, {Component} from 'react'
import {css as cssMock} from 'glamor'
import {mount} from 'enzyme'
import glamorous from '../'

jest.mock('../constants')

jest.mock('glamor', () => {
  const realGlamor = require.requireActual('glamor')
  return Object.assign(realGlamor, {
    css: jest.fn(() => 'css-mock-12345'),
  })
})

beforeEach(() => {
  cssMock.mockClear()
})

test('calls shouldClassNameUpdate and updates accordingly', () => {
  const shouldClassNameUpdate = jest.fn(() => false)
  const pureDivFactory = glamorous('div', {
    shouldClassNameUpdate,
  })
  const Div = pureDivFactory({marginLeft: 1})
  const wrapper = mount(<Div id="hello" css={{marginLeft: 2}} />)
  expect(shouldClassNameUpdate).toHaveBeenCalledTimes(0)
  expect(cssMock).toHaveBeenCalledTimes(1)

  wrapper.setProps({id: 'goodbye'})
  expect(shouldClassNameUpdate).toHaveBeenCalledTimes(1)
  // It was not called again!
  expect(cssMock).toHaveBeenCalledTimes(1)

  shouldClassNameUpdate.mockReturnValueOnce(true)
  wrapper.setProps({id: 'hi there', css: {marginLeft: 3}})
  expect(shouldClassNameUpdate).toHaveBeenCalledTimes(2)
  // It was called again!
  expect(cssMock).toHaveBeenCalledTimes(2)

  // let's make sure that we're calling the function
  // with the right args.
  const props = expect.objectContaining({
    id: 'goodbye',
    css: {marginLeft: 2},
  })
  const nextProps = expect.objectContaining({
    css: {marginLeft: 3},
    id: 'hi there',
  })
  // ok ok, I'm not really testing `context` very thoroughly,
  // but can you blame me? It's so totally boring...
  // and I'm pretty sure it's working fine
  const context = expect.objectContaining({__glamorous__: undefined})
  const nextContext = expect.objectContaining({__glamorous__: undefined})
  expect(shouldClassNameUpdate).toHaveBeenCalledWith(
    props,
    nextProps,
    context,
    nextContext,
  )
})

test('shouldClassNameUpdate is specific to the component instance', () => {
  const shouldClassNameUpdate = jest.fn()

  // using a class because wrapper.instance()
  // returns null when using a stateless function
  // eslint-disable-next-line react/prefer-stateless-function
  class Container extends Component {
    render() {
      const {children} = this.props
      return <div>{children()}</div>
    }
  }

  const Div = glamorous('div', {
    shouldClassNameUpdate,
  })({
    padding: 10,
  })

  // On the third render (second forceUpdate()), change the css props
  let count = 0
  const wrapper = mount(
    <Container>
      {() => {
        count++

        return (
          <div>
            <Div css={{color: count === 3 ? 'purple' : 'red'}} />
            <Div css={{color: count === 3 ? 'green' : 'blue'}} />
          </div>
        )
      }}
    </Container>,
  )

  expect(shouldClassNameUpdate).toHaveBeenCalledTimes(0)

  wrapper.instance().forceUpdate()

  expect(shouldClassNameUpdate).toHaveBeenCalledTimes(2)
  expect(shouldClassNameUpdate.mock.calls[0]).toEqual([
    expect.objectContaining({css: {color: 'red'}}),
    expect.objectContaining({css: {color: 'red'}}),
    expect.objectContaining({__glamorous__: undefined}),
    expect.objectContaining({__glamorous__: undefined}),
  ])
  expect(shouldClassNameUpdate.mock.calls[1]).toEqual([
    expect.objectContaining({css: {color: 'blue'}}),
    expect.objectContaining({css: {color: 'blue'}}),
    expect.objectContaining({__glamorous__: undefined}),
    expect.objectContaining({__glamorous__: undefined}),
  ])

  wrapper.instance().forceUpdate()

  expect(shouldClassNameUpdate).toHaveBeenCalledTimes(4)
  expect(shouldClassNameUpdate.mock.calls[2]).toEqual([
    expect.objectContaining({css: {color: 'red'}}),
    expect.objectContaining({css: {color: 'purple'}}),
    expect.objectContaining({__glamorous__: undefined}),
    expect.objectContaining({__glamorous__: undefined}),
  ])
  expect(shouldClassNameUpdate.mock.calls[3]).toEqual([
    expect.objectContaining({css: {color: 'blue'}}),
    expect.objectContaining({css: {color: 'green'}}),
    expect.objectContaining({__glamorous__: undefined}),
    expect.objectContaining({__glamorous__: undefined}),
  ])
})
