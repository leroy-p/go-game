import styled from 'styled-components'
import { StoneColor } from '../classes/board'

interface IProps {
  playingColor: StoneColor
  prisoners: { [StoneColor.BLACK]: number; [StoneColor.WHITE]: number }
  undo: () => void
}

export default function Players({ playingColor, prisoners, undo }: IProps) {
  return (
    <Container>
      <PlayersContainer>
        <PlayerContainer
          className="player-container"
          playing={playingColor === StoneColor.BLACK}
          color={StoneColor.BLACK}
        >
          <div className="name-container">
            <p>Black</p>
          </div>
          <div className="prisoners-container">
            {Array.from({ length: prisoners[StoneColor.BLACK] }).map((_, index) => (
              <Stone
                className="prisoner-stone"
                color={StoneColor.WHITE}
                index={index}
                key={index}
                overlap={prisoners[StoneColor.BLACK] === 0 ? 0 : 24 - 100 / prisoners[StoneColor.BLACK]}
              />
            ))}
            <div className="count-container">
              <p>{prisoners[StoneColor.BLACK] > 0 ? prisoners[StoneColor.BLACK] : '-'}</p>
            </div>
          </div>
        </PlayerContainer>
        <PlayerContainer
          className="player-container"
          playing={playingColor === StoneColor.WHITE}
          color={StoneColor.WHITE}
        >
          <div className="name-container">
            <p>White</p>
          </div>
          <div className="prisoners-container">
            {Array.from({ length: prisoners[StoneColor.WHITE] }).map((_, index) => (
              <Stone
                className="prisoner-stone"
                color={StoneColor.BLACK}
                index={index}
                key={index}
                overlap={prisoners[StoneColor.WHITE] === 0 ? 0 : 24 - 100 / prisoners[StoneColor.WHITE]}
              />
            ))}
            <div className="count-container">
              <p>{prisoners[StoneColor.WHITE] > 0 ? prisoners[StoneColor.WHITE] : '-'}</p>
            </div>
          </div>
        </PlayerContainer>
      </PlayersContainer>
      <button onClick={undo}>UNDO</button>
    </Container>
  )
}

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: center;
  width: 600px;

  & > button {
    border: solid 1px #ffffff;
    padding: 8px 16px;
  }
`

const PlayersContainer = styled.div`
  align-items: center;
  background-color: #888888;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;

  .player-container:nth-child(2) {
    border-left: solid 1px #ffffff;
  }
`

const PlayerContainer = styled.div<{ color: StoneColor; playing: boolean }>`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;

  .name-container {
    align-items: center;
    display: flex;
    flex-direction: row;
    height: 48px;
    justify-content: center;
    width: 100%;

    & > p {
      color: ${({ color }) => (color === StoneColor.BLACK ? '#000000' : '#ffffff')};
      font-size: 24px;
      font-weight: ${({ playing }) => (playing ? 'bold' : 'normal')};
    }
  }

  .prisoners-container {
    align-items: center;
    display: flex;
    flex-direction: row;
    height: 48px;
    justify-content: center;
    position: relative;
    padding: 0 4px;
    width: 100%;

    .count-container {
      align-items: center;
      display: flex;
      flex-direction: row;
      height: 100%;
      justify-content: center;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;

      & > p {
        color: ${({ color }) => (color === StoneColor.BLACK ? '#000000' : '#ffffff')};
        font-size: 24px;
        font-weight: bold;
      }
    }
  }
`

const Stone = styled.div<{ color: StoneColor; overlap: number; index: number }>`
  background-color: ${({ color }) => (color === StoneColor.BLACK ? '#000000' : '#ffffff')};
  border-radius: 50%;
  margin-left: ${({ overlap, index }) => (index === 0 ? 0 : `-${overlap}px`)};
  height: 32px;
  width: 32px;
`
