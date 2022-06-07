import { assignInitialHeight, BottomSheetMachine } from '..'
import { assignSnapPoints } from '../utils'

describe('sheetMachine', () => {
  describe('context', () => {
    const openingState = BottomSheetMachine.transition(
      BottomSheetMachine.initialState.value,
      { type: 'OPEN' }
    )

    test('initial state', () => {
      const { context, value } = BottomSheetMachine.initialState

      expect({ context, value }).toMatchInlineSnapshot(`
        Object {
          "context": Object {
            "contentHeight": null,
            "footerHeight": null,
            "headerHeight": null,
            "height": 0,
            "initialHeight": 0,
            "lastHeight": null,
            "maxContent": 0,
            "maxHeight": 0,
            "minContent": 0,
            "snapPoints": Array [],
          },
          "value": "closed",
        }
      `)
    })

    describe('maxHeight', () => {
      test('SET_MAX_HEIGHT', () => {
        const { context } = BottomSheetMachine.transition(openingState.value, {
          type: 'SET_MAX_HEIGHT',
          payload: { maxHeight: 1920 },
        })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": null,
            "footerHeight": null,
            "headerHeight": null,
            "height": 0,
            "initialHeight": 50,
            "lastHeight": null,
            "maxContent": 50,
            "maxHeight": 1920,
            "minContent": 50,
            "snapPoints": Array [
              50,
            ],
          }
        `)
        expect(context.maxHeight).toEqual(1920)
      })
    })

    describe('headerHeight', () => {
      test('SET_HEADER_HEIGHT', () => {
        const { context } = BottomSheetMachine.transition(openingState.value, {
          type: 'SET_HEADER_HEIGHT',
          payload: { headerHeight: 200 },
        })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": null,
            "footerHeight": null,
            "headerHeight": 200,
            "height": 0,
            "initialHeight": 0,
            "lastHeight": null,
            "maxContent": 0,
            "maxHeight": 0,
            "minContent": 0,
            "snapPoints": Array [],
          }
        `)
        expect(context.headerHeight).toEqual(200)
      })
    })

    describe('contentHeight', () => {
      test('SET_CONTENT_HEIGHT', () => {
        const { context } = BottomSheetMachine.transition(openingState.value, {
          type: 'SET_CONTENT_HEIGHT',
          payload: { contentHeight: 200 },
        })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 200,
            "footerHeight": null,
            "headerHeight": null,
            "height": 0,
            "initialHeight": 0,
            "lastHeight": null,
            "maxContent": 0,
            "maxHeight": 0,
            "minContent": 0,
            "snapPoints": Array [],
          }
        `)
        expect(context.contentHeight).toEqual(200)
      })
    })

    describe('footerHeight', () => {
      test('SET_FOOTER_HEIGHT', () => {
        const { context } = BottomSheetMachine.transition(openingState.value, {
          type: 'SET_FOOTER_HEIGHT',
          payload: { footerHeight: 200 },
        })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": null,
            "footerHeight": 200,
            "headerHeight": null,
            "height": 0,
            "initialHeight": 0,
            "lastHeight": null,
            "maxContent": 0,
            "maxHeight": 0,
            "minContent": 0,
            "snapPoints": Array [],
          }
        `)
        expect(context.footerHeight).toEqual(200)
      })
    })

    describe('minContent', () => {
      describe('OPEN', () => {
        test('Never larger than maxHeight', () => {
          const { context } = BottomSheetMachine.withContext({
            ...openingState.context,
            maxHeight: 1,
            minContent: 1920,
          }).transition(BottomSheetMachine.initialState.value, { type: 'OPEN' })
          expect(context).toMatchInlineSnapshot(`
            Object {
              "contentHeight": null,
              "footerHeight": null,
              "headerHeight": null,
              "height": 0,
              "initialHeight": 1,
              "lastHeight": null,
              "maxContent": 1,
              "maxHeight": 1,
              "minContent": 1,
              "snapPoints": Array [
                1,
              ],
            }
          `)
          expect(context.minContent).toEqual(1)
        })

        test('Never smaller than 50', () => {
          const { context } = BottomSheetMachine.withContext({
            ...openingState.context,
            maxHeight: 1920,
            minContent: 0,
          }).transition(BottomSheetMachine.initialState.value, { type: 'OPEN' })
          expect(context).toMatchInlineSnapshot(`
            Object {
              "contentHeight": null,
              "footerHeight": null,
              "headerHeight": null,
              "height": 0,
              "initialHeight": 50,
              "lastHeight": null,
              "maxContent": 50,
              "maxHeight": 1920,
              "minContent": 50,
              "snapPoints": Array [
                50,
              ],
            }
          `)
          expect(context.minContent).toEqual(50)
        })

        test('Includes headerHeight', () => {
          const { context } = BottomSheetMachine.withContext({
            ...openingState.context,
            maxHeight: 1920,
            minContent: 0,
            headerHeight: 128,
          }).transition(BottomSheetMachine.initialState.value, { type: 'OPEN' })
          expect(context).toMatchInlineSnapshot(`
            Object {
              "contentHeight": null,
              "footerHeight": null,
              "headerHeight": 128,
              "height": 0,
              "initialHeight": 128,
              "lastHeight": null,
              "maxContent": 128,
              "maxHeight": 1920,
              "minContent": 128,
              "snapPoints": Array [
                128,
              ],
            }
          `)
          expect(context.minContent).toEqual(128)
        })

        test('Includes footerHeight', () => {
          const { context } = BottomSheetMachine.withContext({
            ...openingState.context,
            maxHeight: 1920,
            minContent: 0,
            headerHeight: 128,
            footerHeight: 256,
          }).transition(BottomSheetMachine.initialState.value, { type: 'OPEN' })
          expect(context).toMatchInlineSnapshot(`
            Object {
              "contentHeight": null,
              "footerHeight": 256,
              "headerHeight": 128,
              "height": 0,
              "initialHeight": 384,
              "lastHeight": null,
              "maxContent": 384,
              "maxHeight": 1920,
              "minContent": 384,
              "snapPoints": Array [
                384,
              ],
            }
          `)
          expect(context.minContent).toEqual(384)
        })
      })

      const testMachine = BottomSheetMachine.withContext({
        ...openingState.context,
        maxHeight: 256,
        headerHeight: 128,
        footerHeight: 128,
      })

      test('SET_MAX_HEIGHT', () => {
        const { context: context1 } = testMachine.transition(
          BottomSheetMachine.initialState.value,
          { type: 'SET_MAX_HEIGHT', payload: { maxHeight: 128 } }
        )
        expect(context1).toMatchInlineSnapshot(`
          Object {
            "contentHeight": null,
            "footerHeight": 128,
            "headerHeight": 128,
            "height": 0,
            "initialHeight": 128,
            "lastHeight": null,
            "maxContent": 128,
            "maxHeight": 128,
            "minContent": 128,
            "snapPoints": Array [
              128,
            ],
          }
        `)
        expect(context1.minContent).toEqual(128)

        const { context: context2 } = testMachine.transition(
          BottomSheetMachine.initialState.value,
          { type: 'SET_MAX_HEIGHT', payload: { maxHeight: 256 } }
        )
        expect(context2).toMatchInlineSnapshot(`
          Object {
            "contentHeight": null,
            "footerHeight": 128,
            "headerHeight": 128,
            "height": 0,
            "initialHeight": 256,
            "lastHeight": null,
            "maxContent": 256,
            "maxHeight": 256,
            "minContent": 256,
            "snapPoints": Array [
              256,
            ],
          }
        `)
        expect(context2.minContent).toEqual(256)
      })

      test('SET_HEADER_HEIGHT', () => {
        const { context: context1 } = testMachine.transition(
          BottomSheetMachine.initialState.value,
          { type: 'SET_HEADER_HEIGHT', payload: { headerHeight: 64 } }
        )
        expect(context1).toMatchInlineSnapshot(`
          Object {
            "contentHeight": null,
            "footerHeight": 128,
            "headerHeight": 64,
            "height": 0,
            "initialHeight": 192,
            "lastHeight": null,
            "maxContent": 192,
            "maxHeight": 256,
            "minContent": 192,
            "snapPoints": Array [
              192,
            ],
          }
        `)
        expect(context1.minContent).toEqual(192)

        const { context: context2 } = testMachine.transition(
          BottomSheetMachine.initialState.value,
          { type: 'SET_HEADER_HEIGHT', payload: { headerHeight: 128 } }
        )
        expect(context2).toMatchInlineSnapshot(`
          Object {
            "contentHeight": null,
            "footerHeight": 128,
            "headerHeight": 128,
            "height": 0,
            "initialHeight": 256,
            "lastHeight": null,
            "maxContent": 256,
            "maxHeight": 256,
            "minContent": 256,
            "snapPoints": Array [
              256,
            ],
          }
        `)
        expect(context2.minContent).toEqual(256)
      })

      test('SET_FOOTER_HEIGHT', () => {
        const { context: context1 } = testMachine.transition(
          BottomSheetMachine.initialState.value,
          { type: 'SET_FOOTER_HEIGHT', payload: { footerHeight: 64 } }
        )
        expect(context1).toMatchInlineSnapshot(`
          Object {
            "contentHeight": null,
            "footerHeight": 64,
            "headerHeight": 128,
            "height": 0,
            "initialHeight": 192,
            "lastHeight": null,
            "maxContent": 192,
            "maxHeight": 256,
            "minContent": 192,
            "snapPoints": Array [
              192,
            ],
          }
        `)
        expect(context1.minContent).toEqual(192)

        const { context: context2 } = testMachine.transition(
          BottomSheetMachine.initialState.value,
          { type: 'SET_FOOTER_HEIGHT', payload: { footerHeight: 128 } }
        )
        expect(context2).toMatchInlineSnapshot(`
          Object {
            "contentHeight": null,
            "footerHeight": 128,
            "headerHeight": 128,
            "height": 0,
            "initialHeight": 256,
            "lastHeight": null,
            "maxContent": 256,
            "maxHeight": 256,
            "minContent": 256,
            "snapPoints": Array [
              256,
            ],
          }
        `)
        expect(context2.minContent).toEqual(256)
      })
    })

    describe('maxContent', () => {
      describe('OPEN', () => {
        test('Never larger than maxHeight', () => {
          const { context } = BottomSheetMachine.withContext({
            ...openingState.context,
            maxHeight: 1,
            headerHeight: 1920,
            contentHeight: 1920,
            footerHeight: 1920,
          }).transition(BottomSheetMachine.initialState.value, { type: 'OPEN' })
          expect(context).toMatchInlineSnapshot(`
            Object {
              "contentHeight": 1920,
              "footerHeight": 1920,
              "headerHeight": 1920,
              "height": 0,
              "initialHeight": 1,
              "lastHeight": null,
              "maxContent": 1,
              "maxHeight": 1,
              "minContent": 1,
              "snapPoints": Array [
                1,
              ],
            }
          `)
          expect(context.maxContent).toEqual(1)
        })

        test('Never smaller than 0', () => {
          const { context } = BottomSheetMachine.withContext({
            ...openingState.context,
            maxHeight: 1920,
            maxContent: -1920,
          }).transition(BottomSheetMachine.initialState.value, { type: 'OPEN' })
          expect(context).toMatchInlineSnapshot(`
            Object {
              "contentHeight": null,
              "footerHeight": null,
              "headerHeight": null,
              "height": 0,
              "initialHeight": 50,
              "lastHeight": null,
              "maxContent": 50,
              "maxHeight": 1920,
              "minContent": 50,
              "snapPoints": Array [
                50,
              ],
            }
          `)
          expect(context.maxContent).toBeGreaterThanOrEqual(0)
        })

        test('Never smaller than minContent', () => {
          const { context } = BottomSheetMachine.withContext({
            ...openingState.context,
            maxHeight: 1920,
          }).transition(BottomSheetMachine.initialState.value, { type: 'OPEN' })
          expect(context).toMatchInlineSnapshot(`
            Object {
              "contentHeight": null,
              "footerHeight": null,
              "headerHeight": null,
              "height": 0,
              "initialHeight": 50,
              "lastHeight": null,
              "maxContent": 50,
              "maxHeight": 1920,
              "minContent": 50,
              "snapPoints": Array [
                50,
              ],
            }
          `)
          expect(context.maxContent).toBeGreaterThanOrEqual(context.minContent)
        })

        test('Includes headerHeight', () => {
          const { context } = BottomSheetMachine.withContext({
            ...openingState.context,
            maxHeight: 1920,
            maxContent: 0,
            headerHeight: 128,
          }).transition(BottomSheetMachine.initialState.value, { type: 'OPEN' })
          expect(context).toMatchInlineSnapshot(`
            Object {
              "contentHeight": null,
              "footerHeight": null,
              "headerHeight": 128,
              "height": 0,
              "initialHeight": 128,
              "lastHeight": null,
              "maxContent": 128,
              "maxHeight": 1920,
              "minContent": 128,
              "snapPoints": Array [
                128,
              ],
            }
          `)
          expect(context.maxContent).toEqual(128)
        })

        test('Includes footerHeight', () => {
          const { context } = BottomSheetMachine.withContext({
            ...openingState.context,
            maxHeight: 1920,
            maxContent: 0,
            headerHeight: 128,
            footerHeight: 256,
          }).transition(BottomSheetMachine.initialState.value, { type: 'OPEN' })
          expect(context).toMatchInlineSnapshot(`
            Object {
              "contentHeight": null,
              "footerHeight": 256,
              "headerHeight": 128,
              "height": 0,
              "initialHeight": 384,
              "lastHeight": null,
              "maxContent": 384,
              "maxHeight": 1920,
              "minContent": 384,
              "snapPoints": Array [
                384,
              ],
            }
          `)
          expect(context.maxContent).toEqual(384)
        })

        test('Includes contentHeight', () => {
          const { context } = BottomSheetMachine.withContext({
            ...openingState.context,
            maxHeight: 1920,
            maxContent: 0,
            headerHeight: 128,
            footerHeight: 256,
            contentHeight: 512,
          }).transition(BottomSheetMachine.initialState.value, { type: 'OPEN' })
          expect(context).toMatchInlineSnapshot(`
            Object {
              "contentHeight": 512,
              "footerHeight": 256,
              "headerHeight": 128,
              "height": 0,
              "initialHeight": 896,
              "lastHeight": null,
              "maxContent": 896,
              "maxHeight": 1920,
              "minContent": 384,
              "snapPoints": Array [
                896,
              ],
            }
          `)
          expect(context.maxContent).toEqual(896)
        })
      })

      const testMachine = BottomSheetMachine.withContext({
        ...openingState.context,
        maxHeight: 384,
        headerHeight: 128,
        contentHeight: 128,
        footerHeight: 128,
      })

      test('SET_MAX_HEIGHT', () => {
        const { context: context1 } = testMachine.transition(
          BottomSheetMachine.initialState.value,
          { type: 'SET_MAX_HEIGHT', payload: { maxHeight: 128 } }
        )
        expect(context1).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 128,
            "headerHeight": 128,
            "height": 0,
            "initialHeight": 128,
            "lastHeight": null,
            "maxContent": 128,
            "maxHeight": 128,
            "minContent": 128,
            "snapPoints": Array [
              128,
            ],
          }
        `)
        expect(context1.maxContent).toEqual(128)

        const { context: context2 } = testMachine.transition(
          BottomSheetMachine.initialState.value,
          { type: 'SET_MAX_HEIGHT', payload: { maxHeight: 256 } }
        )
        expect(context2).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 128,
            "headerHeight": 128,
            "height": 0,
            "initialHeight": 256,
            "lastHeight": null,
            "maxContent": 256,
            "maxHeight": 256,
            "minContent": 256,
            "snapPoints": Array [
              256,
            ],
          }
        `)
        expect(context2.maxContent).toEqual(256)
      })

      test('SET_HEADER_HEIGHT', () => {
        const { context: context1 } = testMachine.transition(
          BottomSheetMachine.initialState.value,
          { type: 'SET_HEADER_HEIGHT', payload: { headerHeight: 64 } }
        )
        expect(context1).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 128,
            "headerHeight": 64,
            "height": 0,
            "initialHeight": 320,
            "lastHeight": null,
            "maxContent": 320,
            "maxHeight": 384,
            "minContent": 192,
            "snapPoints": Array [
              320,
            ],
          }
        `)
        expect(context1.maxContent).toEqual(320)

        const { context: context2 } = testMachine.transition(
          BottomSheetMachine.initialState.value,
          { type: 'SET_HEADER_HEIGHT', payload: { headerHeight: 128 } }
        )
        expect(context2).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 128,
            "headerHeight": 128,
            "height": 0,
            "initialHeight": 384,
            "lastHeight": null,
            "maxContent": 384,
            "maxHeight": 384,
            "minContent": 256,
            "snapPoints": Array [
              384,
            ],
          }
        `)
        expect(context2.maxContent).toEqual(384)
      })

      test('SET_CONTENT_HEIGHT', () => {
        const { context: context1 } = testMachine.transition(
          BottomSheetMachine.initialState.value,
          { type: 'SET_CONTENT_HEIGHT', payload: { contentHeight: 64 } }
        )
        expect(context1).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 64,
            "footerHeight": 128,
            "headerHeight": 128,
            "height": 0,
            "initialHeight": 320,
            "lastHeight": null,
            "maxContent": 320,
            "maxHeight": 384,
            "minContent": 0,
            "snapPoints": Array [
              320,
            ],
          }
        `)
        expect(context1.maxContent).toEqual(320)

        const { context: context2 } = testMachine.transition(
          BottomSheetMachine.initialState.value,
          { type: 'SET_CONTENT_HEIGHT', payload: { contentHeight: 128 } }
        )
        expect(context2).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 128,
            "headerHeight": 128,
            "height": 0,
            "initialHeight": 384,
            "lastHeight": null,
            "maxContent": 384,
            "maxHeight": 384,
            "minContent": 0,
            "snapPoints": Array [
              384,
            ],
          }
        `)
        expect(context2.maxContent).toEqual(384)
      })

      test('SET_FOOTER_HEIGHT', () => {
        const { context: context1 } = testMachine.transition(
          BottomSheetMachine.initialState.value,
          { type: 'SET_FOOTER_HEIGHT', payload: { footerHeight: 64 } }
        )
        expect(context1).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 64,
            "headerHeight": 128,
            "height": 0,
            "initialHeight": 320,
            "lastHeight": null,
            "maxContent": 320,
            "maxHeight": 384,
            "minContent": 192,
            "snapPoints": Array [
              320,
            ],
          }
        `)
        expect(context1.maxContent).toEqual(320)

        const { context: context2 } = testMachine.transition(
          BottomSheetMachine.initialState.value,
          { type: 'SET_FOOTER_HEIGHT', payload: { footerHeight: 128 } }
        )
        expect(context2).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 128,
            "headerHeight": 128,
            "height": 0,
            "initialHeight": 384,
            "lastHeight": null,
            "maxContent": 384,
            "maxHeight": 384,
            "minContent": 256,
            "snapPoints": Array [
              384,
            ],
          }
        `)
        expect(context2.maxContent).toEqual(384)
      })
    })

    describe('snapPoints', () => {
      test('OPEN initial snapshot', () => {
        const { context } = BottomSheetMachine.withContext({
          ...openingState.context,
          maxHeight: 384,
          headerHeight: 128,
          contentHeight: 128,
          footerHeight: 128,
        }).transition(BottomSheetMachine.initialState.value, { type: 'OPEN' })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 128,
            "headerHeight": 128,
            "height": 0,
            "initialHeight": 384,
            "lastHeight": null,
            "maxContent": 384,
            "maxHeight": 384,
            "minContent": 256,
            "snapPoints": Array [
              384,
            ],
          }
        `)
        expect(context.snapPoints).toMatchInlineSnapshot(`
          Array [
            384,
          ]
        `)
      })

      const testMachine = BottomSheetMachine.withContext({
        ...openingState.context,
        maxHeight: 256,
        headerHeight: 8,
        contentHeight: 32,
        footerHeight: 16,
      })

      test('OPEN [headerHeight, contentHeight, footerHeight, minContent, maxContent, maxHeight]', () => {
        const { context } = testMachine
          .withConfig({
            actions: {
              setSnapPoints: assignSnapPoints(
                ({
                  headerHeight,
                  contentHeight,
                  footerHeight,
                  minContent,
                  maxContent,
                  maxHeight,
                }) => [
                  headerHeight,
                  contentHeight,
                  footerHeight,
                  minContent,
                  maxContent,
                  maxHeight,
                ]
              ),
            },
          })
          .transition(testMachine.initialState.value, { type: 'OPEN' })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 32,
            "footerHeight": 16,
            "headerHeight": 8,
            "height": 0,
            "initialHeight": 56,
            "lastHeight": null,
            "maxContent": 56,
            "maxHeight": 256,
            "minContent": 50,
            "snapPoints": Array [
              8,
              16,
              32,
              50,
              56,
              256,
            ],
          }
        `)
        expect(context.snapPoints).toEqual([8, 16, 32, 50, 56, 256])
      })

      test('SET_HEADER_HEIGHT', () => {
        const { context } = testMachine
          .withConfig({
            actions: {
              setSnapPoints: assignSnapPoints(
                ({ headerHeight }) => headerHeight
              ),
            },
          })
          .transition(testMachine.initialState.value, {
            type: 'SET_HEADER_HEIGHT',
            payload: { headerHeight: 128 },
          })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 32,
            "footerHeight": 16,
            "headerHeight": 128,
            "height": 0,
            "initialHeight": 128,
            "lastHeight": null,
            "maxContent": 176,
            "maxHeight": 256,
            "minContent": 144,
            "snapPoints": Array [
              128,
            ],
          }
        `)
        expect(context.snapPoints).toEqual([128])
      })

      test('SET_CONTENT_HEIGHT', () => {
        const { context } = testMachine
          .withConfig({
            actions: {
              setSnapPoints: assignSnapPoints(
                ({ contentHeight }) => contentHeight
              ),
            },
          })
          .transition(testMachine.initialState.value, {
            type: 'SET_CONTENT_HEIGHT',
            payload: { contentHeight: 128 },
          })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 16,
            "headerHeight": 8,
            "height": 0,
            "initialHeight": 128,
            "lastHeight": null,
            "maxContent": 152,
            "maxHeight": 256,
            "minContent": 0,
            "snapPoints": Array [
              128,
            ],
          }
        `)
        expect(context.snapPoints).toEqual([128])
      })

      test('SET_FOOTER_HEIGHT', () => {
        const { context } = testMachine
          .withConfig({
            actions: {
              setSnapPoints: assignSnapPoints(
                ({ footerHeight }) => footerHeight
              ),
            },
          })
          .transition(testMachine.initialState.value, {
            type: 'SET_FOOTER_HEIGHT',
            payload: { footerHeight: 128 },
          })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 32,
            "footerHeight": 128,
            "headerHeight": 8,
            "height": 0,
            "initialHeight": 128,
            "lastHeight": null,
            "maxContent": 168,
            "maxHeight": 256,
            "minContent": 136,
            "snapPoints": Array [
              128,
            ],
          }
        `)
        expect(context.snapPoints).toEqual([128])
      })

      test('SET_MAX_HEIGHT', () => {
        const { context } = testMachine
          .withConfig({
            actions: {
              setSnapPoints: assignSnapPoints(({ maxHeight }) => maxHeight),
            },
          })
          .transition(testMachine.initialState.value, {
            type: 'SET_MAX_HEIGHT',
            payload: { maxHeight: 128 },
          })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 32,
            "footerHeight": 16,
            "headerHeight": 8,
            "height": 0,
            "initialHeight": 128,
            "lastHeight": null,
            "maxContent": 56,
            "maxHeight": 128,
            "minContent": 50,
            "snapPoints": Array [
              128,
            ],
          }
        `)
        expect(context.snapPoints).toEqual([128])
      })
    })

    describe('initialHeight', () => {
      test('OPEN initial snapshot', () => {
        const { context } = BottomSheetMachine.withContext({
          ...openingState.context,
          maxHeight: 512,
          headerHeight: 128,
          contentHeight: 128,
          footerHeight: 128,
        }).transition(BottomSheetMachine.initialState.value, { type: 'OPEN' })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 128,
            "headerHeight": 128,
            "height": 0,
            "initialHeight": 384,
            "lastHeight": null,
            "maxContent": 384,
            "maxHeight": 512,
            "minContent": 256,
            "snapPoints": Array [
              384,
            ],
          }
        `)
        expect(context.initialHeight).toMatchInlineSnapshot(`384`)
      })

      test('lastHeight', () => {
        const { context } = BottomSheetMachine.withContext({
          ...openingState.context,
          maxHeight: 256,
          contentHeight: 256,
          lastHeight: 256,
        }).transition(BottomSheetMachine.initialState.value, { type: 'OPEN' })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 256,
            "footerHeight": null,
            "headerHeight": null,
            "height": 0,
            "initialHeight": 256,
            "lastHeight": 256,
            "maxContent": 256,
            "maxHeight": 256,
            "minContent": 50,
            "snapPoints": Array [
              256,
            ],
          }
        `)
        expect(context.initialHeight).toBe(256)
      })

      test('maxHeight', () => {
        const { context } = BottomSheetMachine.withContext({
          ...openingState.context,
          maxHeight: 256,
          contentHeight: 256,
        })
          .withConfig({
            actions: {
              setInitialHeight: assignInitialHeight(
                ({ maxHeight }) => maxHeight
              ),
            },
          })
          .transition(BottomSheetMachine.initialState.value, { type: 'OPEN' })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 256,
            "footerHeight": null,
            "headerHeight": null,
            "height": 0,
            "initialHeight": 256,
            "lastHeight": null,
            "maxContent": 256,
            "maxHeight": 256,
            "minContent": 50,
            "snapPoints": Array [
              256,
            ],
          }
        `)
        expect(context.initialHeight).toEqual(256)
      })

      test('headerHeight', () => {
        const { context } = BottomSheetMachine.withContext({
          ...openingState.context,
          maxHeight: 256,
          headerHeight: 256,
        })
          .withConfig({
            actions: {
              setInitialHeight: assignInitialHeight(
                ({ headerHeight }) => headerHeight
              ),
            },
          })
          .transition(BottomSheetMachine.initialState.value, { type: 'OPEN' })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": null,
            "footerHeight": null,
            "headerHeight": 256,
            "height": 0,
            "initialHeight": 256,
            "lastHeight": null,
            "maxContent": 256,
            "maxHeight": 256,
            "minContent": 256,
            "snapPoints": Array [
              256,
            ],
          }
        `)
        expect(context.initialHeight).toEqual(256)
      })

      test('contentHeight', () => {
        const { context } = BottomSheetMachine.withContext({
          ...openingState.context,
          maxHeight: 256,
          contentHeight: 256,
        })
          .withConfig({
            actions: {
              setInitialHeight: assignInitialHeight(
                ({ contentHeight }) => contentHeight
              ),
            },
          })
          .transition(BottomSheetMachine.initialState.value, { type: 'OPEN' })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 256,
            "footerHeight": null,
            "headerHeight": null,
            "height": 0,
            "initialHeight": 256,
            "lastHeight": null,
            "maxContent": 256,
            "maxHeight": 256,
            "minContent": 50,
            "snapPoints": Array [
              256,
            ],
          }
        `)
        expect(context.initialHeight).toEqual(256)
      })

      test('footerHeight', () => {
        const { context } = BottomSheetMachine.withContext({
          ...openingState.context,
          maxHeight: 256,
          footerHeight: 256,
        })
          .withConfig({
            actions: {
              setInitialHeight: assignInitialHeight(
                ({ footerHeight }) => footerHeight
              ),
            },
          })
          .transition(BottomSheetMachine.initialState.value, { type: 'OPEN' })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": null,
            "footerHeight": 256,
            "headerHeight": null,
            "height": 0,
            "initialHeight": 256,
            "lastHeight": null,
            "maxContent": 256,
            "maxHeight": 256,
            "minContent": 256,
            "snapPoints": Array [
              256,
            ],
          }
        `)
        expect(context.initialHeight).toEqual(256)
      })

      test('minContent', () => {
        const { context } = BottomSheetMachine.withContext({
          ...openingState.context,
          maxHeight: 256,
          headerHeight: 256,
        })
          .withConfig({
            actions: {
              setInitialHeight: assignInitialHeight(
                ({ minContent }) => minContent
              ),
            },
          })
          .transition(BottomSheetMachine.initialState.value, { type: 'OPEN' })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": null,
            "footerHeight": null,
            "headerHeight": 256,
            "height": 0,
            "initialHeight": 256,
            "lastHeight": null,
            "maxContent": 256,
            "maxHeight": 256,
            "minContent": 256,
            "snapPoints": Array [
              256,
            ],
          }
        `)
        expect(context.initialHeight).toEqual(256)
      })

      test('maxContent', () => {
        const { context } = BottomSheetMachine.withContext({
          ...openingState.context,
          maxHeight: 256,
          contentHeight: 256,
        })
          .withConfig({
            actions: {
              setInitialHeight: assignInitialHeight(
                ({ maxContent }) => maxContent
              ),
            },
          })
          .transition(BottomSheetMachine.initialState.value, { type: 'OPEN' })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 256,
            "footerHeight": null,
            "headerHeight": null,
            "height": 0,
            "initialHeight": 256,
            "lastHeight": null,
            "maxContent": 256,
            "maxHeight": 256,
            "minContent": 50,
            "snapPoints": Array [
              256,
            ],
          }
        `)
        expect(context.initialHeight).toEqual(256)
      })

      test('snapPoints', () => {
        const { context } = BottomSheetMachine.withContext({
          ...openingState.context,
          maxHeight: 256,
          contentHeight: 256,
        })
          .withConfig({
            actions: {
              setInitialHeight: assignInitialHeight(
                ({ snapPoints }) => snapPoints[0]
              ),
            },
          })
          .transition(BottomSheetMachine.initialState.value, { type: 'OPEN' })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 256,
            "footerHeight": null,
            "headerHeight": null,
            "height": 0,
            "initialHeight": 256,
            "lastHeight": null,
            "maxContent": 256,
            "maxHeight": 256,
            "minContent": 50,
            "snapPoints": Array [
              256,
            ],
          }
        `)
        expect(context.initialHeight).toEqual(256)
      })

      const testMachine = BottomSheetMachine.withContext({
        ...openingState.context,
        maxHeight: 256,
        headerHeight: 8,
        contentHeight: 32,
        footerHeight: 16,
      }).withConfig({
        actions: {
          setSnapPoints: assignSnapPoints(
            ({
              maxHeight,
              headerHeight,
              contentHeight,
              footerHeight,
              minContent,
              maxContent,
            }) => [
              maxHeight,
              headerHeight,
              contentHeight,
              footerHeight,
              minContent,
              maxContent,
            ]
          ),
        },
      })

      test('SET_HEADER_HEIGHT', () => {
        const { context } = testMachine
          .withConfig({
            actions: {
              setInitialHeight: assignInitialHeight(
                ({ headerHeight }) => headerHeight
              ),
            },
          })
          .transition(testMachine.initialState.value, {
            type: 'SET_HEADER_HEIGHT',
            payload: { headerHeight: 128 },
          })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 32,
            "footerHeight": 16,
            "headerHeight": 128,
            "height": 0,
            "initialHeight": 128,
            "lastHeight": null,
            "maxContent": 176,
            "maxHeight": 256,
            "minContent": 144,
            "snapPoints": Array [
              16,
              32,
              128,
              144,
              176,
              256,
            ],
          }
        `)
        expect(context.initialHeight).toEqual(128)
      })

      test('SET_CONTENT_HEIGHT', () => {
        const { context } = testMachine
          .withConfig({
            actions: {
              setInitialHeight: assignInitialHeight(
                ({ contentHeight }) => contentHeight
              ),
            },
          })
          .transition(testMachine.initialState.value, {
            type: 'SET_CONTENT_HEIGHT',
            payload: { contentHeight: 128 },
          })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 16,
            "headerHeight": 8,
            "height": 0,
            "initialHeight": 128,
            "lastHeight": null,
            "maxContent": 152,
            "maxHeight": 256,
            "minContent": 0,
            "snapPoints": Array [
              8,
              16,
              128,
              152,
              256,
            ],
          }
        `)
        expect(context.initialHeight).toEqual(128)
      })

      test('SET_FOOTER_HEIGHT', () => {
        const { context } = testMachine
          .withConfig({
            actions: {
              setInitialHeight: assignInitialHeight(
                ({ footerHeight }) => footerHeight
              ),
            },
          })
          .transition(testMachine.initialState.value, {
            type: 'SET_FOOTER_HEIGHT',
            payload: { footerHeight: 128 },
          })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 32,
            "footerHeight": 128,
            "headerHeight": 8,
            "height": 0,
            "initialHeight": 128,
            "lastHeight": null,
            "maxContent": 168,
            "maxHeight": 256,
            "minContent": 136,
            "snapPoints": Array [
              8,
              32,
              128,
              136,
              168,
              256,
            ],
          }
        `)
        expect(context.initialHeight).toEqual(128)
      })

      test('SET_MAX_HEIGHT', () => {
        const { context } = testMachine
          .withConfig({
            actions: {
              setInitialHeight: assignInitialHeight(
                ({ maxHeight }) => maxHeight
              ),
            },
          })
          .transition(testMachine.initialState.value, {
            type: 'SET_MAX_HEIGHT',
            payload: { maxHeight: 128 },
          })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 32,
            "footerHeight": 16,
            "headerHeight": 8,
            "height": 0,
            "initialHeight": 128,
            "lastHeight": null,
            "maxContent": 56,
            "maxHeight": 128,
            "minContent": 50,
            "snapPoints": Array [
              8,
              16,
              32,
              50,
              56,
              128,
            ],
          }
        `)
        expect(context.initialHeight).toEqual(128)
      })
    })

    describe('height', () => {
      const testMachine = BottomSheetMachine.withContext({
        ...openingState.context,
        maxHeight: 512,
        headerHeight: 128,
        contentHeight: 128,
        footerHeight: 128,
        initialHeight: 384,
        snapPoints: [256],
      }).withConfig({
        actions: {
          setSnapPoints: assignSnapPoints(({ maxContent }) => [
            maxContent,
            256,
          ]),
        },
      })

      // reads from initialHeight and snapPoints
      // recalc when snapPoints changes
      test('Reads initialHeight on opening.waiting.leave', () => {
        const { context } = testMachine.transition(openingState.value, {
          type: 'TRANSITION_OPEN',
        })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 128,
            "headerHeight": 128,
            "height": 384,
            "initialHeight": 384,
            "lastHeight": null,
            "maxContent": 0,
            "maxHeight": 512,
            "minContent": 0,
            "snapPoints": Array [
              256,
            ],
          }
        `)
        expect(context.height).toBe(context.initialHeight)
        expect(context.height).toMatchInlineSnapshot(`384`)
      })

      test.todo('Reads initialHeight on open.initially.leave')

      test('zero when closing', () => {
        const { context } = testMachine
          .withContext({
            ...testMachine.context,
            height: 384,
          })
          .transition({ open: 'resting' }, { type: 'CLOSE' })
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 128,
            "headerHeight": 128,
            "height": 0,
            "initialHeight": 384,
            "lastHeight": null,
            "maxContent": 0,
            "maxHeight": 512,
            "minContent": 0,
            "snapPoints": Array [
              256,
            ],
          }
        `)
        expect(context.height).toBe(0)
      })

      test('RESIZE', () => {
        const { context } = testMachine
          .withContext({
            ...testMachine.context,
            height: 384,
          })
          .transition(
            { open: 'resting' },
            { type: 'RESIZE', payload: { height: 256 } }
          )
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 128,
            "headerHeight": 128,
            "height": 256,
            "initialHeight": 384,
            "lastHeight": null,
            "maxContent": 0,
            "maxHeight": 512,
            "minContent": 0,
            "snapPoints": Array [
              256,
            ],
          }
        `)
        expect(context.height).toBe(256)
      })

      test('Adjusts height to the nearest snap point', () => {
        const { context } = testMachine
          .withContext({
            ...testMachine.context,
            height: 384,
          })
          .transition(
            { open: 'resting' },
            { type: 'RESIZE', payload: { height: 224 } }
          )
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 128,
            "headerHeight": 128,
            "height": 256,
            "initialHeight": 384,
            "lastHeight": null,
            "maxContent": 0,
            "maxHeight": 512,
            "minContent": 0,
            "snapPoints": Array [
              256,
            ],
          }
        `)
        expect(context.height).not.toBe(224)
      })

      test('DRAG', () => {
        const { context } = testMachine
          .withContext({
            ...testMachine.context,
            height: 384,
          })
          .transition(
            { open: { dragging: 'gesture' } },
            { type: 'TRANSITION_DRAG', payload: { height: 256 } }
          )
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 128,
            "headerHeight": 128,
            "height": 256,
            "initialHeight": 384,
            "lastHeight": null,
            "maxContent": 0,
            "maxHeight": 512,
            "minContent": 0,
            "snapPoints": Array [
              256,
            ],
          }
        `)
        expect(context.height).toBe(256)
      })

      test('SNAP', () => {
        const { context } = testMachine
          .withContext({
            ...testMachine.context,
            height: 384,
          })
          .transition(
            { open: 'resting' },
            { type: 'SNAP', payload: { height: 256 } }
          )
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 128,
            "headerHeight": 128,
            "height": 256,
            "initialHeight": 384,
            "lastHeight": null,
            "maxContent": 0,
            "maxHeight": 512,
            "minContent": 0,
            "snapPoints": Array [
              256,
            ],
          }
        `)
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 128,
            "headerHeight": 128,
            "height": 256,
            "initialHeight": 384,
            "lastHeight": null,
            "maxContent": 0,
            "maxHeight": 512,
            "minContent": 0,
            "snapPoints": Array [
              256,
            ],
          }
        `)
        expect(context.height).toBe(256)
      })
    })

    describe('lastHeight', () => {
      // @TODO: The last snap point the sheet was rendered in, or null if it haven't been opened yet. DRAG, OPEN, RESIZE, SNAP writes to this value, its purpose is to allow userland initialHeight to restore the previous height.
      const testMachine = BottomSheetMachine.withContext({
        ...openingState.context,
        maxHeight: 512,
        headerHeight: 64,
        contentHeight: 128,
        footerHeight: 64,
        height: 256,
        initialHeight: 256,
        snapPoints: [256, 512],
      }).withConfig({
        actions: {
          setSnapPoints: assignSnapPoints(({ maxContent }) => [
            maxContent,
            512,
          ]),
        },
      })

      test('initial', () => {
        const { context } = testMachine.transition(
          BottomSheetMachine.initialState.value,
          { type: 'OPEN' }
        )
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 64,
            "headerHeight": 64,
            "height": 256,
            "initialHeight": 256,
            "lastHeight": null,
            "maxContent": 256,
            "maxHeight": 512,
            "minContent": 128,
            "snapPoints": Array [
              256,
              512,
            ],
          }
        `)
        expect(context.lastHeight).toBe(null)
      })

      test('open.opening.autofocusing.exit', () => {
        const { context } = testMachine.transition(
          { open: { opening: 'autofocusing' } },
          { type: 'TRANSITION_OPEN' }
        )
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 64,
            "headerHeight": 64,
            "height": 256,
            "initialHeight": 256,
            "lastHeight": 256,
            "maxContent": 0,
            "maxHeight": 512,
            "minContent": 0,
            "snapPoints": Array [
              256,
              512,
            ],
          }
        `)
        expect(context.lastHeight).toBe(256)
      })

      test('open.opening.animating.exit', () => {
        const { context } = testMachine.transition(
          { open: { opening: 'transition' } },
          { type: 'OPENED' }
        )
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 64,
            "headerHeight": 64,
            "height": 256,
            "initialHeight": 256,
            "lastHeight": 256,
            "maxContent": 0,
            "maxHeight": 512,
            "minContent": 0,
            "snapPoints": Array [
              256,
              512,
            ],
          }
        `)
        expect(context.lastHeight).toBe(256)
      })

      test('DRAGGED', () => {
        const { context } = testMachine.transition(
          { open: { dragging: 'transition' } },
          { type: 'DRAGGED' }
        )
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 64,
            "headerHeight": 64,
            "height": 256,
            "initialHeight": 256,
            "lastHeight": 256,
            "maxContent": 0,
            "maxHeight": 512,
            "minContent": 0,
            "snapPoints": Array [
              256,
              512,
            ],
          }
        `)
        expect(context.lastHeight).toBe(256)
      })

      test('RESIZED', () => {
        const { context } = testMachine.transition(
          { open: 'resizing' },
          { type: 'RESIZED' }
        )
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 64,
            "headerHeight": 64,
            "height": 256,
            "initialHeight": 256,
            "lastHeight": 256,
            "maxContent": 0,
            "maxHeight": 512,
            "minContent": 0,
            "snapPoints": Array [
              256,
              512,
            ],
          }
        `)
        expect(context.lastHeight).toBe(256)
      })

      test('SNAPPED', () => {
        const { context } = testMachine.transition(
          { open: 'snapping' },
          { type: 'SNAPPED' }
        )
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 64,
            "headerHeight": 64,
            "height": 256,
            "initialHeight": 256,
            "lastHeight": 256,
            "maxContent": 0,
            "maxHeight": 512,
            "minContent": 0,
            "snapPoints": Array [
              256,
              512,
            ],
          }
        `)
        expect(context.lastHeight).toBe(256)
      })

      test('CLOSED', () => {
        const { context } = testMachine.transition(
          { open: 'closing' },
          { type: 'CLOSED' }
        )
        expect(context).toMatchInlineSnapshot(`
          Object {
            "contentHeight": 128,
            "footerHeight": 64,
            "headerHeight": 64,
            "height": 256,
            "initialHeight": 256,
            "lastHeight": 256,
            "maxContent": 0,
            "maxHeight": 512,
            "minContent": 0,
            "snapPoints": Array [
              256,
              512,
            ],
          }
        `)
        expect(context.lastHeight).toBe(256)
      })
    })
  })

  describe.skip('opening.animating.leave and open.initially.leave is only possible when `snapPoints` are valid', () => {
    // @TODO
  })

  describe.skip('Fire READY/AUTOFOCUS automatically as soon as we have a non-zero `height`', () => {
    // @TODO
  })
})
