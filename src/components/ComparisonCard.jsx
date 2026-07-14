import { BLOCKS } from '../data/blocks.js'
import { CHANGE_EXPLANATIONS, SURPRISE_EXPLANATIONS } from '../data/changeExplanations.js'
import HighlightedStory from './HighlightedStory.jsx'
import './ComparisonCard.css'

function ComparisonCard({
  beforeStory,
  afterStory,
  categoryIndex,
  changedValueText,
  isSurprise,
  onChangeAnother,
  onRestart,
  onKeepAsBase,
}) {
  const block = BLOCKS[categoryIndex]
  const explanation = isSurprise
    ? SURPRISE_EXPLANATIONS[block.id](changedValueText)
    : CHANGE_EXPLANATIONS[block.id]

  return (
    <div className="comparison-card">
      <div className="comparison-card__section">
        <p className="comparison-card__label">Antes</p>
        <HighlightedStory text={beforeStory} />
      </div>

      <div className="comparison-card__section comparison-card__section--after">
        <p
          className={`comparison-card__label comparison-card__label--changed comparison-card__label--${block.id}`}
        >
          Después · {block.label}
        </p>
        <HighlightedStory text={afterStory} />
      </div>

      <p className="comparison-card__explanation">{explanation}</p>

      <div className="comparison-card__actions">
        <button type="button" onClick={onChangeAnother}>
          Cambiar otra pieza
        </button>
        <button type="button" onClick={onKeepAsBase}>
          Continuar usando la nueva historia como base
        </button>
        <button type="button" onClick={onRestart}>
          Volver a la construcción libre
        </button>
      </div>
    </div>
  )
}

export default ComparisonCard
