import React from 'react'
import styled from 'styled-components'

interface IProps {
  children: React.ReactNode
}

export default function Main({ children }: IProps) {
  return <Container>{children}</Container>
}

const Container = styled.main`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  width: 100%;
`
