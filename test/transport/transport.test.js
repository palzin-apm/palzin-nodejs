const tap = require('tap')
const palzin = require('../../index')({
    ingestionKey: '',
    url: '',
    enable: false
})

async function transport_test (throwError = false) {
  tap.equal(palzin.conf.url === 'ingest.palzin.dev', true)

  const transaction = palzin.startTransaction('foo')
  tap.equal(palzin.currentTransaction().hash === transaction.hash, true)

  const segment = await palzin.addSegment(
    async (segment) => {
      await wait(3000)
      const arr = Array(1e6).fill('some string')
      arr.reverse()
      return segment
    },
    'test async',
    'test label',
  )

  transaction.end()
  palzin.flush()

  tap.equal(palzin.isRecording(), false)
  tap.equal(palzin.currentTransaction(), null)
}

function wait (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

transport_test()

