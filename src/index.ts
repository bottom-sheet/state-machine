import type { SnapPoints } from '@bottom-sheet/types'
import { assign, createMachine } from 'xstate'
import {
  addDescription,
  assignInitialHeight,
  assignSnapPoints,
  computeMaxContent,
  computeMinContent,
  computeSnapPointBounds,
  computeSnapPoints,
  defaultInitialHeight,
  defaultSnapPoints,
} from './utils'

export {
  assignInitialHeight,
  assignSnapPoints,
  computeMaxContent,
  computeMinContent,
  computeSnapPointBounds,
  computeSnapPoints,
  defaultInitialHeight,
  defaultSnapPoints,
}

export type BottomSheetEvent =
  | { type: 'OPEN' }
  | { type: 'INITIALLY_OPEN' }
  | { type: 'AUTOFOCUS' }
  | { type: 'READY' }
  | { type: 'OPENED' }
  | { type: 'RESIZE'; payload: { height: number } }
  | { type: 'RESIZED' }
  | { type: 'SNAP'; payload: { height: number } }
  | { type: 'SNAPPED' }
  | { type: 'DRAG'; payload: { height: number } }
  | { type: 'DRAGGED' }
  | { type: 'CLOSE' }
  | { type: 'CLOSED' }
  | { type: 'SET_MAX_HEIGHT'; payload: { maxHeight: number } }
  | { type: 'SET_HEADER_HEIGHT'; payload: { headerHeight: number } }
  | { type: 'SET_CONTENT_HEIGHT'; payload: { contentHeight: number } }
  | { type: 'SET_FOOTER_HEIGHT'; payload: { footerHeight: number } }
  | { type: 'SET_MAX_CONTENT'; payload: { maxContent: number } }

export interface BottomSheetContext {
  // basically the "current snap point"
  // input: SET_HEIGHT, payload number, selects nearest snap point, is zero while 'closed' and 'opening.waiting', non-zero after 'opening.waiting.leave'
  height: number
  // used to set the context.height when moving from 'closed' to 'open', when 'open.closing' to 'open.opening' 'context.height' stays the same instead of setting to 'context.initialHeight'
  // input: SET_INITIAL_HEIGHT, number, calls userland method that needs snapPoints, lastHeight, and the same input as snapPoints
  initialHeight: number
  // super important, used all the time, should be a normalized array resulting from the snapPoints prop
  // input: SET_SNAP_POINTS, number[], calls userland method that needs headerHeight, contentHeight, footerHeight, minContent, maxContent, maxHeight,
  snapPoints: number[]
  // The last snap point the sheet was rendered in, or null if it haven't been opened yet. DRAG, OPEN, RESIZE, SNAP writes to this value, its purpose is to allow userland initialHeight to restore the previous height.
  lastHeight: number | null
  // The intrinsic preferred height to show as much of the content as possible.
  // Always less than or equal to maxHeight, similar to CSS max-content
  // Calculated as: Math.min(maxHeight, headerHeight + contentHeight + footerHeight)
  // Never equal to or lower than zero
  maxContent: number
  // Consider specific variants: lastDragHeight, lastSnapHeight, lastResizeHeight, and lastOpenHeight
  // Smallest possible height, like CSS min-content
  // Calculated as: Math.min(maxHeight, Math.max(headerHeight + footerHeight, 50))
  // It's never lower than 50, even if there is no header, content or footer elements, as 50 is considered the smallest usable tap target size
  minContent: number
  // null if there is no header element to measure, 0 if it exists but have no height
  headerHeight: number | null
  contentHeight: number | null
  footerHeight: number | null
  // Usually matches window.innerHeight, but can be a userland prop value
  // Never equal to or lower than zero
  // Consider capping it to 50 for the same reasons as minContent? As weird things happen when smaller than 50
  maxHeight: number
}

