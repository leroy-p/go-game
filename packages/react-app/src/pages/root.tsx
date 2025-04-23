import styled from 'styled-components'

import Layout from '../layout'
import Board from '../components/board'
import Players from '../components/players'
import { useBoard } from '../hooks/use-board'

export default function Root() {
  const { intersections, playingColor, lastPlayedIndex, prisoners, addStone, undo } = useBoard()

  return (
    <Layout>
      <Container>
        <Board
          addStone={addStone}
          intersections={intersections}
          lastPlayedIndex={lastPlayedIndex}
          playingColor={playingColor}
        />
        <Players playingColor={playingColor} prisoners={prisoners} undo={undo} />
      </Container>
    </Layout>
  )
}

const Container = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  gap: 48px;
  justify-content: center;
  width: 100%;
`
