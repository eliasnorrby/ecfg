import { NodeFieldManager } from './NodeFieldManager'
import { PackageJsonService } from '../services/PackageJsonService'

const PUBLISH = {
  name: 'publishConfig',
  value: 'public',
}

let nfm: NodeFieldManager
const pkgIo = new PackageJsonService()
pkgIo.read = jest.fn(() => pkg())
pkgIo.write = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  nfm = new NodeFieldManager(pkgIo)
})

test('it registers a field', () => {
  register()

  expect(nfm.describe()).toMatch(/1/)
})

test('it writes a field', () => {
  register()

  nfm.execute()

  expect(pkgIo.write).toHaveBeenCalledTimes(1)
  expect(pkgIo.write).toHaveBeenCalledWith(
    expect.objectContaining({
      [PUBLISH.name]: PUBLISH.value,
    })
  )
})

test('it writes multiple fields', () => {
  register()
  register('author', 'somebody')

  nfm.execute()

  expect(pkgIo.write).toHaveBeenCalledWith(
    expect.objectContaining({
      [PUBLISH.name]: PUBLISH.value,
      author: 'somebody',
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

function register(name = PUBLISH.name, value = PUBLISH.value): void {
  nfm.register({
    nodeFields: [
      {
        name,
        value,
      },
    ],
  })
}
