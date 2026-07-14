import { BLOCKS } from '../data/blocks.js'
import './StorySummary.css'

const CONNECTORS = {
  personaje: { before: '' },
  accion: { before: 'que' },
  lugar: { before: '', after: ',' },
  estilo: { before: '' },
}

function StorySummary({ indices, highlightedCategoryIndex }) {
  return (
    <div className="story-summary">
      <p className="story-summary__title">Así construiste tu idea</p>
      <div className="story-summary__chips">
        {BLOCKS.map((block, i) => {
          const option = block.options[indices[i]]
          const isHighlighted = i === highlightedCategoryIndex
          const { before, after } = CONNECTORS[block.id]

          return (
            <div key={block.id} className="story-summary__piece">
              {before && <span className="story-summary__connector">{before}</span>}
              <div
                className={`story-summary__chip story-summary__chip--${block.id}${
                  isHighlighted ? ' story-summary__chip--highlighted' : ''
                }`}
              >
                <span className="story-summary__emoji">{option.emoji}</span>
                <span className="story-summary__text">{option.text}</span>
              </div>
              {after && (
                <span className="story-summary__connector story-summary__connector--suffix">
                  {after}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StorySummary
