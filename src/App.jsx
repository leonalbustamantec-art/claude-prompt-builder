import { useState } from 'react'
import Block from './components/Block.jsx'
import StorySummary from './components/StorySummary.jsx'
import CategoryPicker from './components/CategoryPicker.jsx'
import ComparisonCard from './components/ComparisonCard.jsx'
import HighlightedStory from './components/HighlightedStory.jsx'
import { BLOCKS } from './data/blocks.js'
import { generateStory } from './lib/generateStory.js'
import { pickRandomChange } from './lib/pickRandomChange.js'
import { stripHighlightTags } from './lib/parseHighlightedStory.js'
import './App.css'

const INITIAL_INDICES = [0, 0, 0, 0]

function App() {
  const [selectedIndices, setSelectedIndices] = useState(INITIAL_INDICES)
  const [loading, setLoading] = useState(false)
  const [baseline, setBaseline] = useState(null)
  const [comparison, setComparison] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [justConfirmedCategoryIndex, setJustConfirmedCategoryIndex] = useState(null)

  const handlePrev = (blockIndex) => {
    setSelectedIndices((prev) => {
      const next = [...prev]
      const optionsLength = BLOCKS[blockIndex].options.length
      next[blockIndex] = (prev[blockIndex] - 1 + optionsLength) % optionsLength
      return next
    })
  }

  const handleNext = (blockIndex) => {
    setSelectedIndices((prev) => {
      const next = [...prev]
      const optionsLength = BLOCKS[blockIndex].options.length
      next[blockIndex] = (prev[blockIndex] + 1) % optionsLength
      return next
    })
  }

  const [personaje, accion, lugar, estilo] = BLOCKS.map(
    (block, i) => block.options[selectedIndices[i]],
  )

  const previewText = `${personaje.text} ${accion.text} ${lugar.text} ${estilo.text}.`

  const generateStoryForIndices = async (indices) => {
    const [p, a, l, e] = BLOCKS.map((block, i) => block.options[indices[i]])
    return generateStory({
      personaje: p.text,
      accion: a.text,
      lugar: l.text,
      estilo: e.text,
    })
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)

    try {
      const generatedStory = await generateStoryForIndices(selectedIndices)
      setBaseline({ indices: selectedIndices, story: generatedStory })
      setComparison(null)
    } catch {
      setError('¡Ups! Algo salió mal. Intenta de nuevo.')
      setBaseline(null)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedIndices(INITIAL_INDICES)
    setBaseline(null)
    setComparison(null)
    setError(null)
    setJustConfirmedCategoryIndex(null)
  }

  const handleTryChange = async (categoryIndex, optionIndex, isSurprise = false) => {
    const newIndices = [...baseline.indices]
    newIndices[categoryIndex] = optionIndex

    setLoading(true)
    setError(null)

    try {
      const generatedStory = await generateStoryForIndices(newIndices)
      setComparison({ indices: newIndices, categoryIndex, story: generatedStory, isSurprise })
    } catch {
      setError('¡Ups! Algo salió mal. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleSurprise = () => {
    const { categoryIndex, optionIndex } = pickRandomChange(baseline.indices)
    handleTryChange(categoryIndex, optionIndex, true)
  }

  const handleDiscardComparison = () => {
    setComparison(null)
  }

  const handleKeepComparison = () => {
    setBaseline(comparison)
    setSelectedIndices(comparison.indices)
    setJustConfirmedCategoryIndex(comparison.categoryIndex)
    setComparison(null)
    setTimeout(() => setJustConfirmedCategoryIndex(null), 1500)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(stripHighlightTags(baseline.story))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="app">
      <h1 className="app__title">Construye tu idea</h1>

      <div className="app__layout">
        <div className="app__blocks">
          {BLOCKS.map((block, i) => (
            <Block
              key={block.id}
              block={block}
              selectedIndex={selectedIndices[i]}
              onPrev={() => handlePrev(i)}
              onNext={() => handleNext(i)}
            />
          ))}
        </div>

        <div className="app__panel">
          <p className="app__preview">{previewText}</p>

          <button
            type="button"
            className="app__generate"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Inventando tu historia…' : 'Generar historia'}
          </button>

          {loading && <p className="app__waiting">La IA está inventando tu historia…</p>}

          {error && <p className="app__error">{error}</p>}

          {baseline && !loading && !comparison && (
            <div className="app__result">
              <HighlightedStory text={baseline.story} />
              <div className="app__result-actions">
                <button type="button" onClick={handleCopy}>
                  {copied ? '¡Copiado!' : 'Copiar idea'}
                </button>
                <button type="button" onClick={handleReset}>
                  Empezar de nuevo
                </button>
              </div>
            </div>
          )}

          {baseline && (
            <>
              <StorySummary
                indices={comparison ? comparison.indices : baseline.indices}
                highlightedCategoryIndex={
                  comparison ? comparison.categoryIndex : justConfirmedCategoryIndex
                }
              />

              {comparison === null ? (
                <div className="app__experiment">
                  <CategoryPicker
                    baselineIndices={baseline.indices}
                    loading={loading}
                    onSelectOption={handleTryChange}
                  />
                  <button
                    type="button"
                    className="app__surprise"
                    onClick={handleSurprise}
                    disabled={loading}
                  >
                    🎲 Sorpréndeme
                  </button>
                </div>
              ) : (
                <ComparisonCard
                  beforeStory={baseline.story}
                  afterStory={comparison.story}
                  categoryIndex={comparison.categoryIndex}
                  changedValueText={(() => {
                    const value =
                      BLOCKS[comparison.categoryIndex].options[
                        comparison.indices[comparison.categoryIndex]
                      ].text
                    return value.charAt(0).toLowerCase() + value.slice(1)
                  })()}
                  isSurprise={comparison.isSurprise}
                  onChangeAnother={handleDiscardComparison}
                  onRestart={handleReset}
                  onKeepAsBase={handleKeepComparison}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
