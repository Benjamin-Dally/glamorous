/* eslint func-style:0, react/prop-types:0 */
import React from 'react'
import {render} from 'enzyme'
import * as jestGlamorReact from 'jest-glamor-react'

import glamorousTiny from '../tiny'

expect.extend(jestGlamorReact.matcher)
expect.addSnapshotSerializer(jestGlamorReact.serializer)

test('should pass glam object prop', () => {
  const dynamicStyles = jest.fn(({glam: {big}}) => ({
    fontSize: big ? 20 : 10,
  }))
  const Comp = glamorousTiny('div')(
    {
      marginLeft: '24px',
    },
    dynamicStyles,
  )

  const glam = {big: true}
  const theme = {color: 'blue'}
  expect(
    render(<Comp id="hey-there" glam={glam} theme={theme} />),
  ).toMatchSnapshotWithGlamor()
  expect(dynamicStyles).toHaveBeenCalledTimes(1)
  expect(dynamicStyles).toHaveBeenCalledWith(
    {
      glam,
      id: 'hey-there',
      theme, // this is just insidental because we have a theme prop
    },
    theme,
  )
})
