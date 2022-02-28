import handler from '../src/handler'
import makeServiceWorkerEnv from 'service-worker-mock'

declare let global: any;

describe('handle', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv())
    jest.resetModules()
  })

  test('handle status', async () => {
    const result = await handler.handle(new Request('/status', { method: 'GET' }))
    expect(result.status).toEqual(200)
    const text = await result.text()
    expect(text).toEqual('Ok')
  })
})
