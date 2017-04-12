/*
 * This is used to check if a property name is one of the React-specific
 * properties and determine if that property should be forwarded
 * to the React component
 */

/* Logic copied from ReactDOMUnknownPropertyHook */
export default [
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
