import React from 'react'

import { graphql } from 'gatsby'

export const reelImage = graphql`
  fragment reelImage on File {
    childImageSharp {
      fixed(width: 141, height: 121) {
        ...GatsbyImageSharpFixed
      }
    }
  }
`
