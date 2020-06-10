import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles } from '@material-ui/core/styles'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Avatar from '@material-ui/core/Avatar'
import AvatarGroup from '@material-ui/core/Avatar'
import Paper from '@material-ui/core/Paper'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import './paytable.css'

const styles = theme => ({
  paytable: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  paytableHeader: {
    marginTop: '1em'
  }
})

const useStyles = makeStyles(styles)

const PAYTABLE_VIEW = [
  { payline: 2, name: 'Cherry', icons: [1], win: 4000 },
  { payline: 0, name: 'Cherry', icons: [1], win: 2000 },
  { payline: 1, name: 'Cherry', icons: [1], win: 1000 },
  { name: 'Seven', icons: [2], win: 150 },
  { name: 'Cherry and Seven', icons: [1, 2], win: 75 },
  { name: 'Trio-Bar', icons: [3], win: 50 },
  { name: 'Duo-Bar', icons: [4], win: 20 },
  { name: 'Bar', icons: [5], win: 10 },
  { name: 'Any bars', icons: [3, 4, 5], win: 5 },
]

const Paytable = ({ images, bet, canShowWins, wins }) => {
  if (Object.keys(images).length === 0) {
    return null
  }

  const getPaylineText = payline => {
    if (typeof payline !== 'undefined') return `Payline ${payline + 1}`
    else return null
  }

  const classes = useStyles()

  let winIndexes = []
  if (canShowWins && typeof wins !== 'undefined')
    winIndexes = Object.values(wins).map(w => w.index)

  return (
    <Paper>
      <Container><Typography variant="h5" className={classes.paytableHeader}>Paytable</Typography></Container>
      <List className={classes.paytable} dense={true}>
        {PAYTABLE_VIEW.map((item, index) => {
          return (
            <ListItem key={index} className={classes.listItem} selected={canShowWins && winIndexes.includes(index)}>
              <ListItemAvatar>
                <AvatarGroup max={3}>
                  {item.icons.map(icon => (
                    <Avatar
                      key={`${item.name}${icon}`}
                      alt={item.name}
                      src={images[icon].src}
                    />
                  ))}
                </AvatarGroup>
              </ListItemAvatar>
              <ListItemText
                className={classes.listItemText}
                primary={`${item.name}`}
                secondary={getPaylineText(item.payline)}
              />
              <ListItemSecondaryAction>
                {item.win * bet}
              </ListItemSecondaryAction>
            </ListItem>
          )
        })}
      </List>
    </Paper>
  )
}

Paytable.propTypes = {
  images: PropTypes.object.isRequired,
  bet: PropTypes.number.isRequired,
  canShowWins: PropTypes.bool.isRequired,
  wins: PropTypes.object.isRequired
}

export default Paytable
