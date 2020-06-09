import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'

import { Stage, Layer, Rect, Line, Text } from 'react-konva'

import { Spring } from 'react-spring/renderprops-konva'
import { Keyframes, animated } from 'react-spring/renderprops'

import Reel from './reel'
import Paytable from './paytable'

const styles = theme => ({
  stage: {
    left: '-200px',
  },
})

const LINE_HEIGHT = 75
const REEL = [
  0,
  1,
  0,
  3,
  0,
  2,
  0,
  5,
  0,
  4,
  0,
  1,
  0,
  3,
  0,
  2,
  0,
  5,
  0,
  4,
  0,
  1,
  0,
  3,
  0,
  2,
  0,
  5,
  0,
  4,
  0,
  1,
  0,
  3,
  0,
  2,
  0,
  5,
  0,
  4,
  0,
  1,
  0,
  3,
  0,
  2,
  0,
  5,
  0,
  4,
]

const SYMBOL_CHERRY = 1
const SYMBOL_SEVEN = 2
const SYMBOL_3BAR = 3
const SYMBOL_2BAR = 4
const SYMBOL_1BAR = 5

const PAYTABLE = {
  '[1]': payline => [[4000, 0], [1000, 2],[2000, 1]][payline],
  '[2]': () => [150, 3],
  '[1,2]': () => [75, 4],
  '[3]': () => [50, 5],
  '[4]': () => [20, 6],
  '[5]': () => [10, 7],
  '[3,4]': () => [5, 8],
  '[3,5]': () => [5, 8],
  '[4,5]': () => [5, 8],
  '[3,4,5]': () => [5, 8],
}

function findWin(bet, payline, paylineSymbols) {
  const set = new Set(paylineSymbols)
  const hash = JSON.stringify([...set.values()].sort())
  const combination = PAYTABLE[hash]
  if (typeof combination === 'function') {
    const [win, paytable_view_index] = combination(payline) 
    return { payline, win: win * bet, paylineSymbols, index: paytable_view_index }
  }
  return null
}

class SlotMachine extends React.Component {
  state = {
    images: {},
    strokeAll: false,
    reels: [],
    state: ['stopped', 'stopped', 'stopped'],
    startAt: [0, 0, 0],
    stopAt: [0, 0, 0],
    bet: 5,
    oldBalance: 100,
    balance: 100,
    canSpin: false,
    showPaylines: false,
    paylines: [2, 1, 0],
    wins: {},
    canShowWins: false,
    debugInputReelPosition: { 0: 0, 1: 0, 2: 0 },
  }

  async componentDidMount() {
    await this.preloadImages()
    this.generateReels()

    const { reels } = this.state
    const newStartAt = reels.map(this.getRandomReelPos)

    this.setState({
      startAt: newStartAt,
      stopAt: newStartAt.slice(0),
      canSpin: this.state.balance >= this.state.bet,
    })
  }

  getRandomReelPos = () => (Math.floor(Math.random() * 10) % 10) + 10

  getReelSymbol = (reelIndex, payline, pos) => {
    const { reels } = this.state
    const reel = reels[reelIndex]
    const symbolIndex = reel.length - (pos + payline)
    return reel[symbolIndex]
  }

  generateReels = () => {
    const newReels = []

    for (let reelIndex = 0; reelIndex < 3; reelIndex++) {
      newReels.push(REEL.slice(0))
    }

    this.setState({ reels: newReels })
  }

  preloadImage = async (id, width, height, src) =>
    new Promise(r => {
      const image = new window.Image(width, height)
      image.onload = r
      image.onerror = r
      image.src = src
      image.id = id
      return image
    })

  preloadImages = async () => {
    const { resources } = this.props

    const result = await Promise.all(
      Object.keys(resources).map(async key => {
        return await this.preloadImage(
          key,
          141,
          121,
          resources[key].childImageSharp.fixed.src
        )
      })
    )

    const newImages = { 0: null }

    for (let i = 0; i < result.length; i++) {
      const event = await result[i]
      newImages[i + 1] = event.path[0]
    }

    this.setState({ images: newImages })
  }

  handleSpinButton = () => {
    const { reels } = this.state

    const stopAt = reels.map(this.getRandomReelPos)
    this.spin({ stopAt })
  }

  handleWins = stopAt => {
    const { paylines, bet } = this.state

    const wins = []

    paylines.map(payline => {
      const symbols = stopAt.map((reelPos, reelIndex) =>
        this.getReelSymbol(reelIndex, payline, reelPos)
      )

      const win = findWin(bet, payline, symbols)

      if (win !== null) {
        wins[payline] = win
      }
    })

    return wins
  }

  debugSymbols = stopAt => {
    const { paylines } = this.state
    const symbols = paylines.map(payline =>
      stopAt.map((reelPos, reelIndex) =>
        this.getReelSymbol(reelIndex, payline, reelPos)
      )
    )

    console.log('STOPS AT', stopAt, symbols)
  }

