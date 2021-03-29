import { main } from './program'
import { log } from '@eliasnorrby/log-util'

it('it prints a message', () => {
  log.info = jest.fn()
  main()
  expect(log.info).toHaveBeenCalledTimes(1)
})
