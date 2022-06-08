// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true
  eventsCausingActions: {
    setMaxHeight: 'SET_MAX_HEIGHT'
    setMinContent:
      | 'SET_MAX_HEIGHT'
      | 'SET_HEADER_HEIGHT'
      | 'SET_FOOTER_HEIGHT'
      | 'OPEN'
    setMaxContent:
      | 'SET_MAX_HEIGHT'
      | 'SET_HEADER_HEIGHT'
      | 'SET_CONTENT_HEIGHT'
      | 'SET_FOOTER_HEIGHT'
      | 'OPEN'
    setSnapPoints:
      | 'SET_MAX_HEIGHT'
      | 'SET_HEADER_HEIGHT'
      | 'SET_CONTENT_HEIGHT'
      | 'SET_FOOTER_HEIGHT'
      | 'OPEN'
    setInitialHeight:
      | 'SET_MAX_HEIGHT'
      | 'SET_HEADER_HEIGHT'
      | 'SET_CONTENT_HEIGHT'
      | 'SET_FOOTER_HEIGHT'
      | 'OPEN'
    setHeight:
      | 'SET_MAX_HEIGHT'
      | 'SET_HEADER_HEIGHT'
      | 'SET_CONTENT_HEIGHT'
      | 'SET_FOOTER_HEIGHT'
      | 'TRANSITION_DRAG'
      | 'RESIZE'
      | 'SNAP'
      | 'CLOSE'
    setHeaderHeight: 'SET_HEADER_HEIGHT'
    setContentHeight: 'SET_CONTENT_HEIGHT'
    setFooterHeight: 'SET_FOOTER_HEIGHT'
    setLastHeight: 'xstate.init'
  }
  internalEvents: {
    'xstate.init': { type: 'xstate.init' }
  }
  invokeSrcNameMap: {}
  missingImplementations: {
    actions: never
    services: never
    guards: never
    delays: never
  }
  eventsCausingServices: {}
  eventsCausingGuards: {}
  eventsCausingDelays: {}
  matchesStates:
    | 'closed'
    | 'open'
    | 'open.opening'
    | 'open.opening.waiting'
    | 'open.opening.autofocusing'
    | 'open.opening.transition'
    | 'open.resting'
    | 'open.dragging'
    | 'open.dragging.gesture'
    | 'open.dragging.transition'
    | 'open.resizing'
    | 'open.snapping'
    | 'open.closing'
    | {
        open?:
          | 'opening'
          | 'resting'
          | 'dragging'
          | 'resizing'
          | 'snapping'
          | 'closing'
          | {
              opening?: 'waiting' | 'autofocusing' | 'transition'
              dragging?: 'gesture' | 'transition'
            }
      }
  tags: never
}
