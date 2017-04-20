import React, {Component} from 'react'
import brcast from 'brcast'
import {PropTypes} from './react-compat'
import {CHANNEL} from './constants'
/**
 * This is a component which will provide a theme to the entire tree
 * via context and event listener
 * (because pure components block context updates)
 * inspired by the styled-components implementation
 * https://github.com/styled-components/styled-components
 * @param {Object} theme the theme object..
 */
class ThemeProvider extends Component {
  broadcast = brcast(this.props.theme)

  // create theme, by merging with outer theme, if present
  getTheme(passedTheme) {
    const theme = passedTheme || this.props.theme
    return {...this.outerTheme, ...theme}
  }

  getChildContext() {
    return {
      [CHANNEL]: this.broadcast,
    }
  }

  setOuterTheme = theme => {
    this.outerTheme = theme
  }

  componentDidMount() {
    // create a new subscription for keeping track of outer theme, if present
    if (this.context[CHANNEL]) {
      this.unsubscribe = this.context[CHANNEL].subscribe(this.setOuterTheme)
    }
  }

  componentWillMount() {
    // set broadcast state by merging outer theme with own
    if (this.context[CHANNEL]) {
      this.setOuterTheme(this.context[CHANNEL].getState())
      this.broadcast.setState(this.getTheme())
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.theme !== nextProps.theme) {
      this.broadcast.setState(this.getTheme(nextProps.theme))
    }
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  render() {
    return this.props.children ?
      React.Children.only(this.props.children) :
      null
  }
}

ThemeProvider.childContextTypes = {
  [CHANNEL]: PropTypes.object.isRequired,
}

ThemeProvider.contextTypes = {
  [CHANNEL]: PropTypes.object,
}

ThemeProvider.propTypes = {
  theme: PropTypes.object.isRequired,
  children: PropTypes.node,
}

export default ThemeProvider
