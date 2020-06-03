import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

import { Stage, Layer, Rect, Line, Text, Image } from 'react-konva'
import { Image as CanvasImage } from 'react-konva'
import Konva from 'konva'
import useImage from 'use-image'


class SlotMachine extends React.Component {
  state = {
    images: {},
  }

  componentDidMount() {
    this.updateImages()
  }

  updateImages = () => {
    const { resources } = this.props
    
    Object.keys(resources).map(key => {
      const source = resources[key].childImageSharp.fixed.src
    })
  }

  handleSpinButton = () => {}

  render() {
    const { images } = this.state

    const reelBase = 120
    const reelSpacing = 40
    const reelBases = [0, 141, 282]
    const lineBases = [0, 151, 302]

    return (
      <Stage width={960} height={780}>
        <Layer>
          <ReelBackground x={reelBase + 80 + reelBases[0]} />
          <ReelBackground x={reelBase + 80 + reelSpacing + reelBases[1]} />
          <ReelBackground x={reelBase + 80 + reelSpacing * 2 + reelBases[2]} />
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
        </Layer>
        <Layer>
          <CanvasImage
            stroke="magenta"
            x={reelBase + 80 + reelSpacing * 0 + reelBases[0]}
            y={lineBases[0]}
            image={images.cherry}
          />
          <CanvasImage
            stroke="magenta"
            x={reelBase + 80 + reelSpacing * 1 + reelBases[1]}
            y={lineBases[0]}
            image={images.cherry}
          />
          <CanvasImage
            stroke="magenta"
            x={reelBase + 80 + reelSpacing * 2 + reelBases[2]}
            y={lineBases[0]}
            image={images.cherry}
          />

          <CanvasImage
            stroke="magenta"
            x={reelBase + 80 + reelSpacing * 0 + reelBases[0]}
            y={lineBases[1]}
            image={images.seven}
          />
          <CanvasImage
            stroke="magenta"
            x={reelBase + 80 + reelSpacing * 1 + reelBases[1]}
            y={lineBases[1]}
            image={images.seven}
          />
          <CanvasImage
            stroke="magenta"
            x={reelBase + 80 + reelSpacing * 2 + reelBases[2]}
            y={lineBases[1]}
            image={images.seven}
          />

          <CanvasImage
            stroke="magenta"
            x={reelBase + 80 + reelSpacing * 0 + reelBases[0]}
            y={lineBases[2]}
            image={images.bar}
          />
          <CanvasImage
            stroke="magenta"
            x={reelBase + 80 + reelSpacing * 1 + reelBases[1]}
            y={lineBases[2]}
            image={images.bar2}
          />
          <CanvasImage
            stroke="magenta"
            x={reelBase + 80 + reelSpacing * 2 + reelBases[2]}
            y={lineBases[2]}
            image={images.bar3}
          />
        </Layer>
        <Layer>
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

const SevenImage = ({}) => {}

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
          0.05,
          'lightgrey',
          0.2,
          'white',
          0.8,
          'white',
          0.95,
          'lightgrey',
          1,
          'grey',
        ]}
      />
    </React.Fragment>
  )
}
