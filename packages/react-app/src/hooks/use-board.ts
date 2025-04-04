import { useState } from 'react'

export enum StoneColor {
  BLACK = 'BLACK',
  WHITE = 'WHITE',
}

export interface IIntersection {
  stone?: StoneColor
}

export function useBoard(size: number) {
  const [intersections, setIntersections] = useState<IIntersection[]>(() => {
    const result = []

    for (let i = 0; i < size * size; i++) {
      result.push({})
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
