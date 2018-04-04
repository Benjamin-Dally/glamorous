import * as React from 'react'
import glamorous, {withTheme, ThemeProvider} from '../'

// Needed if generating definition files
// https://github.com/Microsoft/TypeScript/issues/5938
import {GlamorousComponent, GlamorousComponentProps} from '../'

import {CSSPropertiesPseudo, CSSPropertiesLossy} from '../'

// Glamorous built in Components named exports

import {Article, H1, P} from '../'

const useBuiltInNamedExports = (
  <Article color="black">
    <H1 float="left">Test</H1>
    <P marginBottom="10px">Built in components</P>
  </Article>
)

// Properties
const Static = glamorous.div({
  fontSize: 20,
  textAlign: 'center',
  grid: 'auto-flow dense / 40px 40px 1fr',
  gridTemplate: 'fit-content(100px) / fit-content(40%)',
})

// multi level nested properties

glamorous.div({
  ':hover': {
    '& .vendor-class': {
      height: '10px',
    },
  },
})

glamorous.svg({
  ':hover': {
    '& .vendor-class': {
      height: '10px',
    },
  },
})

export interface StaticProps {
  visible: boolean
}

const StaticWithProps = glamorous.div<StaticProps>(props => ({
  display: props.visible ? 'block' : 'none',
}))

const useStatic = <StaticWithProps visible />

// Properties Array
glamorous.div({
  overflowWrap: 'break-word',
  display: ['flex', 'block'],
})

glamorous.circle({
  textAlign: 'center',
  display: ['marker', 'block'],
})

// pseudo and complex Properties
glamorous.div({
  ':active': {
    fontSize: 10,
  },
  '&:active': {
    fontSize: 20,
    textAlign: 'center',
  },
})

// classname string style
const Classname = glamorous.div(
  {
    fontSize: 20,
    textAlign: 'center',
  },
  'example',
)

// StyleFunction
const StyleFunction = glamorous.h1<{color: string}>(
  {
    fontSize: '10px',
    zIndex: 'auto',
  },
  'example',
  props => ({
    color: props.color,
  }),
)

// withComponent
const ExampleWithComponent = Classname.withComponent('p')

const OtherExampleWithComponent = StyleFunction.withComponent('p')

const UseWithComponent = () => (
  <Classname>
    <OtherExampleWithComponent color="red" />
  </Classname>
)

const StyleFunctionUseColor = () => <StyleFunction color="red" />

// StyleFunction Array return
const StyleFunctionArray = glamorous.h1<{color: string}>(props => [
  'example',
  {
    color: props.color,
  },
])

// Style Array
const StyleArray = glamorous.h1<{color: string}>([
  'example',
  props => [
    'example',
    {
      color: props.color,
    },
  ],
])

// theme styles
const Divider = glamorous.span<{
  theme: {main: {color: string}}
}>(
  {
    fontSize: '10px',
    zIndex: 'auto',
  },
  ({theme}) => ({
    color: theme.main && theme.main.color,
  }),
)

// n-number of styles
const SpanDivider = glamorous.span<{
  theme: {awesome: string; main: string}
}>(
  {
    fontSize: '10px',
  },
  ({theme}) => ({
    color: theme.awesome,
  }),
  {
    fontWeight: 500,
  },
  {
    fontFamily: 'Roboto',
    fontWeight: 500,
  },
  ({theme}) => ({
    color: theme.main,
  }),
)

interface DividerInsideDividerProps {
  color: string
}

// component styles
const DividerInsideDivider = glamorous(Divider)<{
  visible: boolean
}>(({visible}) => ({
  display: visible ? 'block' : 'none',
}))

const DividerInsideDividerWithTheme = glamorous(Divider)<{
  visible: boolean
  theme: {main: {color: string}}
}>(
  {
    fontSize: '10px',
  },
  ({visible, theme}) => ({
    display: visible ? 'block' : 'none',
    color: theme.main.color,
  }),
)

const theme = {
  main: {
    color: 'red',
  },
}

export const Balloon = () => (
  <ThemeProvider theme={theme}>
    <Divider
      theme={{
        main: {color: 'blue'},
      }}
    >
      <DividerInsideDivider visible />
      <DividerInsideDividerWithTheme visible />
      <DividerInsideDividerWithTheme
        visible
        theme={{
          main: {color: 'blue'},
        }}
      >
        <Static>Static</Static>
        <StyleFunction color="blue">Hello</StyleFunction>
      </DividerInsideDividerWithTheme>
    </Divider>
  </ThemeProvider>
)

export class AirBalloon extends React.Component<{}, {}> {
  private spanElem: HTMLSpanElement

