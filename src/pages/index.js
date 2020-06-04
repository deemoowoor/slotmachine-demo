import React from 'react'

import { graphql, useStaticQuery } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/Button'

import SlotMachine from '../components/slot'
import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'

import { Typography } from '@material-ui/core'


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}))

const IndexPage = () => {
  const data = useStaticQuery(graphql`
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
`)

  const classes = useStyles()

  return (
    <Layout>
      <SEO title="Home" />
      <Grid container spacing={3} justify="center">
        <Grid item xs={2}>
          <div style={{ maxWidth: `100px`, marginBottom: `1.45rem` }}>
            <Image />
          </div>
        </Grid>
        <Grid item xs={8}>
          <h1>Material Slot Machine</h1>
        </Grid>
      </Grid>
      <Divider />
      <SlotMachine stroke={"magenta"} resources={data} /> 
      <Divider />
      <IconButton></IconButton>
      <Divider />
      <Typography>Debug area</Typography>
    </Layout>
  )
}

export default IndexPage
