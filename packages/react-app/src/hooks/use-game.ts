import { useState } from 'react'

import { useBoard } from './use-board'

export enum StoneColor {
  BLACK = 'BLACK',
  WHITE = 'WHITE',
}

export const BOARD_SIZE = 9

export function useGame() {
  const board = useBoard(BOARD_SIZE)
  const [playingColor, setPlayingColor] = useState<StoneColor>(StoneColor.BLACK)

  return { board, playingColor, setPlayingColor }
}