  public render() {
    return (
      <Divider
        innerRef={(c: HTMLSpanElement) => {
          this.spanElem = c
        }}
      >
        Hello
        <SpanDivider>Span Divider</SpanDivider>
      </Divider>
    )
  }
}

class Test extends React.Component<object, object> {
  private div: HTMLDivElement
  render() {
    return (
      <div
        ref={(c: HTMLDivElement) => {
          this.div = c
        }}
      />
    )
  }
}

// React Class Wrapped Component

interface ClassToWrapProps {
  className: string
  test: number
}

class ClassToWrap extends React.Component<ClassToWrapProps, object> {
  render() {
    return <div className={this.props.className} />
  }
}

const WrappedClass = glamorous(ClassToWrap)({})

const useWrappedClass = <WrappedClass test={10} className="" />

// React Stateless Wrapped Component

export interface WrappedStatelessProps {
  theme: {
    visible: boolean
  }
}

const StatelessToWrap: React.StatelessComponent<object> = () => <div />

const WrappedStateless = glamorous(StatelessToWrap)<WrappedStatelessProps>(
  props => ({
    display: props.theme.visible ? 'block' : 'none',
  }),
)

// Exported Component (for testing declaration generation)
export const ExportTest = glamorous.div({})

// Theme Provider

interface ExampleTheme {
  color: string
}

const exampleTheme: ExampleTheme = {
  color: 'red',
}

const ThemedComponent = glamorous.h1<{theme: ExampleTheme}>(
  {
    fontSize: '10px',
  },
  ({theme}) => ({
    color: theme ? theme.color : 'blue',
  }),
)

export const ThemeProviderAndThemedComponent = () => (
  <ThemeProvider theme={exampleTheme}>
    <ThemedComponent />
  </ThemeProvider>
)

// Glamorous component using general prop

const props: GlamorousComponentProps<React.HTMLProps<HTMLButtonElement>> = {
  name: 'button',
  onClick: () => {},
}

const GlamorousButton = glamorous.button({
  fontSize: '10px',
})

const UseGlamorousButtonWithGlamorousComponentProps = (
  <GlamorousButton {...props} />
)

// Extended component with theme prop

interface ExampleTheme {
  color: string
}

interface Props {
  title: string
  theme: ExampleTheme
}

const ComponentWithTheme: React.SFC<Props> = props => (
  <h3
    style={{
      color: props.theme.color,
    }}
  >
    {props.title}
  </h3>
)

const NonGlamorousThemedComponent = withTheme<Props>(ComponentWithTheme)

const NonGlamorousAlsoThemedComponent = withTheme<Props>(ComponentWithTheme)

const UseNonGlamorousThemedComponent = (
  <div>
    <NonGlamorousThemedComponent title="test" />
    <NonGlamorousAlsoThemedComponent title="test" />
  </div>
)

// displayName

const TestDisplayName: React.SFC<object> = () => <div />

glamorous(TestDisplayName, {
  displayName: 'example',
})

// custom glamorous component factory

interface ExampleComponentProps {
  visible: boolean
}

const ExampleComponent: React.SFC<ExampleComponentProps> = () => <div />

const StyledExampleComponent = glamorous(ExampleComponent)(props => ({
  display: props.visible ? 'none' : 'block',
}))

const StyledExampleComponentHTMLKey = glamorous<{visible: boolean}>('div')(
  props => ({
    display: props.visible ? 'none' : 'block',
  }),
)

const StyledExampleComponentSVGKey = glamorous<{visible: boolean}>('circle')(
  {
    fill: 'black',
  },
  props => ({
    display: props.visible ? 'none' : 'block',
  }),
)

glamorous('circle')({allowReorder: 'yes'})
glamorous('div')({color: 'red'})

const usingStyledExampleComponent = (
  <div>
    <StyledExampleComponent visible={false} />
    <StyledExampleComponent visible={false} className="" theme={{}} />
    <StyledExampleComponentHTMLKey visible={false} />
    <StyledExampleComponentSVGKey visible={false} />
  </div>
)

// shouldClassNameUpdate

interface ShouldClassNameUpdateProps {
  color: string
}

const TestShouldClassNameUpdate: React.SFC<ShouldClassNameUpdateProps> = () => (
  <div />
)

const pureDivFactory = glamorous(TestShouldClassNameUpdate, {
  shouldClassNameUpdate: (props, previousProps, context, previousContext) => {
    if (props.color !== props.color) {
      return false
    }
    return true
  },
})

interface ShouldClassNameUpdateContext {
  color: string
}

const pureDivFactory2 = glamorous<
  ShouldClassNameUpdateProps,
  ShouldClassNameUpdateContext
