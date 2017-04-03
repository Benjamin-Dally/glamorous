/* eslint max-lines:0, func-style:0 */
// copied from:
// https://github.com/styled-components/styled-components/tree/
// 956e8210b6277860c89404f9cb08735f97eaa7e1/src/utils/validAttr.js
/* Trying to avoid the unknown-prop errors on glamorous components
 by filtering by React's attribute whitelist.
 */

/* Logic copied from ReactDOMUnknownPropertyHook */
const reactProps = [
  'children',
  'dangerouslySetInnerHTML',
  'key',
  'ref',
  'autoFocus',
  'defaultValue',
  'valueLink',
  'defaultChecked',
  'checkedLink',
  'innerHTML',
  'suppressContentEditableWarning',
  'onFocusIn',
  'onFocusOut',
  'className',

  /* List copied from https://facebook.github.io/react/docs/events.html */
  'onCopy',
  'onCut',
  'onPaste',
  'onCompositionEnd',
  'onCompositionStart',
  'onCompositionUpdate',
  'onKeyDown',
  'onKeyPress',
  'onKeyUp',
  'onFocus',
  'onBlur',
  'onChange',
  'onInput',
  'onSubmit',
  'onClick',
  'onContextMenu',
  'onDoubleClick',
  'onDrag',
  'onDragEnd',
  'onDragEnter',
  'onDragExit',
  'onDragLeave',
  'onDragOver',
  'onDragStart',
  'onDrop',
  'onMouseDown',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  'onSelect',
  'onTouchCancel',
  'onTouchEnd',
  'onTouchMove',
  'onTouchStart',
  'onScroll',
  'onWheel',
  'onAbort',
  'onCanPlay',
  'onCanPlayThrough',
  'onDurationChange',
  'onEmptied',
  'onEncrypted',
  'onEnded',
  'onError',
  'onLoadedData',
  'onLoadedMetadata',
  'onLoadStart',
  'onPause',
  'onPlay',
  'onPlaying',
  'onProgress',
  'onRateChange',
  'onSeeked',
  'onSeeking',
  'onStalled',
  'onSuspend',
  'onTimeUpdate',
  'onVolumeChange',
  'onWaiting',
  'onLoad',
  'onAnimationStart',
  'onAnimationEnd',
  'onAnimationIteration',
  'onTransitionEnd',

  'onCopyCapture',
  'onCutCapture',
  'onPasteCapture',
  'onCompositionEndCapture',
  'onCompositionStartCapture',
  'onCompositionUpdateCapture',
  'onKeyDownCapture',
  'onKeyPressCapture',
  'onKeyUpCapture',
  'onFocusCapture',
  'onBlurCapture',
  'onChangeCapture',
  'onInputCapture',
  'onSubmitCapture',
  'onClickCapture',
  'onContextMenuCapture',
  'onDoubleClickCapture',
  'onDragCapture',
  'onDragEndCapture',
  'onDragEnterCapture',
  'onDragExitCapture',
  'onDragLeaveCapture',
  'onDragOverCapture',
  'onDragStartCapture',
  'onDropCapture',
  'onMouseDownCapture',
  'onMouseEnterCapture',
  'onMouseLeaveCapture',
  'onMouseMoveCapture',
  'onMouseOutCapture',
  'onMouseOverCapture',
  'onMouseUpCapture',
  'onSelectCapture',
  'onTouchCancelCapture',
  'onTouchEndCapture',
  'onTouchMoveCapture',
  'onTouchStartCapture',
  'onScrollCapture',
  'onWheelCapture',
  'onAbortCapture',
  'onCanPlayCapture',
  'onCanPlayThroughCapture',
  'onDurationChangeCapture',
  'onEmptiedCapture',
  'onEncryptedCapture',
  'onEndedCapture',
  'onErrorCapture',
  'onLoadedDataCapture',
  'onLoadedMetadataCapture',
  'onLoadStartCapture',
  'onPauseCapture',
  'onPlayCapture',
  'onPlayingCapture',
  'onProgressCapture',
  'onRateChangeCapture',
  'onSeekedCapture',
  'onSeekingCapture',
  'onStalledCapture',
  'onSuspendCapture',
  'onTimeUpdateCapture',
  'onVolumeChangeCapture',
  'onWaitingCapture',
  'onLoadCapture',
  'onAnimationStartCapture',
  'onAnimationEndCapture',
  'onAnimationIterationCapture',
  'onTransitionEndCapture',
]