  spin = ({ stopAt }) => {
    const { balance, bet } = this.state

    if (balance < bet) {
      return
    }

    this.setState({
      state: ['start', 'start', 'start'],
      stopAt,
      canSpin: false,
      oldBalance: balance,
      balance: balance - bet,
      wins: {},
      canShowWins: false,
    })

    this.debugSymbols(stopAt)
    const wins = this.handleWins(stopAt)

    this.setState({ wins })

    this.scheduleSpinAnimations()
  }

  scheduleSpinAnimations = () => {
    setTimeout(
      () => this.setState({ state: ['spinning', 'spinning', 'spinning'] }),
      500
    )

    setTimeout(
      () => this.setState({ state: ['stop', 'spinning', 'spinning'] }),
      1500
    )

    setTimeout(
      () => this.setState({ state: ['stopped', 'stop', 'spinning'] }),
      2000
    )

    setTimeout(
      () => this.setState({ state: ['stopped', 'stopped', 'stop'] }),
      2500
    )

    setTimeout(
      () =>
        this.setState(
          {
            state: ['stopped', 'stopped', 'stopped'],
            startAt: this.state.stopAt.slice(0),
            canSpin: this.state.balance >= this.state.bet,
          },
          this.handleWinTransfer
        ),
      3000
    )

    setTimeout(
      () =>
        this.setState({
          canShowWins: true,
        }),
      3100
    )
  }

  handleWinTransfer = () => {
    const { wins, balance } = this.state
    const sumOfAllWins = Object.values(wins)
      .map(w => w.win)
      .reduce((p, cur) => p + cur, 0)

    const newBalance = balance + sumOfAllWins
    
    this.setState({ oldBalance: balance, balance: newBalance })
  }

  handleReelPositionInputChange = (event, index) => {
    const { debugInputReelPosition } = this.state
    const newDebugInputReelPosition = {}

    Object.keys(debugInputReelPosition).map(
      key => (newDebugInputReelPosition[key] = debugInputReelPosition[key])
    )

    newDebugInputReelPosition[index] =
      event.target.value === '' ? '' : Number(event.target.value)

    this.setState({ debugInputReelPosition: newDebugInputReelPosition })
  }

  handleSetReelsToPos = () => {
    const { debugInputReelPosition } = this.state

    const stops = Object.values(debugInputReelPosition).slice(0)
    const symbols = this.state.paylines.map(payline =>
      stops.map((reelPos, reelIndex) =>
        this.getReelSymbol(reelIndex, payline, reelPos)
      )
    )

    this.setState({
      wins: {},
      stopAt: stops.slice(0),
      startAt: stops.slice(0),
    })
  }

  handleDebugTriggerWins = () => {
    const { stopAt, balance, bet } = this.state
    const wins = this.handleWins(stopAt)

    this.setState(
      {
        oldBalance: balance,
        balance: balance - bet,
        wins,
        canShowWins: true,
      },
      this.handleWinTransfer
    )
  }

  handleInputBalanceChange = event => {
    const { balance } = this.props
    const newBalance =
      event.target.value === '' ? '' : Number(event.target.value)
    this.setState({ oldBalance: balance, balance: newBalance })
  }

