import { useState } from 'react'
import { BLOCKS } from '../data/blocks.js'
import './CategoryPicker.css'

function CategoryPicker({ baselineIndices, loading, onSelectOption }) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(null)

  return (
    <div className="category-picker">
      <p className="category-picker__question">
        ¿Qué crees que pasará si cambias solo una pieza?
      </p>

      <div className="category-picker__categories">
        {BLOCKS.map((block, i) => (
          <button
            key={block.id}
            type="button"
            className={`category-picker__category category-picker__category--${block.id}${
              i === activeCategoryIndex ? ' category-picker__category--active' : ''
            }`}
            onClick={() => setActiveCategoryIndex(i)}
            disabled={loading}
          >
            {block.label}
          </button>
        ))}
      </div>

      {activeCategoryIndex !== null && (
        <div className="category-picker__options">
          {BLOCKS[activeCategoryIndex].options.map((option, optionIndex) => {
            if (optionIndex === baselineIndices[activeCategoryIndex]) {
              return null
            }

            return (
              <button
                key={optionIndex}
                type="button"
                className="category-picker__option"
                onClick={() => onSelectOption(activeCategoryIndex, optionIndex)}
                disabled={loading}
              >
                <span className="category-picker__emoji">{option.emoji}</span>
                <span className="category-picker__text">{option.text}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CategoryPicker
