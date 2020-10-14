import { run } from './index'
import { log } from '@eliasnorrby/log-util'

test('it prints a message', () => {
  log.info = jest.fn()
  run()
  expect(log.info).toHaveBeenCalledTimes(1)
})
