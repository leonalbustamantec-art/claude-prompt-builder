import './Block.css'

function Block({ block, selectedIndex, onPrev, onNext }) {
  const option = block.options[selectedIndex]

  return (
    <div className={`block block--${block.id}`}>
      <p className="block__label">{block.label}</p>
      <div className="block__body">
        <button
          type="button"
          className="block__arrow"
          onClick={onPrev}
          aria-label="Opción anterior"
        >
          ◀
        </button>
        <div className="block__option" key={selectedIndex}>
          <span className="block__emoji">{option.emoji}</span>
          <span className="block__text">{option.text}</span>
        </div>
        <button
          type="button"
          className="block__arrow"
          onClick={onNext}
          aria-label="Siguiente opción"
        >
          ▶
        </button>
      </div>
    </div>
  )
}

export default Block
