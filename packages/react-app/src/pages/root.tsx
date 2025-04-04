import React from 'react'
import styled from 'styled-components'

import Layout from '../layout'
import Board from '../components/board'
import { useGame } from '../hooks/use-game'

export default function Root() {
  const { board } = useGame()

  return (
    <Layout>
      <Container>
        <Board board={board} />
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