/* From HTMLDOMPropertyConfig */
const htmlProps = [
  /**
   * Standard Properties
   */
  'accept',
  'acceptCharset',
  'accessKey',
  'action',
  'allowFullScreen',
  'allowTransparency',
  'alt',
  // specifies target context for links with `preload` type
  'as',
  'async',
  'autoComplete',
  // autoFocus is polyfilled/normalized by AutoFocusUtils
  '// autoFocus',
  'autoPlay',
  'capture',
  'cellPadding',
  'cellSpacing',
  'charSet',
  'challenge',
  'checked',
  'cite',
  'classID',
  'className',
  'cols',
  'colSpan',
  'content',
  'contentEditable',
  'contextMenu',
  'controls',
  'coords',
  'crossOrigin',
  'data', // For `<object />` acts as `src`.
  'dateTime',
  'default',
  'defer',
  'dir',
  'disabled',
  'download',
  'draggable',
  'encType',
  'form',
  'formAction',
  'formEncType',
  'formMethod',
  'formNoValidate',
  'formTarget',
  'frameBorder',
  'headers',
  'height',
  'hidden',
  'high',
  'href',
  'hrefLang',
  'htmlFor',
  'httpEquiv',
  'icon',
  'id',
  'inputMode',
  'integrity',
  'is',
  'keyParams',
  'keyType',
  'kind',
  'label',
  'lang',
  'list',
  'loop',
  'low',
  'manifest',
  'marginHeight',
  'marginWidth',
  'max',
  'maxLength',
  'media',
  'mediaGroup',
  'method',
  'min',
  'minLength',
  // Caution; `option.selected` is not updated if `select.multiple` is
  // disabled with `removeAttribute`.
  'multiple',
  'muted',
  'name',
  'nonce',
  'noValidate',
  'open',
  'optimum',
  'pattern',
  'placeholder',
  'playsInline',
  'poster',
  'preload',
  'profile',
  'radioGroup',
  'readOnly',
  'referrerPolicy',
  'rel',
  'required',
  'reversed',
  'role',
  'rows',
  'rowSpan',
  'sandbox',
  'scope',
  'scoped',
  'scrolling',
  'seamless',
  'selected',
  'shape',
  'size',
  'sizes',
  'span',
  'spellCheck',
  'src',
  'srcDoc',
  'srcLang',
  'srcSet',
  'start',
  'step',
  'style',
  'summary',
  'tabIndex',
  'target',
  'title',
  // Setting .type throws on non-<input> tags
  'type',
  'useMap',
  'value',
  'width',
  'wmode',
  'wrap',

  /**
   * RDFa Properties
   */
  'about',
  'datatype',
  'inlist',
  'prefix',
  // property is also supported for OpenGraph in meta tags.
  'property',
  'resource',
  'typeof',
  'vocab',

  /**
   * Non-standard Properties
   */
  // autoCapitalize and autoCorrect are supported in Mobile Safari for
  // keyboard hints.
  'autoCapitalize',
  'autoCorrect',
  // autoSave allows WebKit/Blink to persist values of
  // input fields on page reloads
  'autoSave',
  // color is for Safari mask-icon link
  'color',
  // itemProp, itemScope, itemType are for
  // Microdata support. See http://schema.org/docs/gs.html
  'itemProp',
  'itemScope',
  'itemType',
  // itemID and itemRef are for Microdata support as well but
  // only specified in the WHATWG spec document. See
  // https://html.spec.whatwg.org/multipage/microdata.html#microdata-dom-api
  'itemID',
  'itemRef',
  // results show looking glass icon and recent searches on input
  // search fields in WebKit/Blink
  'results',
  // IE-only attribute that specifies security restrictions on an iframe
  // as an alternative to the sandbox attribute on IE<10
  'security',
  // IE-only attribute that controls focus behavior
  'unselectable',
]