  render() {
    const {
      images,
      reels,
      state,
      startAt,
      stopAt,
      canSpin,
      bet,
      oldBalance,
      balance,
      debugInputReelPosition,
      wins,
      canShowWins,
      paylines,
    } = this.state

    const { stroke, classes } = this.props

    if (!reels) {
      return null
    }

    const reelBase = 2
    const reelSpacing = 40
    const reelBases = [0, 141, 282]
    const paylineBases = [76, 151, 227]
    const leftMargin = 80
    const width = 720
    const height = 400

    return (
      <React.Fragment>
        <Grid container spacing={2} justify="center">
          <Grid item xs={8}>
            <Stage width={width} height={height} className={classes.stage}>
              <Layer>
                {reels.map((_reel, index) => (
                  <ReelBackground
                    key={`reelbg-${index}`}
                    x={
                      reelBase +
                      leftMargin +
                      reelSpacing * index +
                      reelBases[index]
                    }
                  />
                ))}
              </Layer>
              <Layer clip={{ x: reelBase, y: 62, width: 593, height: 327 }}>
                {reels.map((reel, index) => (
                  <Reel
                    key={`reel-${index}`}
                    x={
                      reelBase +
                      leftMargin +
                      5 +
                      reelSpacing * index +
                      reelBases[index]
                    }
                    lineHeight={LINE_HEIGHT}
                    stroke={stroke}
                    images={images}
                    reel={reel}
                    state={state[index]}
                    startAt={startAt[index]}
                    stopAt={stopAt[index]}
                  />
                ))}
              </Layer>
              <Layer>
                {paylines.map((payline, i) => (
                  <Payline
                    key={`payline-${i}`}
                    x={reelBase}
                    y={paylineBases[i]}
                    fill={'gold'}
                    number={i}
                    win={wins[payline]}
                    canShowWins={canShowWins}
                  />
                ))}
              </Layer>
            </Stage>
          </Grid>
          <Grid item xs={4}>
            <Paytable images={images} bet={bet} canShowWins={canShowWins} wins={wins} />
          </Grid>

          <Grid item xs={4}>
            <Typography variant="h5">Bet: {bet}</Typography>
            <Slider
              disabled={!canSpin}
              defaultValue={0}
              value={typeof bet === 'number' ? bet : 0}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="on"
              step={1}
              marks
              min={1}
              max={10}
              onChange={(_, newValue) => this.setState({ bet: newValue })}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5">
              Balance:{' '}
              <Spring from={{ balance: oldBalance }} to={{ balance }}>
                {props => props.balance.toFixed(0)}
              </Spring>
            </Typography>
          </Grid>
          <Grid item xs={1}>
            {canSpin ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.handleSpinButton()}
              >
                Spin!
              </Button>
            ) : (
              <Button variant="contained" disabled>
                Spin!
              </Button>
            )}
          </Grid>
        </Grid>
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
                    onChange={event =>
                      this.handleReelPositionInputChange(event, index)
                    }
                    id={`reel-${index}-position`}
                    variant="outlined"
                    label={`Reel ${index + 1}`}
                    value={debugInputReelPosition[index]}
                    inputProps={{
                      step: 1,
                      min: 0,
                      max: 50,
                      type: 'number',
                      'aria-labelledby': 'input-reel-positions',
                    }}
                  />
                ))}
              </Grid>
              <Grid item xs={4}>
                <Button
                  onClick={this.handleSetReelsToPos}
                  variant="outlined"
                  color="primary"
                >
                  Set
                </Button>

                <Button
                  onClick={this.handleDebugTriggerWins}
                  variant="outlined"
                  color="primary"
                >
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
                  onChange={this.handleInputBalanceChange}
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
      </React.Fragment>
    )
  }
}

SlotMachine.propTypes = {
  stroke: PropTypes.string,
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SlotMachine)

const Payline = ({ x, y, fill, number, win, canShowWins }) => {
  const [showLine, setShowLine] = React.useState(false)
  let winField = null
  let line = null

  const handleShowLine = () => {
    setShowLine(!showLine)
  }

  const PaylineWinAnimation = Keyframes.Spring(async next => {
    while (true) {
      await next({
        from: { opacity: 1.0 },
        to: { opacity: 0.1 },
      })

      await next({
        from: { opacity: 0.1 },
        to: { opacity: 1.0 },
      })
    }
  })

  if (canShowWins && typeof win !== 'undefined') {
    const AnimatedLine = animated('Line')
    const AnimatedRect = animated('Rect')

    winField = (
      <PaylineWinAnimation reset config={{ duration: 500 }}>
        {props => (
          <React.Fragment>
            <Line
              x={x + 65}
              y={y + 60}
              points={[0, 0, 550, 0]}
              stroke={'gold'}
              opacity={props.opacity}
            />
            <Rect
              x={x + 62}
              y={y + 43}
              width={40}
              height={30}
              fill={fill}
              shadowBlur={3}
            />
            <Text text={win.win} x={x + 64} y={y + 53} />
          </React.Fragment>
        )}
      </PaylineWinAnimation>
    )
  }

  if (showLine) {
    line = (
      <Line
        x={x + 65}
        y={y + 60}
        points={[0, 0, 550, 0]}
        stroke={'gold'}
        opacity={0.8}
      />
    )
  }

  return (
    <React.Fragment>
      <Rect
        x={x}
        y={y + 43}
        width={60}
        height={30}
        fill={fill}
        shadowBlur={3}
        onClick={handleShowLine}
      />
      <Text
        text={`Payline ${number + 1}`}
        x={x + 5}
        y={y + 53}
        onClick={handleShowLine}
      />
      {winField}
      {line}
    </React.Fragment>
  )
}

const ReelBackground = ({ x }) => {
  return (
    <React.Fragment>
      <Line
        x={x}
        y={0}
        points={[0, 60, 160, 60, 160, 390, 0, 390]}
        closed
        stroke="black"
        strokeWidth={3}
        fillLinearGradientStartPoint={{ x: 0, y: 60 }}
        fillLinearGradientEndPoint={{ x: 0, y: 390 }}
        fillLinearGradientColorStops={[
          0,
          'grey',
          0.1,
          'lightgrey',
          0.2,
          'white',
          0.8,
          'white',
          0.9,
          'lightgrey',
          1,
          'grey',
        ]}
      />
    </React.Fragment>
  )
}
