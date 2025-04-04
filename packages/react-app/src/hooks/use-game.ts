import { useBoard } from './use-board'

export const BOARD_SIZE = 19

export function useGame() {
  const board = useBoard(BOARD_SIZE)

  return { board }
}