const svgProps = [
  'accentHeight',
  'accumulate',
  'additive',
  'alignmentBaseline',
  'allowReorder',
  'alphabetic',
  'amplitude',
  'arabicForm',
  'ascent',
  'attributeName',
  'attributeType',
  'autoReverse',
  'azimuth',
  'baseFrequency',
  'baseProfile',
  'baselineShift',
  'bbox',
  'begin',
  'bias',
  'by',
  'calcMode',
  'capHeight',
  'clip',
  'clipPath',
  'clipRule',
  'clipPathUnits',
  'colorInterpolation',
  'colorInterpolationFilters',
  'colorProfile',
  'colorRendering',
  'contentScriptType',
  'contentStyleType',
  'cursor',
  'cx',
  'cy',
  'd',
  'decelerate',
  'descent',
  'diffuseConstant',
  'direction',
  'display',
  'divisor',
  'dominantBaseline',
  'dur',
  'dx',
  'dy',
  'edgeMode',
  'elevation',
  'enableBackground',
  'end',
  'exponent',
  'externalResourcesRequired',
  'fill',
  'fillOpacity',
  'fillRule',
  'filter',
  'filterRes',
  'filterUnits',
  'floodColor',
  'floodOpacity',
  'focusable',
  'fontFamily',
  'fontSize',
  'fontSizeAdjust',
  'fontStretch',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'format',
  'from',
  'fx',
  'fy',
  'g1',
  'g2',
  'glyphName',
  'glyphOrientationHorizontal',
  'glyphOrientationVertical',
  'glyphRef',
  'gradientTransform',
  'gradientUnits',
  'hanging',
  'horizAdvX',
  'horizOriginX',
  'ideographic',
  'imageRendering',
  'in',
  'in2',
  'intercept',
  'k',
  'k1',
  'k2',
  'k3',
  'k4',
  'kernelMatrix',
  'kernelUnitLength',
  'kerning',
  'keyPoints',
  'keySplines',
  'keyTimes',
  'lengthAdjust',
  'letterSpacing',
  'lightingColor',
  'limitingConeAngle',
  'local',
  'markerEnd',
  'markerMid',
  'markerStart',
  'markerHeight',
  'markerUnits',
  'markerWidth',
  'mask',
  'maskContentUnits',
  'maskUnits',
  'mathematical',
  'mode',
  'numOctaves',
  'offset',
  'opacity',
  'operator',
  'order',
  'orient',
  'orientation',
  'origin',
  'overflow',
  'overlinePosition',
  'overlineThickness',
  'paintOrder',
  'panose1',
  'pathLength',
  'patternContentUnits',
  'patternTransform',
  'patternUnits',
  'pointerEvents',
  'points',
  'pointsAtX',
  'pointsAtY',
  'pointsAtZ',
  'preserveAlpha',
  'preserveAspectRatio',
  'primitiveUnits',
  'r',
  'radius',
  'refX',
  'refY',
  'renderingIntent',
  'repeatCount',
  'repeatDur',
  'requiredExtensions',
  'requiredFeatures',
  'restart',
  'result',
  'rotate',
  'rx',
  'ry',
  'scale',
  'seed',
  'shapeRendering',
  'slope',
  'spacing',
  'specularConstant',
  'specularExponent',
  'speed',
  'spreadMethod',
  'startOffset',
  'stdDeviation',
  'stemh',
  'stemv',
  'stitchTiles',
  'stopColor',
  'stopOpacity',
  'strikethroughPosition',
  'strikethroughThickness',
  'string',
  'stroke',
  'strokeDasharray',
  'strokeDashoffset',
  'strokeLinecap',
  'strokeLinejoin',
  'strokeMiterlimit',
  'strokeOpacity',
  'strokeWidth',
  'surfaceScale',
  'systemLanguage',
  'tableValues',
  'targetX',
  'targetY',
  'textAnchor',
  'textDecoration',
  'textRendering',
  'textLength',
  'to',
  'transform',
  'u1',
  'u2',
  'underlinePosition',
  'underlineThickness',
  'unicode',
  'unicodeBidi',
  'unicodeRange',
  'unitsPerEm',
  'vAlphabetic',
  'vHanging',
  'vIdeographic',
  'vMathematical',
  'values',
  'vectorEffect',
  'version',
  'vertAdvY',
  'vertOriginX',
  'vertOriginY',
  'viewBox',
  'viewTarget',
  'visibility',
  'widths',
  'wordSpacing',
  'writingMode',
  'x',
  'xHeight',
  'x1',
  'x2',
  'xChannelSelector',
  'xlinkActuate',
  'xlinkArcrole',
  'xlinkHref',
  'xlinkRole',
  'xlinkShow',
  'xlinkTitle',
  'xlinkType',
  'xmlBase',
  'xmlns',
  'xmlnsXlink',
  'xmlLang',
  'xmlSpace',
  'y',
  'y1',
  'y2',
  'yChannelSelector',
  'z',
  'zoomAndPan',
]

// these are valid attributes that have the
// same name as CSS properties, and is used
// for css overrides API
const cssProps = ['color', 'height', 'width']

/* From DOMProperty */
// eslint-disable-next-line max-len
const ATTRIBUTE_NAME_START_CHAR = ':A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD'
// eslint-disable-next-line max-len
const ATTRIBUTE_NAME_CHAR = `${ATTRIBUTE_NAME_START_CHAR}\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040`
const isCustomAttribute = RegExp.prototype.test.bind(
  new RegExp(`^(data|aria)-[${ATTRIBUTE_NAME_CHAR}]*$`),
)

const hasItem = (list, name) => list.indexOf(name) !== -1
const isHtmlProp = name => hasItem(htmlProps, name)
const isCssProp = name => hasItem(cssProps, name)
const isSvgProp = (tagName, name) =>
  tagName === 'svg' && hasItem(svgProps, name)
const isReactProp = name => hasItem(reactProps, name)

// eslint-disable-next-line complexity
const shouldForwardProperty = (tagName, name) =>
  typeof tagName !== 'string' ||
  ((isHtmlProp(name) ||
    isSvgProp(tagName, name) ||
    isCustomAttribute(name.toLowerCase()) ||
    isReactProp(name)) &&
    (tagName === 'svg' || !isCssProp(name)))

export default shouldForwardProperty
