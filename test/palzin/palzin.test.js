const tap = require('tap')

const palzin = require('../../index')({
  ingestionKey: '',
  url: '',
  enable: false
})

async function palzin_test (throwError = false) {
  tap.equal(palzin.conf.url === 'ingest.palzin.dev', true)

  const transaction = palzin.startTransaction('foo')
  tap.equal(palzin.currentTransaction().hash === transaction.hash, true)

  const segment = await palzin.addSegment(
    async (segment) => {
      await wait(500)
      const arr = Array(1e6).fill('some string')
      arr.reverse()
      return segment
    },
    'test async',
    'test label',
  )

  let errorThrowed = false
  let segmentEx = null
  try {
    segmentEx = await palzin.addSegment(
      async (segment) => {
        throw new Error('generic error')
      },
      'test async',
      'test label',
      throwError
    )
  } catch (e) {
    errorThrowed = true
  }

  transaction.end()
  if (throwError) {
    tap.equal(errorThrowed, true)
  } else {
    tap.equal(errorThrowed, false)
  }

  palzin.flush()

  tap.equal(palzin.isRecording(), false)
  tap.equal(palzin.currentTransaction(), null)
}

function palzin_test_transactionNotEnd () {
  const transaction = palzin.startTransaction('foo')

  tap.equal(palzin.currentTransaction().hash === transaction.hash, true)

}

function wait (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

palzin_test()
palzin_test(true)
palzin_test_transactionNotEnd()

