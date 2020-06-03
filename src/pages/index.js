import React from 'react'

import { useStaticQuery } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Divider from '@material-ui/core/Divider'

import SlotMachine from '../components/slot'
import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'

import reelImages from '../components/reelImage'


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

  const data = useStaticQuery(reelImages)
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
      <SlotMachine resources={data} />
    </Layout>
  )
}

export default IndexPage
