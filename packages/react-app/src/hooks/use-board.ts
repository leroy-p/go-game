import { useState } from 'react'

import { StoneColor } from './use-game'

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
      const x = i % size
      const y = Math.floor(i / size)
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

  return { intersections, getIntersection, addStone }
}
