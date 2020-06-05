import React from 'react'
import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import { Stage, Layer, Rect, Line, Text, Group } from 'react-konva'
import { Image } from 'react-konva'
import { Keyframes, animated } from 'react-spring/renderprops'

import { Spring } from 'react-spring/renderprops-konva'

import Slider from '@material-ui/core/Slider'
import { Typography } from '@material-ui/core'

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
    wins: [],
    paytable: {
      SYMBOL_CHERRY: [2000, 1000, 4000],
      SYMBOL_SEVEN: [150, 150, 150],
      SYMBOL_CHERRY, SYMBOL_SEVEN: [75, 75, 75],
      SYMBOL_3BAR: [50, 50, 50],
      SYMBOL_2BAR: [20, 20, 20],
      SYMBOL_1BAR: [10, 10, 10],
      SYMBOL_2BAR, SYMBOL_3BAR, SYMBOL_1BAR: [5, 5, 5]
    }
  }

  getRandomReelPos = () => ((Math.floor(Math.random() * 10) % 10) + 10) * 75

  getReelSymbol = (reelIndex, payline, pos) => {
    const { reels } = this.state
    const symbolIndex = pos / LINE_HEIGHT + payline
    return reels[reelIndex][symbolIndex]
  }

  async componentDidMount() {
    await this.preloadImages()
    this.generateReels()
    const newStartAt = [
      this.getRandomReelPos(),
      this.getRandomReelPos(),
      this.getRandomReelPos(),
    ]
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
    const { balance, bet } = this.state

    if (balance < bet) {
      return
    }

    const newStopAt = [
      this.getRandomReelPos(),
      this.getRandomReelPos(),
      this.getRandomReelPos(),
    ]

    console.log(
      'STOPS AT',
      this.state.paylineBases.map((_p, payline) => 
      newStopAt.map((reelPos, reelIndex) =>
        this.getReelSymbol(reelIndex, payline, reelPos)
      ))
    )

    const wins = []
    this.state.paylineBases.map((_p, payline) => {
      const symbols = newStopAt.map((reelPos, reelIndex) =>
        this.getReelSymbol(reelIndex, payline, reelPos)
      )

      if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
        wins.push(symbols[0])
      }
    })

    this.setState({
      state: ['start', 'start', 'start'],
      stopAt: newStopAt,
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
      showPaylines
    } = this.state
    const { stroke } = this.props

    if (!reels) {
      return null
    }

    const reelBase = 120
    const reelSpacing = 40
    const reelBases = [0, 141, 282]
    const paylineBases = [76, 151, 227]

    return (
      <Grid container spacing={2}>
        <Stage width={960} height={400}>
          <Layer>
            {reels.map((_reel, index) => (
              <ReelBackground
                key={`reelbg-${index}`}
                x={reelBase + 80 + reelSpacing * index + reelBases[index]}
              />
            ))}
          </Layer>
          <Layer clip={{ x: 120, y: 62, width: 593, height: 327 }}>
            {reels.map((reel, index) => (
              <Reel
                key={`reel-${index}`}
                x={reelBase + 85 + reelSpacing * index + reelBases[index]}
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
            <Payline x={reelBase + 65} y={paylineBases[0]} visible={showPaylines} />
            <Payline x={reelBase + 65} y={paylineBases[1]} visible={showPaylines} />
            <Payline x={reelBase + 65} y={paylineBases[2]} visible={showPaylines} />
          </Layer>
        </Stage>
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
        <Grid item xs={2}>
          <Typography>
            Balance{' '}
            <Spring from={{ balance: oldBalance }} to={{ balance }}>
              {props => props.balance.toFixed(0)}
            </Spring>
          </Typography>
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
        y={1}
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

const Reel = ({
  x,
  lineHeight,
  images,
  stroke,
  reel,
  state,
  startAt,
  stopAt,
}) => {
  const AnimatedGroup = animated('Group')

  const ReelContainer = Keyframes.Spring({
    start: async (next, cancel, ownProps) => {
      //console.log(`reel`, x, startAt, '->', stopAt, 'starting')
      await next({
        from: { y: startAt },
        to: { y: startAt - 60 },
      })
      await next({
        from: { y: startAt - 60 },
        to: { y: startAt + 151 * 5 },
      })
    },

    spinning: async (next, cancel, ownProps) => {
      //console.log(`reel`, x, startAt, '->', stopAt, 'spinning')
      while (true) {
        await next({
          from: { y: 0 },
          to: { y: 50 * 75 },
        })
      }
    },

    stop: async (next, cancel, ownProps) => {
      //console.log(`reel`, x, startAt, '->', stopAt, 'stopping', ownProps)
      await next({
        from: { y: 0 },
        to: { y: stopAt + 150 },
      })
      await next({
        from: { y: stopAt + 150 },
        to: { y: stopAt },
      })
    },

    stopped: async (next, cancel, ownProps) => {
      await next({
        from: { y: stopAt },
        to: { y: stopAt },
      })
    },
  })

  const Content = props => {
    return (
      <AnimatedGroup y={props.y} stopAt={stopAt}>
        {reel.map((s, index) => (
          <Image
            key={`symbol-${index}`}
            stroke={stroke}
            x={x}
            y={lineHeight * index - (reel.length - 3) * lineHeight}
            image={images[s]}
          />
        ))}
      </AnimatedGroup>
    )
  }

  return (
    <ReelContainer state={state} reset native config={{ duration: 500 }}>
      {Content}
    </ReelContainer>
  )
}
