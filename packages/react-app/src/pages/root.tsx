import React from 'react'
import styled from 'styled-components'

import Layout from '../layout'
import Board from '../components/board'
import { useGame } from '../hooks/use-game'

export default function Root() {
  const { board, playingColor, setPlayingColor } = useGame()

  return (
    <Layout>
      <Container>
        <Board board={board} playingColor={playingColor} setPlayingColor={setPlayingColor} />
      </Container>
    </Layout>
  )
}

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`
