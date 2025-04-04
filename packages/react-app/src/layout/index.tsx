import React from 'react'
import styled from 'styled-components'
import Div100vh from 'react-div-100vh'

import Main from './main'

interface IProps {
  children: React.ReactNode
}

export default function Layout({ children }: IProps) {
  return (
    <Container>
      <Main>{children}</Main>
    </Container>
  )
}

const Container = styled(Div100vh)`
  align-items: center;
  background-color: ${({ theme }) => theme.palette.secondary.main};
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: auto;
  width: 100vw;
`
