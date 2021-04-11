import { PackageJson } from '@common/types'
import { PackageJsonService } from '../services/PackageJsonService'
import { NodeScriptManager } from './NodeScriptManager'

const FORMAT = {
  name: 'format',
  script: 'prettier --write .',
}

let nsm: NodeScriptManager
const pkgIo = new PackageJsonService()
pkgIo.read = jest.fn(() => pkg())
pkgIo.write = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  nsm = new NodeScriptManager(pkgIo)
})

test('it registers a script', () => {
  register(FORMAT.name, FORMAT.script)

  expect(nsm.describe()).toMatch(/1/)
})

test('it writes a script', () => {
  register(FORMAT.name, FORMAT.script)

  nsm.execute()

  expect(pkgIo.read).toHaveBeenCalledTimes(1)
  expect(pkgIo.write).toHaveBeenCalledWith({
    scripts: {
      ...pkg().scripts,
      [FORMAT.name]: FORMAT.script,
    },
  })
})

test('it writes multiple scripts', () => {
  register('build', 'tsc .')
  register('lint', 'eslint src')

  nsm.execute()

  expect(pkgIo.write).toHaveBeenCalledWith({
    scripts: expect.objectContaining({
      build: 'tsc .',
      lint: 'eslint src',
    }),
  })
})

test('it throws on duplicate script entries', () => {
  register(FORMAT.name, FORMAT.script)
  register(FORMAT.name, 'another script')

  expect(() => nsm.execute()).toThrow()
})

test('it overwrites existing scripts', () => {
  register('test', 'jest --coverage')

  nsm.execute()

  expect(pkgIo.write).toHaveBeenCalledWith({
    scripts: {
      test: 'jest --coverage',
    },
  })
})

test('it does nothing if no scripts are registered', () => {
  nsm.register({
    nodePackages: [
      {
        name: 'prettier',
      },
    ],
  })

  nsm.execute()

  expect(pkgIo.write).not.toHaveBeenCalled()
})

test('it creates the script section if it does not exist', () => {
  pkgIo.read = jest.fn(
    () =>
      ({
        dependencies: {
          prettier: '2.0.0',
        },
      } as PackageJson)
  )

  register(FORMAT.name, FORMAT.script)

  nsm.execute()

  expect(pkgIo.write).toHaveBeenCalledWith(
    expect.objectContaining({
      scripts: {
        [FORMAT.name]: FORMAT.script,
      },
    })
  )
})

function pkg() {
  return {
    scripts: {
      test: 'jest',
    },
  }
}

function register(name: string, script: string): void {
  nsm.register({
    nodeScripts: [
      {
        name,
        script,
      },
    ],
  })
}