export const BottomSheetMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QGUAWYwBcB0BjANgPayQDEA8gAoCiAcoqAA7ECWmLhAdgyAB6IBGAJwB2bABZxQgEwCRABnnShkgKyqANCACeg+aoBs2AeJGmF06fIP6Avra1oMOAsTIBJWu4Aq7gIIAMgEAmgD6VHQ8zLBsHNxIfIICAMzYZoryIqri0qq50lq6CAICAByq2EJCAjbWyWUC8qX2juhY2ISMYJzYLJyxAIb4+NqkAErUfgAiwVGs7Fw8-AiqyRXJ4gbJBiJlKiIbhYiWm9irWSK51aUC0i0gTu2d3R1d-ZxQ2ADuA7Ef45MZnMYgt4qBlqUhPJsJDktI4ZDbiJSqUjghqhUDAJsupdslkkJSsl7o8cM8euS+p8fn8oKQ-ABVbzkABi5AAwgzkMDYosEhCoTChHCEdVpMjUTpECJqsYrIp8dJNkS7g4Hm0yW9Xt0qdgBgBXTCEABmhFw+pi-wm01mCWivLBiWKsiM0iJN2xyVKIhsyTRMoEcoyiuVcJJGu1FLeuoG-QAtgN2P8IrRqFMeaClohxKs0iIDuITHsZAY0WVxNDMqJbpYhKpLgZw85I5GY-HE1TSFMxn4AOIZuJZ4p5aGrVQpNaNAySNEGGQwsxzgyIpr4ptPLWUj569tJunIWh+SgDvng7NbPMFouQktlr2Yr1VKRNTb19eal4AJzge67Pf7drzIO-KIFs4iVMulzyGUBiwViZZQWcKImNB9a3Js74tt+sC-hMyDuAAWtQJ6OssOapPmV6Fje0illKxR1kIZy7G64jJEoHGNmqpJYT+nYHkeJFDlC4GmASWRNGYCh0UUwg1DCUi0ViAYlKomHktgECfgMUBQJ23Z9r2aZCSBCBgRB3pWDBcECGWOzSNgNjjgSTlKsS3ERhpWk6Xp-wCcegEgsBZ5mUqFlQdZsG2fRNRhQYlgpFCqzbNi6lathLAAF6dnhhHGYFDpDoWFH5hs15VLRaJWDK2DWG6hjJGYypqR5zYaRl2V+YeAVMEBp5OhWJVUcWlX0bI4q1ZsGTjsK04ta0bXpXAWX6f+JkhdijRnJO+LjtYM70cKgblKVSmPmurUbi8sCcAMjCMPx3U0OmBWZqZIkSAcoiqJJpjWGWQjTjCcKFvIIOKJcaXXbd92rX261Oli4GA5Z0GlHB8ExT9FQpPIUjjqUkh1FDPSuJadLsgE5DIPlvVBf1yzCGIkgyHIijKGomj0ZIqTo1WKOA8i7kLVdpNEOTFA0PQr3BYjtHYMoYNEviMiWf6c5yjmDU4pc4gk6QlPU8RMsM4gXpDWV1EVTJ0o2JUqjCmY5SK4D76kDT3ihAAsn4AAaoQABLUO4vYB94CPLMiFRWKIaNiuUVWXJUSg5HCNSxYYbse4HgLUGMOch2HEfSrsjmqKU8LsSqpVluUlQbCoyGZBJeuXZg7vUJ77LkLQ3h0J7QeF+HJukbbFTjoY4qNW5QhooSEFSUTqzenkWed6EbLkH3+eD6Hw904Vpn5oGWK0Zs2wE-iZaqmqnCEBAcA8DxZOQMXCCmGikilDC2RYhi1W5GFuqRaLw+iDGGEUA+b0QoEm-pRS2I0bYIBOKOfEBh6z6E2HIEmrZtw0j3G-LIDktibXkFUNY9YCj0RlKkN0twyi7HUFOHBW5PgGiNKac05M36NEasYSebFyilEyJKIoUdjA1EyNBfMKcWHRm3LGFgCYCEjyHCkMojkTDl3KIWZQ8J-QqAkVrKw4gUSCLkTqD4hC3SOXqHtchuIqFiNuHKZy5QNj5kJjg7CKioGy0jvFSokJy4Bi2FkAG44JCCx+qYH66CcHeV0lSN+OY4GlULFbW8MUFDQi9HOJKEk5zNDbrxGInUoBvwJBbDJiCyx4yYtOG4f1aJeiUDgm6d0HpWNUaZXhYhtg5hUHWMG7EuayShK6MwhgK6pOyDgsmySekhVMczG4QsvS5GXAdMR2R7a-29IScUqoRYfkdPaaBTo1hMXgTUmiSCbBiBRI1dBSonnInfG-fR9FGrQnRoSZceMzBwh9PYewQA */
  createMachine(
    {
      context: {
        height: 0,
        initialHeight: 0,
        snapPoints: [],
        lastHeight: null,
        maxContent: 0,
        minContent: 0,
        headerHeight: null,
        contentHeight: null,
        footerHeight: null,
        maxHeight: 0,
      },
      tsTypes: {} as import('./index.typegen').Typegen0,
      schema: {
        context: {} as BottomSheetContext,
        events: {} as BottomSheetEvent,
      },
      preserveActionOrder: true,
      id: 'bs',
      initial: 'closed',
      states: {
        closed: {
          on: {
            OPEN: {
              actions: [
                'setMinContent',
                'setMaxContent',
                'setSnapPoints',
                'setInitialHeight',
              ],
              target: 'open',
            },
            INITIALLY_OPEN: {
              target: '#bs.open.initially',
            },
          },
        },
        open: {
          initial: 'opening',
          states: {
            initially: {
              on: {
                READY: {
                  target: 'resting',
                },
              },
            },
            opening: {
              initial: 'waiting',
              states: {
                waiting: {
                  exit: 'setHeight',
                  on: {
                    READY: {
                      target: 'animating',
                    },
                    AUTOFOCUS: {
                      target: 'autofocusing',
                    },
                  },
                },
                autofocusing: {
                  exit: 'setLastHeight',
                  on: {
                    READY: {
                      target: 'animating',
                    },
                  },
                },
                animating: {
                  exit: 'setLastHeight',
                  on: {
                    OPENED: {
                      target: '#bs.open.resting',
                    },
                    DRAG: {
                      ...addDescription('redirect'),
                      target: '#bs.open.dragging',
                    },
                    SNAP: {
                      ...addDescription('redirect'),
                      target: '#bs.open.snapping',
                    },
                  },
                },
              },
            },
            resting: {
              on: {
                DRAG: {
                  target: 'dragging',
                },
                RESIZE: {
                  target: 'resizing',
                },
                SNAP: {
                  target: 'snapping',
                },
              },
            },
            dragging: {
              entry: 'setHeight',
              exit: 'setLastHeight',
              on: {
                DRAGGED: {
                  target: 'resting',
                },
                SNAP: {
                  ...addDescription('redirect'),
                  target: 'snapping',
                },
              },
            },
            resizing: {
              entry: 'setHeight',
              exit: 'setLastHeight',
              on: {
                RESIZED: {
                  target: 'resting',
                },
                SNAP: {
                  ...addDescription('redirect'),
                  target: 'snapping',
                },
                DRAG: {
                  ...addDescription('redirect'),
                  target: 'dragging',
                },
              },
            },
            snapping: {
              entry: 'setHeight',
              exit: 'setLastHeight',
              on: {
                SNAPPED: {
                  target: 'resting',
                },
                DRAG: {
                  ...addDescription('redirect'),
                  target: 'dragging',
                },
              },
            },
            closing: {
              entry: 'setHeight',
              exit: 'setLastHeight',
              on: {
                CLOSED: {
                  target: '#bs.closed',
                },
                OPEN: {
                  ...addDescription('redirect'),
                  target: 'opening',
                },
              },
            },
          },
          on: {
            CLOSE: {
              target: '.closing',
            },
          },
        },
      },
      on: {
        SET_MAX_HEIGHT: {
          actions: [
            'setMaxHeight',
            'setMinContent',
            'setMaxContent',
            'setSnapPoints',
            'setInitialHeight',
          ],
        },
        SET_HEADER_HEIGHT: {
          actions: [
            'setHeaderHeight',
            'setMinContent',
            'setMaxContent',
            'setSnapPoints',
            'setInitialHeight',
          ],
        },
        SET_CONTENT_HEIGHT: {
          actions: [
            'setContentHeight',
            'setMaxContent',
            'setSnapPoints',
            'setInitialHeight',
          ],
        },
        SET_FOOTER_HEIGHT: {
          actions: [
            'setFooterHeight',
            'setMinContent',
            'setMaxContent',
            'setSnapPoints',
            'setInitialHeight',
          ],
        },
      },
    },
    {
      actions: {
        setMaxHeight: assign({
          maxHeight: (context, event) => {
            if (event.type !== 'SET_MAX_HEIGHT') return
            return event.payload.maxHeight
          },
        }),
        setHeaderHeight: assign({
          headerHeight: (context, event) => {
            if (event.type !== 'SET_HEADER_HEIGHT') return
            return event.payload.headerHeight
          },
        }),
        setContentHeight: assign({
          contentHeight: (context, event) => {
            if (event.type !== 'SET_CONTENT_HEIGHT') return
            return event.payload.contentHeight
          },
        }),
        setFooterHeight: assign({
          footerHeight: (context, event) => {
            if (event.type !== 'SET_FOOTER_HEIGHT') return
            return event.payload.footerHeight
          },
        }),
        setMinContent: assign({
          minContent: ({ maxHeight, headerHeight, footerHeight }) =>
            computeMinContent({ maxHeight, headerHeight, footerHeight }),
        }),
        setMaxContent: assign({
          maxContent: ({
            maxHeight,
            headerHeight,
            contentHeight,
            footerHeight,
          }) =>
            computeMaxContent({
              maxHeight,
              headerHeight,
              contentHeight,
              footerHeight,
            }),
        }),
        setSnapPoints: assignSnapPoints(defaultSnapPoints),
        setInitialHeight: assignInitialHeight(defaultInitialHeight),
        setHeight: assign({
          height: (context, event) => {
            const { snapPoints } = context
            switch (event.type) {
              case 'CLOSE':
                return 0
              case 'DRAG':
              case 'RESIZE':
              case 'SNAP':
                return snapPoints.length < 1
                  ? 0
                  : computeSnapPointBounds(
                      event.payload.height,
                      snapPoints as SnapPoints
                    )[0]
              default:
                return context.initialHeight
            }
          },
        }),
        setLastHeight: assign({
          lastHeight: (context) => context.height || context.lastHeight,
        }),
      },
    }
  )
