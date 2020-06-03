import React from 'react'

import { StaticQuery, graphql } from 'gatsby'

export const reelImage = graphql`
  fragment reelImage on File {
    childImageSharp {
      fixed(width: 125, height: 125) {
        ...GatsbyImageSharpFixed
      }
    }
  }
`

export const reelImages = graphql`
  query {
    seven: file(relativePath: { eq: "7.png" }) {
      childImageSharp {
        fixed(width: 125, height: 125) {
          ...GatsbyImageSharpFixed
        }
      }
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

const SevenImage = ({ render }) => (
  <StaticQuery query={reelImages} render={render} />
)

export default SevenImage
