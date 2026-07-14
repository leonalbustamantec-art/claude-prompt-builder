const TAG_PATTERN = /<(personaje|accion|lugar|estilo)>([\s\S]*?)<\/\1>/g

export function parseHighlightedStory(rawStory) {
  const segments = []
  let lastIndex = 0
  let match

  TAG_PATTERN.lastIndex = 0
  while ((match = TAG_PATTERN.exec(rawStory)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: rawStory.slice(lastIndex, match.index), categoryId: null })
    }
    segments.push({ text: match[2], categoryId: match[1] })
    lastIndex = TAG_PATTERN.lastIndex
  }

  if (lastIndex < rawStory.length) {
    segments.push({ text: rawStory.slice(lastIndex), categoryId: null })
  }

  return segments.length > 0 ? segments : [{ text: rawStory, categoryId: null }]
}

export function stripHighlightTags(rawStory) {
  return rawStory.replace(TAG_PATTERN, '$2')
}
