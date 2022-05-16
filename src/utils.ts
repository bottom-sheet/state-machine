import type {
  GetSnapPoints,
  GetInitialHeight,
  SnapPoints,
} from '@bottom-sheet/types'
import { assign } from 'xstate'
import type { SheetContext } from '.'
import memoize from 'lodash.memoize'

// Only add the description field in dev mode
export const addDescription = (description: string) =>
  process.env.NODE_ENV !== 'production' ? { description } : {}

export const assignSnapPoints = (getSnapPoints: GetSnapPoints) =>
  assign<SheetContext>({
    snapPoints: ({
      maxHeight,
      headerHeight,
      contentHeight,
      footerHeight,
      minContent,
      maxContent,
    }) =>
      computeSnapPoints(
        getSnapPoints({
          maxHeight,
          headerHeight,
          contentHeight,
          footerHeight,
          minContent,
          maxContent,
        }),
        maxHeight
      ),
  })

export const assignInitialHeight = (getInitialHeight: GetInitialHeight) =>
  assign<SheetContext>({
    initialHeight: ({
      maxHeight,
      headerHeight,
      contentHeight,
      footerHeight,
      minContent,
      maxContent,
      snapPoints,
      lastHeight,
    }) => {
      const [initialHeight] = computeSnapPointBounds(
        getInitialHeight({
          maxHeight,
          headerHeight,
          contentHeight,
          footerHeight,
          minContent,
          maxContent,
          snapPoints,
          lastHeight,
        }),
        snapPoints as SnapPoints
      )
      return initialHeight
    },
  })

export function computeSnapPoints(
  input: number | SnapPoints,
  maxHeight: number
): number[] {
  const snapPoints = [].concat(input)
  const output = new Set<number>()
  for (const snapPoint of snapPoints) {
    if (!Number.isFinite(snapPoint)) {
      continue
    }
    const clamped = clamp(Math.round(snapPoint), 0, maxHeight)
    if (clamped > 0) {
      output.add(clamped)
    }
  }

  return [...output].sort(sortByNumbers)
}

function sortByNumbers(a, b) {
  return a - b
}

function _computeSnapPointBounds(
  unsafeHeight: number,
  snapPoints: SnapPoints
): [nearest: number, lower: number, upper: number] {
  const height = Math.round(unsafeHeight)
  if (!Number.isFinite(height) || height <= 0) {
    return [0, 0, 0]
  }

  const [minSnap] = snapPoints
  const nearest = snapPoints.reduce(
    (prev, curr) =>
      Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev,
    minSnap
  )
  const nearestIndex = snapPoints.indexOf(nearest)
  const lower = snapPoints[Math.max(nearestIndex - 1, 0)]
  const upper = snapPoints[Math.min(nearestIndex + 1, snapPoints.length - 1)]

  return [nearest, lower, upper]
}
export const computeSnapPointBounds = memoize(
  _computeSnapPointBounds,
  (unsafeHeight, snapPoints) => `${unsafeHeight}-${JSON.stringify(snapPoints)}`
)

export function computeMinContent(
  {
    maxHeight,
    headerHeight,
    footerHeight,
  }: Pick<SheetContext, 'maxHeight' | 'headerHeight' | 'footerHeight'>,
  minHeight = 50
) {
  return Math.min(maxHeight, Math.max(headerHeight + footerHeight, minHeight))
}

export function computeMaxContent(
  {
    maxHeight,
    headerHeight,
    contentHeight,
    footerHeight,
  }: Pick<
    SheetContext,
    'maxHeight' | 'headerHeight' | 'contentHeight' | 'footerHeight'
  >,
  minHeight?: number
) {
  return Math.min(
    maxHeight,
    Math.max(
      headerHeight + contentHeight + footerHeight,
      computeMinContent({ maxHeight, headerHeight, footerHeight }, minHeight)
    )
  )
}

// stolen from lodash <3
// @TODO: use lodash.clamp directly
export function clamp(number: number, lower: number, upper: number) {
  number = +number
  lower = +lower
  upper = +upper
  // eslint-disable-next-line no-self-compare
  lower = lower === lower ? lower : 0
  // eslint-disable-next-line no-self-compare
  upper = upper === upper ? upper : 0
  // eslint-disable-next-line no-self-compare
  if (number === number) {
    number = number <= upper ? number : upper
    number = number >= lower ? number : lower
  }
  return number
}

export const defaultSnapPoints: GetSnapPoints = ({ maxContent }) => {
  return maxContent
}

export const defaultInitialHeight: GetInitialHeight = ({
  snapPoints,
  lastHeight,
}) => {
  return lastHeight ?? snapPoints[0]
}