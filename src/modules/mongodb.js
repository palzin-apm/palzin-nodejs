'use strict'

module.exports = (mongodb, palzin, version = null) => {
  const listener = mongodb.instrument()
  const activeSegments = new Map()

  listener.on('started', onStart)
  listener.on('succeeded', onEnd)
  listener.on('failed', onEnd)

  return mongodb

  function onStart (event) {
    if (palzin.isRecording()) {
      const name = [
        event.databaseName,
        collectionFor(event),
        event.commandName
      ].join('.')

      let segment = palzin.startSegment('mongodb')
      segment._label = name

      if (segment) {
        activeSegments.set(event.requestId, segment)
      }
    }
  }

  function onEnd (event) {
    if (!activeSegments.has(event.requestId)) return
    const segment = activeSegments.get(event.requestId)
    activeSegments.delete(event.requestId)
    segment.end(segment._start  + event.duration)
  }

  function collectionFor (event) {
    const collection = event.command[event.commandName]
    return typeof collection === 'string' ? collection : '$cmd'
  }
}
