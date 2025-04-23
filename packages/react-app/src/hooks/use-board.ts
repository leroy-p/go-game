import { useRef, useState, useCallback } from 'react'
import { Board, IIntersection, StoneColor } from '../classes/board'

export const BOARD_SIZE = 4

export const useBoard = () => {
  const boardRef = useRef<Board>(new Board(BOARD_SIZE))
  const [intersections, setIntersections] = useState<IIntersection[]>(boardRef.current.intersections)
  const [playingColor, setPlayingColor] = useState<StoneColor>(boardRef.current.playingColor)
  const [lastPlayedIndex, setLastPlayedIndex] = useState<number>(boardRef.current.lastPlayedIndex)
  const [prisoners, setPrisoners] = useState<{
    BLACK: number
    WHITE: number
  }>(boardRef.current.prisoners)

  const addStone = useCallback((index: number) => {
    boardRef.current.addStone(index)
    setIntersections([...boardRef.current.intersections])
    setPlayingColor(boardRef.current.playingColor)
    setLastPlayedIndex(boardRef.current.lastPlayedIndex)
    setPrisoners(boardRef.current.prisoners)
  }, [])

  const undo = useCallback(() => {
    boardRef.current.undo()
    setIntersections([...boardRef.current.intersections])
    setPlayingColor(boardRef.current.playingColor)
    setLastPlayedIndex(boardRef.current.lastPlayedIndex)
    setPrisoners(boardRef.current.prisoners)
  }, [])

  return {
    intersections,
    playingColor,
    lastPlayedIndex,
    prisoners,
    addStone,
    undo,
  }
}
