import { useEffect, useState } from 'react'

import { BOARD_SIZE, StoneColor } from './use-game'

export interface IIntersection {
  stone?: StoneColor
  hoshi?: boolean
  ko?: boolean
}

export function useBoard(size: number) {
  const [intersections, setIntersections] = useState<IIntersection[]>(() => {
    const hoshiGap = size < 10 ? 2 : 3
    const result: IIntersection[] = []

    for (let i = 0; i < size * size; i++) {
      const { x, y } = getCoordinatesFromIndex(i)
      const intersection: IIntersection = {}

      if (
        (x === hoshiGap && y === hoshiGap) || // bottom left
        (x === size - hoshiGap - 1 && y === hoshiGap) || // bottom left
        (x === hoshiGap && y === size - hoshiGap - 1) || // top left
        (x === size - hoshiGap - 1 && y === size - hoshiGap - 1) || // top right
        (size % 2 === 1 && x === hoshiGap && y === Math.floor(size / 2)) || // middle left
        (size % 2 === 1 && x === size - hoshiGap - 1 && y === Math.floor(size / 2)) || // middle right
        (size % 2 === 1 && x === Math.floor(size / 2) && y === size - hoshiGap - 1) || // bottom middle
        (size % 2 === 1 && x === Math.floor(size / 2) && y === hoshiGap) || // bottom middle
        (size % 2 === 1 && x === Math.floor(size / 2) && y === Math.floor(size / 2)) // middle middle
      ) {
        intersection.hoshi = true
      }

      result.push(intersection)
    }

    return result
  })
  const [lastPlayedIndex, setLastPlayedIndex] = useState<number>(-1)

  useEffect(() => {
    if (lastPlayedIndex === -1) return

    const { x, y } = getCoordinatesFromIndex(lastPlayedIndex)
    const neighbors = checkStoneNeighbors(x, y).filter(
      (neighbor) => neighbor.color && neighbor.color !== intersections[lastPlayedIndex].stone,
    )

    let allToCapture: Array<{ x: number; y: number }> = []

    for (const neighbor of neighbors) {
      const toCapture = checkCapture(neighbor.x, neighbor.y, neighbor.color, [])

      allToCapture = [...allToCapture, ...toCapture]
    }

    const _intersections = [...intersections]

    for (const elem of allToCapture) {
      _intersections[elem.y * size + elem.x].stone = undefined
    }

    setIntersections(_intersections)
  }, [lastPlayedIndex])

  function getIntersection(x: number, y: number): IIntersection {
    if (x < 0 || x >= size) {
      throw new Error('[getIntersection]: invalid x value.')
    }

    if (y < 0 || y >= size) {
      throw new Error('[getIntersection]: invalid y value.')
    }

    return intersections[y * size + x]
  }

  function addStone(index: number, color: StoneColor) {
    if (index < 0 || index >= size * size) {
      throw new Error('[addStone]: invalid index value.')
    }

    if (intersections[index].stone) {
      throw new Error('[addStone]: this intersection is already filled.')
    }

    const _intersections = [...intersections]

    _intersections[index].stone = color

    setIntersections(_intersections)
  }

  function getCoordinatesFromIndex(index: number): { x: number; y: number } {
    if (index < 0 || index >= size * size) {
      throw new Error('[addStone]: invalid index value.')
    }

    return { x: index % size, y: Math.floor(index / size) }
  }

  function checkCapture(
    x: number,
    y: number,
    color: StoneColor | undefined,
    checked: Array<{ x: number; y: number }>,
  ): Array<{ x: number; y: number }> {
    if (!color) return []

    const neighbors = checkStoneNeighbors(x, y)

    if (neighbors.some((neighbor) => neighbor.color === undefined)) {
      return []
    }

    const alliedNeighbors = neighbors.filter(
      (neighbor) => neighbor.color === color && !checked.some(({ x, y }) => x === neighbor.x && y === neighbor.y),
    )

    if (alliedNeighbors.length === 0) {
      return [...checked, { x, y }]
    }

    let toCapture = [...checked, { x, y }]

    for (const neighbor of alliedNeighbors) {
      toCapture = checkCapture(neighbor.x, neighbor.y, color, toCapture)

      if (toCapture.length === 0) break
    }

    return toCapture
  }

  function checkStoneNeighbors(x: number, y: number): Array<{ x: number; y: number; color?: StoneColor }> {
    if (x < 0 || x >= size) {
      throw new Error('[checkStoneNeighbors]: invalid x value.')
    }

    if (y < 0 || y >= size) {
      throw new Error('[checkStoneNeighbors]: invalid y value.')
    }

    const result = []

    const topNeighbor = y === size - 1 ? undefined : getIntersection(x, y + 1)
    const rightNeighbor = x === size - 1 ? undefined : getIntersection(x + 1, y)
    const bottomNeighbor = y === 0 ? undefined : getIntersection(x, y - 1)
    const leftNeighbor = x === 0 ? undefined : getIntersection(x - 1, y)

    if (topNeighbor) result.push({ x, y: y + 1, color: topNeighbor.stone })
    if (rightNeighbor) result.push({ x: x + 1, y, color: rightNeighbor.stone })
    if (bottomNeighbor) result.push({ x, y: y - 1, color: bottomNeighbor.stone })
    if (leftNeighbor) result.push({ x: x - 1, y, color: leftNeighbor.stone })

    return result
  }

  return { intersections, lastPlayedIndex, setLastPlayedIndex, getIntersection, addStone }
}
