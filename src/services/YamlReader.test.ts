import { log } from '@eliasnorrby/log-util'
import { Context } from '@common/Context'
import { YamlReader } from './YamlReader'

import fs from 'fs'

let reader: YamlReader

beforeEach(() => {
  reader = new YamlReader()
})

test('it can read a config', () => {
  const config = reader.read(new Context('prettier'))
  expect(config.nodePackages).toBeDefined()
})

test('it warns on file not found', () => {
  const config = reader.read(new Context('not-found'))
  expect(config).toEqual({})
  expect(log.warn).toHaveBeenCalled()
})

test('it warns when reading fails', () => {
  jest.spyOn(fs, 'readFileSync').mockImplementationOnce(() => {
    throw new Error('Failed to read')
  })

  const config = reader.read(new Context('prettier'))
  expect(config).toEqual({})
  expect(log.warn).toHaveBeenCalled()
})
