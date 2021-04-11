import { PackageJsonIO } from '@common/types'
import { PackageJsonService } from './PackageJsonService'
import { mocked } from 'ts-jest/utils'
import fs from 'fs'

jest.mock('fs')

let pkgIo: PackageJsonIO

beforeEach(() => {
  jest.clearAllMocks()
  pkgIo = new PackageJsonService()
  mocked(fs.existsSync).mockReturnValue(true)
})

test('it throws when no package.json is found', () => {
  mocked(fs.existsSync).mockReturnValueOnce(false)
  expect(() => pkgIo.read()).toThrow()
})

test('it reads package.json', () => {
  mocked(fs.readFileSync).mockReturnValueOnce('{"scripts":{"test":"jest"}}')
  const pkg = pkgIo.read()
  expect(pkg.scripts?.test).toBe('jest')
})

test('it writes package.json', () => {
  const pkg = {
    scripts: {
      build: 'tsc .',
    },
  }

  pkgIo.write(pkg)

  expect(fs.writeFileSync).toHaveBeenCalled()
})
