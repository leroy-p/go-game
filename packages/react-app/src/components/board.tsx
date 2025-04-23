import styled from 'styled-components'

import { BOARD_SIZE, useBoard } from '../hooks/use-board'
import { intToAlpha } from '../utils/utils'
import { IIntersection, StoneColor } from '../classes/board'

interface IProps {
  intersections: IIntersection[]
  playingColor: StoneColor
  lastPlayedIndex: number
  addStone: (index: number) => void
}

export default function Board({ intersections, playingColor, lastPlayedIndex, addStone }: IProps) {
  if (BOARD_SIZE <= 0) return <></>

  return (
    <Container>
      <div className="main-container">
        {intersections.map((intersection, index) => (
          <IntersectionContainer
            index={index}
            key={index}
            onClick={() => addStone(index)}
            unclickable={Boolean(intersection.stone || intersection.forbidden === playingColor)}
          >
            <div className="vertical-line" />
            <div className="horizontal-line" />
            {intersection.hoshi && <div className="hoshi" />}
            {intersection.ko && (
              <div className="ko">
                <div />
              </div>
            )}
            {intersection.stone && (
              <Stone className="stone" color={intersection.stone}>
                {index === lastPlayedIndex && <div />}
              </Stone>
            )}
            {!intersection.stone && intersection.forbidden !== playingColor && (
              <PreviewStone className="preview-stone" color={playingColor} />
            )}
          </IntersectionContainer>
        ))}
      </div>
      <div className="x-container top">
        {Array.from({ length: BOARD_SIZE }).map((_, index) => (
          <div key={index}>
            <p>{intToAlpha(index)}</p>
          </div>
        ))}
      </div>
      <div className="x-container bottom">
        {Array.from({ length: BOARD_SIZE }).map((_, index) => (
          <div key={index}>
            <p>{intToAlpha(index)}</p>
          </div>
        ))}
      </div>
      <div className="y-container left">
        {Array.from({ length: BOARD_SIZE }).map((_, index) => (
          <div key={index}>
            <p>{BOARD_SIZE - index}</p>
          </div>
        ))}
      </div>
      <div className="y-container right">
        {Array.from({ length: BOARD_SIZE }).map((_, index) => (
          <div key={index}>
            <p>{BOARD_SIZE - index}</p>
          </div>
        ))}
      </div>
    </Container>
  )
}

const Container = styled.div`
  background-color: #946500;
  display: flex;
  height: 848px;
  padding: 16px;
  position: relative;
  width: 848px;

  .main-container {
    align-items: center;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap-reverse;
    height: 100%;
    justify-content: center;
    width: 100%;
  }

  .x-container {
    display: flex;
    flex-direction: row;
    height: 32px;
    justify-content: center;
    left: 0;
    padding: 0 16px;
    position: absolute;
    width: 100%;

    &.top {
      align-items: flex-start;
      top: 4px;
    }

    &.bottom {
      align-items: flex-end;
      bottom: 4px;
    }

    & > div {
      align-items: center;
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: center;

      & > p {
        color: #000000;
        font-size: 18px;
        font-weight: bold;
      }
    }
  }

  .y-container {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    position: absolute;
    top: 0;
    padding: 16px 0;
    width: 32px;

    &.left {
      align-items: flex-start;
      left: 4px;
    }

    &.right {
      align-items: flex-end;
      right: 4px;
    }

    & > div {
      align-items: center;
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: center;

      & > p {
        color: #000000;
        font-size: 18px;
        font-weight: bold;
      }
    }
  }
`

const IntersectionContainer = styled.div<{ index: number; unclickable: boolean }>`
  align-items: center;
  cursor: ${({ unclickable }) => (unclickable ? 'auto' : 'pointer')};
  display: flex;
  flex-direction: row;
  height: calc(100% / ${BOARD_SIZE});
  justify-content: center;
  padding: 1px;
  pointer-events: ${({ unclickable }) => (unclickable ? 'none' : 'auto')};
  position: relative;
  width: calc(100% / ${BOARD_SIZE});

  &:hover {
    .preview-stone {
      display: flex;
    }
  }

  .vertical-line {
    background-color: #000000;
    height: ${({ index }) => (index < BOARD_SIZE || index >= BOARD_SIZE * BOARD_SIZE - BOARD_SIZE ? '50%' : '100%')};
    left: calc(50% - 1px);
    position: absolute;
    top: ${({ index }) => (index >= BOARD_SIZE * BOARD_SIZE - BOARD_SIZE ? '50%' : '0')};;
    width: 2px;
  }

  .horizontal-line {
    background-color: #000000;
    height: 2px;
    left: ${({ index }) => (index % BOARD_SIZE === 0 ? '50%' : '0')};
    position: absolute;
    top: calc(50% - 1px);
    width: ${({ index }) => (index % BOARD_SIZE === 0 || index % BOARD_SIZE === BOARD_SIZE - 1 ? '50%' : '100%')};
  }

  .hoshi {
    background-color: #000000;
    border-radius: 50%;
    height: 20%;
    width: 20%;
  }

  .ko {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;

    & > div {
      border: solid 4px #000000;
      height: 80%;
      width: 80%;
    }
  }
`

const Stone = styled.div<{ color: StoneColor }>`
  align-items: center;
  background-color: ${({ color }) => (color === StoneColor.BLACK ? '#000000' : '#ffffff')};
  border-radius: 50%;
  display: flex;
  flex-direction: row;
  height: calc(100% - 4px);
  justify-content: center;
  left: 2px;
  position: absolute;
  top: 2px;
  width: calc(100% - 4px);

  & > div {
    background-color: ${({ color }) => (color === StoneColor.BLACK ? '#ffffff' : '#000000')};
    height: 20%;
    width: 20%;
  }
`

const PreviewStone = styled.div<{ color: StoneColor }>`
  background-color: ${({ color }) => (color === StoneColor.BLACK ? '#000000' : '#ffffff')};
  border-radius: 50%;
  display: none;
  height: calc(100% - 4px);
  left: 2px;
  opacity: 0.5;
  position: absolute;
  top: 2px;
  width: calc(100% - 4px);
`
