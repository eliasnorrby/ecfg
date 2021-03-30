import { FileConfig, NodePackageConfig, Options } from '@common/types'
import { ModuleLoader } from './ModuleLoader'
import { CONFIGS } from './__mocks__/YamlReader'

jest.mock('./YamlReader')

let loader: ModuleLoader

const options: Options = {
  noInstall: false,
  force: false,
}

beforeEach(() => {
  loader = new ModuleLoader(options)
})

test('can load a single module', () => {
  const list = loader.loadAll(['prettier'])
  expect(list[0].nodePackages).toEqual(CONFIGS['prettier'].nodePackages)
})

test('can load multiple modules', () => {
  const list = loader.loadAll(['prettier', 'git'])
  const gitFile = partialFileObjectFromModule('git')

  expect(list[0].nodePackages).toEqual(CONFIGS['prettier'].nodePackages)
  expect(list[1].files).toEqual(
    expect.arrayContaining([expect.objectContaining(gitFile)])
  )
})

test('can merge configs', () => {
  const list = loader.loadAllAndMerge(['prettier', 'git'])
  const gitFile = partialFileObjectFromModule('git')
  const prettierFile = partialFileObjectFromModule('prettier')

  expect(list.nodePackages).toEqual(CONFIGS['prettier'].nodePackages)
  expect(list.files).toEqual(
    expect.arrayContaining([
      expect.objectContaining(gitFile),
      expect.objectContaining(prettierFile),
    ])
  )
})

test('handles noInstall option for files', () => {
  loader = new ModuleLoader({
    ...options,
    noInstall: true,
  })
  const prettierFallbackFile = partialFileObjectFromModule(
    'prettier',
    'noInstallFallback'
  )

  const list = loader.loadAll(['prettier'])

  expect(list[0].files).toEqual(
    expect.arrayContaining([expect.objectContaining(prettierFallbackFile)])
  )
})

test('handles noInstall option for packages', () => {
  loader = new ModuleLoader({
    ...options,
    noInstall: true,
  })

  const prettierNoInstallPackage = partialPackageObjectFromModule(
    'prettier',
    'skipOnNoInstall'
  )

  const list = loader.loadAll(['prettier'])

  expect(list[0].nodePackages).toEqual(
    expect.not.arrayContaining([
      expect.objectContaining(prettierNoInstallPackage),
    ])
  )
})

test.todo('it transforms file paths')

function partialFileObjectFromModule(
  module: string,
  key: keyof FileConfig = 'name'
) {
  return { name: CONFIGS[module].files?.find((f) => !!f[key])?.name }
}

function partialPackageObjectFromModule(
  module: string,
  key: keyof NodePackageConfig = 'name'
) {
  return { name: CONFIGS[module].nodePackages?.find((f) => !!f[key])?.name }
}
