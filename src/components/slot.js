import React from 'react'
import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Slider from '@material-ui/core/Slider'
import { Typography } from '@material-ui/core'

import { Stage, Layer, Rect, Line, Text, Group } from 'react-konva'

import { Spring } from 'react-spring/renderprops-konva'

import { Reel } from './reel'

const LINE_HEIGHT = 75
const REEL = 
[
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
  '[1]': payline => [2000, 1000, 4000][payline],
  '[2]': payline => 150,
  '[1, 2]': payline => 75,
  '[3]': payline => 50,
  '[4]': payline => 20,
  '[5]': payline => 10,
  '[3, 4, 5]': payline => 5,
}

function findWin(payline, paylineSymbols) {
  const set = new Set(paylineSymbols)
  console.log(set)
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
    symbols: [],
    bet: 5,
    oldBalance: 100,
    balance: 100,
    canSpin: false,
    showPaylines: false,
    paylines: [2, 1, 0],
    wins: [],
    debugInputReelPosition: { 0: 0, 1: 0, 2: 0 },
  }

  getRandomReelPos = () => (Math.floor(Math.random() * 10) % 10) + 10

  getReelSymbol = (reelIndex, payline, pos) => {
    const { reels } = this.state
    const reel = reels[reelIndex]
    const symbolIndex = reel.length - (pos + payline)
    return reel[symbolIndex]
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
    const { balance, bet, images, reels } = this.state

    if (balance < bet) {
      return
    }

    const newStopAt = reels.map(this.getRandomReelPos)

    const symbols = this.state.paylines.map((payline) =>
      newStopAt.map((reelPos, reelIndex) =>
        this.getReelSymbol(reelIndex, payline, reelPos)
      )
    )

    console.log('STOPS AT', newStopAt, symbols)

    const wins = []

    this.state.paylines.map((_p, payline) => {
      const symbols = newStopAt.map((reelPos, reelIndex) =>
        this.getReelSymbol(reelIndex, payline, reelPos)
      )

      console.log(symbols.map(s => images[s]))
      findWin(payline, symbols)
    })

    this.setState({
      state: ['start', 'start', 'start'],
      stopAt: newStopAt,
      symbols: symbols,
      canSpin: false,
      oldBalance: balance,
      balance: balance - bet,
    })

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
        this.setState({
          state: ['stopped', 'stopped', 'stopped'],
          startAt: this.state.stopAt.slice(0),
          canSpin: this.state.balance >= this.state.bet,
        }),
      3000
    )
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

  handleBlur = () => {
    if (value < 0) {
      setValue(0)
    } else if (value > 100) {
      setValue(100)
    }
  }

  handleSetReelsToPos = () => {
    const { debugInputReelPosition } = this.state
    
    const symbols = this.state.paylines.map((payline) =>
      Object.values(debugInputReelPosition).map((reelPos, reelIndex) =>
        this.getReelSymbol(reelIndex, payline, reelPos)
      )
    )

    console.log('Symbols:', symbols)

    this.setState({
      stopAt: debugInputReelPosition,
      startAt: debugInputReelPosition,
    })
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
      showPaylines,
      debugInputReelPosition,
    } = this.state
    const { stroke } = this.props

    if (!reels) {
      return null
    }

    const reelBase = 120
    const reelSpacing = 40
    const reelBases = [0, 141, 282]
    const paylineBases = [76, 151, 227]
    const leftMargin = 80

    return (
      <Grid container spacing={2} justify="center">
        <Grid item>
          <Stage width={960} height={400}>
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
            <Layer clip={{ x: 120, y: 62, width: 593, height: 327 }}>
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
              <PaylineIndicator
                x={reelBase}
                y={paylineBases[0]}
                padding={{ y: 40 }}
                fill={'gold'}
                number={1}
                onClick={() => this.setState({ showPaylines: !showPaylines })}
              />
              <PaylineIndicator
                x={reelBase}
                y={paylineBases[1]}
                padding={{ y: 40 }}
                fill={'gold'}
                number={2}
                onClick={() => this.setState({ showPaylines: !showPaylines })}
              />
              <PaylineIndicator
                x={reelBase}
                y={paylineBases[2]}
                padding={{ y: 40 }}
                fill={'gold'}
                number={3}
                onClick={() => this.setState({ showPaylines: !showPaylines })}
              />
              <Payline
                x={reelBase + 65}
                y={paylineBases[0]}
                visible={showPaylines}
              />
              <Payline
                x={reelBase + 65}
                y={paylineBases[1]}
                visible={showPaylines}
              />
              <Payline
                x={reelBase + 65}
                y={paylineBases[2]}
                visible={showPaylines}
              />
            </Layer>
          </Stage>
        </Grid>
        <Grid item xs={3}>
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
        <Grid item xs={3}>
          <Typography>Bet</Typography>
          <Typography>{bet}</Typography>
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
            onChange={(event, newValue) => this.setState({ bet: newValue })}
          />
        </Grid>
        <Grid item xs={3}>
          <Typography>
            Balance{' '}
            <Spring from={{ balance: oldBalance }} to={{ balance }}>
              {props => props.balance.toFixed(0)}
            </Spring>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4">Debug</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" id="input-reel-positions">
            Reel positions
          </Typography>
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

          <Button
            onClick={this.handleSetReelsToPos}
            variant="outlined"
            color="primary"
          >
            Set
          </Button>
        </Grid>
      </Grid>
    )
  }
}

SlotMachine.propTypes = {
  stroke: PropTypes.string,
}

export default SlotMachine

const PaylineIndicator = ({ x, y, padding, fill, number, onClick }) => {
  return (
    <React.Fragment>
      <Rect
        x={x}
        y={y + padding.y}
        width={60}
        height={40}
        fill={fill}
        shadowBlur={3}
        onClick={onClick}
      />
      <Text text={`Payline ${number}`} x={x + 5} y={y + padding.y + 15} />
    </React.Fragment>
  )
}

const Payline = ({ x, y, visible }) => {
  return (
    <Line
      x={x}
      y={60 + y}
      points={[0, 0, 550, 0]}
      stroke={'gold'}
      opacity={0.8}
      visible={visible}
    />
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
