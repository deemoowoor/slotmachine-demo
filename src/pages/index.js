import React from 'react'

import { graphql, useStaticQuery } from 'gatsby'

import SlotMachine from '../components/slot'
import Layout from '../components/layout'
import SEO from '../components/seo'


const IndexPage = () => {
  const data = useStaticQuery(graphql`
  query {
    cherry: file(relativePath: { eq: "Cherry.png" }) {
      ...reelImage
    }

    seven: file(relativePath: { eq: "7.png" }) {
      ...reelImage
    }

    bar3: file(relativePath: { eq: "3xBAR.png" }) {
      ...reelImage
    }
    
    bar2: file(relativePath: { eq: "2xBAR.png" }) {
      ...reelImage
    }

    bar: file(relativePath: { eq: "BAR.png" }) {
      ...reelImage
    }

  }
`)

  return (
    <Layout>
      <SEO title="Home" />
      <SlotMachine resources={data} />
    </Layout>
  )
}

export default IndexPage