>(TestShouldClassNameUpdate, {
  shouldClassNameUpdate: (props, previousProps, context, previousContext) => {
    if (context.color !== previousContext.color) {
      return false
    }

    return true
  },
})

const PureDiv = pureDivFactory({marginLeft: 1})

// withProps

const WithPropsDiv = glamorous('div', {
  withProps: {primaryColor: 'red'},
})(props => ({
  color: props.primaryColor,
}))

const SimpleComponent = () => <div />

const WithPropsSimpleComponent = glamorous(SimpleComponent, {
  withProps: {primaryColor: 'red'},
})(props => ({
  color: props.primaryColor,
}))

const MethodWithPropsComponent = glamorous(SimpleComponent)({}).withProps({
  primaryColor: 'red',
})

const useWithProps = (
  <div>
    <WithPropsDiv />
    <WithPropsDiv primaryColor="red" />
    <WithPropsSimpleComponent />
    <WithPropsSimpleComponent primaryColor="red" />
    <MethodWithPropsComponent />
    <MethodWithPropsComponent primaryColor="1" />
  </div>
)

// propsAreCssOverrides

const ComponentPropsAreCssOverides = glamorous(SimpleComponent, {
  propsAreCssOverrides: true,
})({
  margin: 1,
  fontSize: 1,
})

const DivPropsAreCssOverides = glamorous('div', {propsAreCssOverrides: true})({
  margin: 1,
  fontSize: 1,
})

const usePropsAreCssOverrides = (
  <div>
    <ComponentPropsAreCssOverides display={'block'} />
    <DivPropsAreCssOverides display={'block'} />
  </div>
)

import {Span, Div} from '../'

const testDiv: React.ReactNode = (
  <Div>
    <Div />
  </Div>
)

const BuiltinSingleElement: JSX.Element = (
  <glamorous.Div display="block" onClick={() => {}} />
)
const BuiltinSingleElementNamedExport: JSX.Element = (
  <Span display="block" onClick={() => {}} />
)

const BuiltinSingleChild: JSX.Element = (
  <glamorous.Div>
    <Span>Hello, world!</Span>
  </glamorous.Div>
)

const BuiltinMultipleChild: JSX.Element = (
  <glamorous.Div>
    <Span>Hello,</Span>
    <glamorous.Span>world!</glamorous.Span>
  </glamorous.Div>
)

const BuiltinStyledSingleElement: JSX.Element = <glamorous.Div color="red" />

const BuiltinStyledWithSingleChild: JSX.Element = (
  <glamorous.Div color="red">
    <glamorous.Span>Hello, world!</glamorous.Span>
  </glamorous.Div>
)

const BuiltinStyledWithMultipleChild: JSX.Element = (
  <glamorous.Div color="red" onClick={() => {}}>
    <glamorous.Span>Hello,</glamorous.Span>
    <Span>world!</Span>
  </glamorous.Div>
)

const CustomStatelessComponent: React.SFC<{}> = _props => <div />
class CustomClassComponent extends React.Component<{}, {}> {
  render() {
    return null
  }
}
const CustomGlamorousComponent = glamorous.div()
const CustomGlamorousComponent2 = glamorous('div')()
const CustomGlamorousComponent3 = glamorous(CustomGlamorousComponent)()
const BuiltinStyledComponentChildren: JSX.Element = (
  <glamorous.Div height={18} onClick={() => {}}>
    {}
    <CustomStatelessComponent />
    <CustomClassComponent />
    <CustomGlamorousComponent />
    <CustomGlamorousComponent2 />
    <CustomGlamorousComponent3 />
  </glamorous.Div>
)
const BuiltinStyledWithPrimitivesChildren: JSX.Element = (
  <PureDiv color="red">
    {null}
    {false}
    {true}
    {undefined}
    {5}
  </PureDiv>
)

const BuiltinStyledWithFragment: JSX.Element = (
  <div>
    <glamorous.Div color="red" onClick={() => {}}>
      <React.Fragment />
    </glamorous.Div>
    <Span color="red" onClick={() => {}}>
      <React.Fragment />
    </Span>
  </div>
)

const cssProps = {
  ':active': {
    color: 'purple',
  },
}

const BuiltinStyledWithCSSPseudoProps = (
  <div>
    <glamorous.A {...cssProps} />
    <glamorous.A css={cssProps} />
  </div>
)

const nestedCssProps = [
  {color: 'red'},
  () => ({fontSize: 123}),
  () => () => () => [{border: '1px solid black'}],
]

const NestedStyleFunctions = (
  <div>
    <glamorous.Div css={nestedCssProps} />
  </div>
)
