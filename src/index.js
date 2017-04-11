/*
 * This is a relatively small abstraction that's ripe for open sourcing.
 * Documentation is in the README.md
 */
import React, {Component} from 'react'
import {css, styleSheet} from 'glamor'
import shouldForwardProperty from './should-forward-property'
import domElements from './dom-elements'
import {PropTypes} from './react-compat'
import ThemeProvider, {CHANNEL} from './theme-provider'

/**
 * This is the main export and the function that people
 * interact with most directly.
 *
 * It accepts a component which can be a string or a React Component and returns
 * a "glamorousComponentFactory"
 * @param {String|ReactComponent} comp the component to render
 * @param {Object} options helpful info for the GlamorousComponents
 * @return {Function} the glamorousComponentFactory
 */
function glamorous(comp, {rootEl, displayName} = {}) {
  return glamorousComponentFactory

  /**
   * This returns a React Component that renders the comp (closure)
   * with a className based on the given glamor styles object(s)
   * @param {...Object|Function} styles the styles to create with glamor.
   *   If any of these are functions, they are invoked with the component
   *   props and the return value is used.
   * @return {ReactComponent} the ReactComponent function
   */
  function glamorousComponentFactory(...styles) {
    /**
     * This is a component which will render the comp (closure)
     * with the glamorous styles (closure). Forwards any valid
     * props to the underlying component.
     * @param {Object} theme the theme object
     * @return {ReactElement} React.createElement
     */
    class GlamorousComponent extends Component {
      state = {theme: null}
      setTheme = theme => this.setState({theme})

      componentWillMount() {
        const {theme} = this.props
        if (this.context[CHANNEL]) {
          // if a theme is provided via props, it takes precedence over context
          this.setTheme(theme ? theme : this.context[CHANNEL].getState())
        } else {
          this.setTheme(theme || {})
        }
      }

      componentWillReceiveProps(nextProps) {
        if (this.props.theme !== nextProps.theme) {
          this.setTheme(nextProps.theme)
        }
      }

      componentDidMount() {
        if (this.context[CHANNEL] && !this.props.theme) {
          // subscribe to future theme changes
          this.unsubscribe = this.context[CHANNEL].subscribe(this.setTheme)
        }
      }

      componentWillUnmount() {
        // cleanup subscription
        this.unsubscribe && this.unsubscribe()
      }

      render() {
        const {className, ...rest} = this.props
        const {toForward, cssOverrides} = splitProps(rest, GlamorousComponent)
        // create className to apply
        const mappedArgs = GlamorousComponent.styles.map(glamorRules => {
          if (typeof glamorRules === 'function') {
            return glamorRules(this.props, {...this.state.theme})
          }
          return glamorRules
        })
        const {
          glamorStyles: parentGlamorStyles,
          glamorlessClassName,
        } = extractGlamorStyles(className)
        const glamorClassName = css(
          ...mappedArgs,
          ...parentGlamorStyles,
          cssOverrides,
        ).toString()
        const fullClassName = joinClasses(glamorlessClassName, glamorClassName)

        return React.createElement(GlamorousComponent.comp, {
          className: fullClassName,
          ...toForward,
        })
      }
    }

    GlamorousComponent.propTypes = {
      className: PropTypes.string,
      cssOverrides: PropTypes.object,
      theme: PropTypes.object,
    }

    GlamorousComponent.contextTypes = {
      [CHANNEL]: PropTypes.object,
    }

    Object.assign(
      GlamorousComponent,
      getGlamorousComponentMetadata({comp, styles, rootEl, displayName}),
    )
    return GlamorousComponent
  }
}

function getGlamorousComponentMetadata({comp, styles, rootEl, displayName}) {
  const componentsComp = comp.comp ? comp.comp : comp
  return {
    // join styles together (for anyone doing: glamorous(glamorous.a({}), {}))
    styles: comp.styles ? comp.styles.concat(styles) : styles,
    // keep track of the ultimate rootEl to render (we never
    // actually render anything but
    // the base component, even when people wrap a glamorous
    // component in glamorous
    comp: componentsComp,
    rootEl: rootEl || componentsComp,
    // set the displayName to something that's slightly more
    // helpful than `GlamorousComponent` :)
    displayName: displayName || `glamorous(${getDisplayName(comp)})`,
  }
}

function getDisplayName(comp) {
  return typeof comp === 'string' ?
    comp :
    comp.displayName || comp.name || 'unknown'
}

/*
 * This creates a glamorousComponentFactory for every DOM element so you can
 * simply do:
 * const GreenButton = glamorous.button({
 *   backgroundColor: 'green',
 *   padding: 20,
 * })
 * <GreenButton>Click Me!</GreenButton>
 */
Object.assign(
  glamorous,
  domElements.reduce(
    (getters, tag) => {
      getters[tag] = glamorous(tag)
      return getters
    },
    {},
  ),
)

/*
 * This creates a glamorous component for each DOM element so you can
 * simply do:
 * <glamorous.Div
 *   color="green"
 *   marginLeft={20}
 * >
 *   I'm green!
 * </glamorous.Div>
 */
Object.assign(
  glamorous,
  domElements.reduce(
    (comps, tag) => {
      const capitalTag = capitalize(tag)
      comps[capitalTag] = glamorous[tag]()
      comps[capitalTag].displayName = `glamorous.${capitalTag}`
      comps[capitalTag].propsAreCssOverrides = true
      return comps
    },
    {},
  ),
)

/**
 * This function takes a className string and gets all the
 * associated glamor styles. It's used to merge glamor styles
 * from a className to make sure that specificity is not
 * a problem when passing a className to a component.
 * @param {String} [className=''] the className string
 * @return {Object} { glamorStyles, glamorlessClassName }
 *   - glamorStyles is an array of all the glamor styles objects
 *   - glamorlessClassName is the rest of the className string
 *     without the glamor classNames
 */
function extractGlamorStyles(className = '') {
  return className.toString().split(' ').reduce((groups, name) => {
    if (name.indexOf('css-') === 0) {
      const id = name.slice('css-'.length)
      const {style} = styleSheet.registered[id]
      groups.glamorStyles.push(style)
    } else {
      groups.glamorlessClassName = joinClasses(
        groups.glamorlessClassName,
        name,
      )
    }
    return groups
  }, {glamorlessClassName: '', glamorStyles: []})
}

function splitProps(
  {css: cssOverrides = {}, ...rest},
  {propsAreCssOverrides, rootEl},
) {
  const returnValue = {toForward: {}, cssOverrides: {}}
  if (!propsAreCssOverrides) {
    returnValue.cssOverrides = cssOverrides
    if (typeof rootEl !== 'string') {
      // if it's not a string, then we can forward everything
      // (because it's a component)
      returnValue.toForward = rest
      return returnValue
    }
  }
  return Object.keys(rest).reduce(
    (split, propName) => {
      if (shouldForwardProperty(rootEl, propName)) {
        split.toForward[propName] = rest[propName]
      } else if (propsAreCssOverrides) {
        split.cssOverrides[propName] = rest[propName]
      }
      return split
    },
    returnValue,
  )
}

function capitalize(s) {
  return s.slice(0, 1).toUpperCase() + s.slice(1)
}

function joinClasses(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default glamorous
export {ThemeProvider}
