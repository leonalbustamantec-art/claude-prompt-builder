import { parseHighlightedStory } from '../lib/parseHighlightedStory.js'
import './HighlightedStory.css'

function HighlightedStory({ text }) {
  const segments = parseHighlightedStory(text)

  return (
    <p className="highlighted-story">
      {segments.map((segment, i) =>
        segment.categoryId ? (
          <mark
            key={i}
            className={`highlighted-story__mark highlighted-story__mark--${segment.categoryId}`}
          >
            {segment.text}
          </mark>
        ) : (
          <span key={i}>{segment.text}</span>
        ),
      )}
    </p>
  )
}

export default HighlightedStory
