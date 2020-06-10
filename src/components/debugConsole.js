import React from 'react'
import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'

const DebugConsole = ({
  reels,
  balance,
  onSetReelsToPos,
  onTriggerWins,
  onInputBalanceChange,
}) => {
  const [reelPosition, setReelPosition] = React.useState({ 0: 1, 1: 1, 2: 1 })

  const handleReelPositionInputChange = (event, index) => {
    const newReelPosition = {}

    Object.keys(reelPosition).map(
      key => (newReelPosition[key] = reelPosition[key])
    )

    newReelPosition[index] =
      event.target.value === '' ? '' : Number(event.target.value)

    setReelPosition(newReelPosition)
  }

  return (
    <Paper elevation={2}>
      <Container>
        <Grid container spacing={2} justify="center">
          <Grid item xs={12}>
            <Typography variant="h4">Debug</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" id="input-reel-positions">
              Reel positions
            </Typography>
          </Grid>
          <Grid item xs={4}>
            {reels.map((_reel, index) => (
              <TextField
                key={`reel-${index}-position`}
                onChange={event => handleReelPositionInputChange(event, index)}
                id={`reel-${index}-position`}
                variant="outlined"
                label={`Reel ${index + 1}`}
                value={reelPosition[index]}
                inputProps={{
                  step: 1,
                  min: 1,
                  max: 47,
                  type: 'number',
                  'aria-labelledby': 'input-reel-positions',
                }}
              />
            ))}
          </Grid>
          <Grid item xs={4}>
            <Button
              onClick={() => onSetReelsToPos(reelPosition)}
              variant="outlined"
              color="primary"
            >
              Set
            </Button>

            <Button onClick={onTriggerWins} variant="outlined" color="primary">
              Trigger wins
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" id="input-balance">
              Balance
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              key="input-balance"
              id="input-balance"
              onChange={onInputBalanceChange}
              variant="outlined"
              label="Balance"
              value={balance}
              inputProps={{
                step: 1,
                min: 0,
                max: 100000,
                type: 'number',
                'aria-labelledby': 'input-balance',
              }}
            />
          </Grid>
          <Grid item xs={4}></Grid>
        </Grid>
      </Container>
    </Paper>
  )
}

DebugConsole.PropTypes = {
  reels: PropTypes.array.isRequired,
  balance: PropTypes.number.isRequired,
  onSetReelsToPos: PropTypes.func.isRequired,
  onTriggerWins: PropTypes.func.isRequired,
  onInputBalanceChange: PropTypes.func.isRequired
}

export default DebugConsole
