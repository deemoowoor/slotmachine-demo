import React from 'react'
import PropTypes from 'prop-types'

import { Stage, Layer, Rect, Line, Text, Image } from 'react-konva'
import { Image as CanvasImage } from 'react-konva'
import {useSprings, animated} from 'react-spring'

class SlotMachine extends React.Component {
  state = {
    images: {},
    strokeAll: false,
    reels: [],
  }

  async componentDidMount() {
    await this.preloadImages()
    this.generateReels()
  }

  generateReels = () => {
    const newReels = []
    for (let reelIndex = 0; reelIndex < 3; reelIndex++) {
      const reel = []
      for (let i = 0; i < 1250; i++) {
        reel.push(i%5)
      }
      newReels.push(reel)
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

    const newImages = {}
    for (let i = 0; i < result.length; i++) {
      const event = await result[i]
      newImages[i] = event.path[0]
    }

    this.setState({ images: newImages })
  }

  handleSpinButton = () => {}

  render() {
    const { images, reels } = this.state
    const { stroke } = this.props

    if (!reels) {
      return null
    }

    const reelBase = 120
    const reelSpacing = 40
    const reelBases = [0, 141, 282]
    const lineBases = [0, 151, 302]
    const lineHeight = 151

    return (
      <Stage width={960} height={480}>
        <Layer>
          {reels.map((reel, index) => (
            <ReelBackground
              key={`reelbg-${index}`}
              x={reelBase + 80 + reelSpacing * index + reelBases[index]}
            />
          ))}
        </Layer>
        <Layer clip={{ x: 120, y: 0, width: 593, height: 423 }}>
          {reels.map((reel, index) => (
            <Reel
              key={`reel-${index}`}
              x={reelBase + 85 + reelSpacing * index + reelBases[index]}
              lineHeight={lineHeight}
              stroke={stroke}
              images={images}
              reel={reel}
            />
          ))}
        </Layer>
        <Layer>
          <PaylineIndicator
            x={reelBase}
            y={0}
            padding={{ y: 40 }}
            fill={'gold'}
            number={1}
          />
          <PaylineIndicator
            x={reelBase}
            y={151}
            padding={{ y: 40 }}
            fill={'gold'}
            number={2}
          />
          <PaylineIndicator
            x={reelBase}
            y={302}
            padding={{ y: 40 }}
            fill={'gold'}
            number={3}
          />
          <Payline x={reelBase + 65} y={lineBases[0]} />
          <Payline x={reelBase + 65} y={lineBases[1]} />
          <Payline x={reelBase + 65} y={lineBases[2]} />
        </Layer>
      </Stage>
    )
  }
}

SlotMachine.propTypes = {}

export default SlotMachine

const PaylineIndicator = ({ x, y, padding, fill, number }) => {
  return (
    <React.Fragment>
      <Rect
        x={x}
        y={y + padding.y}
        width={60}
        height={40}
        fill={fill}
        shadowBlur={3}
      />
      <Text text={`Payline ${number}`} x={x + 5} y={y + padding.y + 15} />
    </React.Fragment>
  )
}

const Payline = ({ x, y }) => {
  return (
    <Line
      x={x}
      y={60 + y}
      points={[0, 0, 550, 0]}
      stroke={'gold'}
      opacity={0.8}
    />
  )
}

const ReelBackground = ({ x }) => {
  return (
    <React.Fragment>
      <Line
        x={x}
        y={1}
        points={[0, 0, 151, 0, 151, 423, 0, 423]}
        closed
        stroke="black"
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: 0, y: 423 }}
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

const Reel = ({ x, lineHeight, images, stroke, reel }) => {
  const springs = useSprings(2, reel.map(s => ({ y: s.y })))
  return (
    <React.Fragment>
      {reel.map((s, index) => (
        <CanvasImage
          key={`symbol-${index}`}
          stroke={stroke}
          x={x}
          y={lineHeight * index - (reel.length - 3) * lineHeight + springs[index].y}
          image={images[reel[index]]}
        />
      ))}
    </React.Fragment>
  )
}
