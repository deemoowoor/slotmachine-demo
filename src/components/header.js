import PropTypes from 'prop-types'
import React from 'react'

import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Image from './image'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    background: 'linear-gradient(to right, #2b8cbe, #a6bddb)',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))

const Header = ({ siteTitle }) => {
  const classes = useStyles()

  const theme = useTheme()
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        className={clsx(classes.appBar)}
      >
        <Toolbar>
          <Image />
          
          <Typography variant="h6" color="inherit">
            {siteTitle}
          </Typography>
        </Toolbar>
      </AppBar>
      
    </div>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
