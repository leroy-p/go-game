import styled from 'styled-components'

import { BOARD_SIZE } from '../hooks/use-game'
import { StoneColor, useBoard } from '../hooks/use-board'
import { useState } from 'react'

interface IProps {
  board: ReturnType<typeof useBoard>
}

export default function Board({ board }: IProps) {
  const [color, setColor] = useState<StoneColor>(StoneColor.BLACK)

  if (BOARD_SIZE <= 0) return <></>

  function onIntersectionClick(index: number) {
    if (board.intersections[index]?.stone) return

    board.addStone(index, color)
    setColor(color === StoneColor.BLACK ? StoneColor.WHITE : StoneColor.BLACK)
  }

  return (
    <Container>
      {board.intersections.map((intersection, index) => (
        <IntersectionContainer
          empty={Boolean(intersection.stone)}
          index={index}
          key={index}
          onClick={() => onIntersectionClick(index)}
        >
          <div className="vertical" />
          <div className="horizontal" />
          {intersection.stone && <Stone color={intersection.stone} />}
        </IntersectionContainer>
      ))}
    </Container>
  )
}

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
  height: 800px;
  justify-content: center;
  width: 800px;
`

const IntersectionContainer = styled.div<{ index: number; empty: boolean }>`
  background-color: #946500;
  cursor: ${({ empty }) => (empty ? 'auto' : 'pointer')};
  height: calc(100% / ${BOARD_SIZE});
  padding: 1px;
  position: relative;
  width: calc(100% / ${BOARD_SIZE});

  .vertical {
    background-color: #000000;
    height: ${({ index }) => (index < BOARD_SIZE || index >= BOARD_SIZE * BOARD_SIZE - BOARD_SIZE ? '50%' : '100%')};
    left: calc(50% - 1px);
    position: absolute;
    top: ${({ index }) => (index >= BOARD_SIZE * BOARD_SIZE - BOARD_SIZE ? '50%' : '0')};;
    width: 2px;
  }

  .horizontal {
    background-color: #000000;
    height: 2px;
    left: ${({ index }) => (index % BOARD_SIZE === 0 ? '50%' : '0')};
    position: absolute;
    top: calc(50% - 1px);
    width: ${({ index }) => (index % BOARD_SIZE === 0 || index % BOARD_SIZE === BOARD_SIZE - 1 ? '50%' : '100%')};
  }
`

const Stone = styled.div<{ color: StoneColor }>`
  background-color: ${({ color }) => (color === StoneColor.BLACK ? '#000000' : '#ffffff')};
  border-radius: 50%;
  height: calc(100% - 4px);
  left: 2px;
  position: absolute;
  top: 2px;
  width: calc(100% - 4px);
`
