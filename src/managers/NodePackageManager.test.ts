import { NodePackageManager } from './NodePackageManager'
import { Execa } from '../services/Execa'

let npm: NodePackageManager

const execa = new Execa()
execa.run = jest.fn()

let hasYarn = false
jest.mock('has-yarn', () => {
  return jest.fn(() => hasYarn)
})

beforeEach(() => {
  jest.clearAllMocks()
  hasYarn = false
  npm = new NodePackageManager(execa)
})

test('it registers a package', () => {
  registerDev('prettier')

  expect(npm.describe()).toMatch(/0 \(1\)/)
})

test('it installs a package', () => {
  registerDev('prettier')

  npm.execute()

  expect(execa.run).toHaveBeenCalledTimes(1)
  expect(execa.run).toHaveBeenCalledWith('npm install -D prettier')
})

test('it registers multiple packages properly', () => {
  register('jest')
  registerDev('prettier')
  registerDev('husky')
  expect(npm.describe()).toMatch(/1 \(2\)/)
})

test('it installs multiple packages', () => {
  register('jest')
  registerDev('prettier')
  registerDev('husky')

  npm.execute()

  expect(execa.run).toHaveBeenCalledTimes(2)
  expect(execa.run).toHaveBeenNthCalledWith(1, 'npm install jest')
  expect(execa.run).toHaveBeenNthCalledWith(2, 'npm install -D prettier husky')
})

it('uses yarn when appropriate', () => {
  hasYarn = true

  npm = new NodePackageManager(execa)
  register('jest')

  expect(npm.describe()).toMatch(/yarn add/)

  npm.execute()

  expect(execa.run).toHaveBeenCalledTimes(1)
  expect(execa.run).toHaveBeenCalledWith('yarn add jest')
})

it('does nothing if no packages are registered', () => {
  npm.register({
    nodeScripts: [
      {
        name: 'format',
        script: 'prettier --write .',
      },
    ],
  })

  expect(execa.run).not.toHaveBeenCalled()
})

function register(dependency: string, isDev = false): void {
  npm.register({
    nodePackages: [
      {
        name: dependency,
        isDev,
      },
    ],
  })
}

function registerDev(dependency: string): void {
  register(dependency, true)
}
