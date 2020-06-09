import React from 'react'

import { Image } from 'react-konva'
import { Keyframes, animated } from 'react-spring/renderprops'

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

  const startAtFull = startAt * lineHeight
  const stopAtFull = stopAt * lineHeight

  const ReelContainer = Keyframes.Spring({
    start: async (next) => {
      await next({
        from: { y: startAtFull },
        to: { y: startAtFull - 60 },
      })
      await next({
        from: { y: startAtFull - 60 },
        to: { y: startAtFull + 151 * 5 },
      })
    },

    spinning: async (next) => {
      while (true) {
        await next({
          from: { y: 0 },
          to: { y: 50 * 75 },
        })
      }
    },

    stop: async (next) => {
      await next({
        from: { y: 0 },
        to: { y: stopAtFull + 150 },
      })
      await next({
        from: { y: stopAtFull + 150 },
        to: { y: stopAtFull },
      })
    },

    stopped: async (next) => {
      await next({
        from: { y: stopAtFull },
        to: { y: stopAtFull },
      })
    },
  })

  const Content = props => {
    return (
      <AnimatedGroup y={props.y}>
        {reel.map((s, index) => {
          return (<Image
            key={`symbol-${index}`}
            stroke={stroke}
            x={x}
            y={lineHeight * index - (reel.length - 3) * lineHeight}
            image={images[s]}
          />)
        }
        )}
      </AnimatedGroup>
    )
  }

  return (
    <ReelContainer state={state} reset native config={{ duration: 500 }}>
      {Content}
    </ReelContainer>
  )
}

export default Reel