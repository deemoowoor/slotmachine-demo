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

const reelImages = graphql`
  query {
    seven: file(relativePath: { eq: "7.png" }) {
      ...reelImage
    }

    cherry: file(relativePath: { eq: "Cherry.png" }) {
      ...reelImage
    }

    bar: file(relativePath: { eq: "BAR.png" }) {
      ...reelImage
    }

    bar2: file(relativePath: { eq: "2xBAR.png" }) {
      ...reelImage
    }

    bar3: file(relativePath: { eq: "3xBAR.png" }) {
      ...reelImage
    }
  }
`
export default reelImages