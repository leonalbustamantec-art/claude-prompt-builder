import { BLOCKS } from '../data/blocks.js'

export function pickRandomChange(selectedIndices) {
  const categoryIndex = Math.floor(Math.random() * BLOCKS.length)
  const options = BLOCKS[categoryIndex].options
  const activeIndex = selectedIndices[categoryIndex]

  let optionIndex = Math.floor(Math.random() * (options.length - 1))
  if (optionIndex >= activeIndex) {
    optionIndex += 1
  }

  return { categoryIndex, optionIndex }
}
