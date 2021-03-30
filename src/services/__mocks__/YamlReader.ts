import {
  ConfigReader,
  ModuleContext,
  ModuleResourceConfigList,
} from '@common/types'

export const CONFIGS: { [Id: string]: ModuleResourceConfigList } = {
  prettier: {
    nodePackages: [
      {
        name: 'prettier',
        isDev: true,
      },
      {
        name: '@eliasnorrby/prettier-config',
        skipOnNoInstall: true,
      },
    ],
    files: [
      {
        name: 'prettier.config.js',
        source: 'prettier.config.js',
        noInstallFallback: 'prettier.default.config.js',
      },
    ],
  },
  git: {
    files: [
      {
        name: '.gitignore',
        source: 'gitignore',
      },
    ],
  },
  empty: {},
}

export class YamlReader implements ConfigReader {
  read(context: ModuleContext): ModuleResourceConfigList {
    if (!CONFIGS[context.name]) {
      throw new Error(`Could not read config for module ${context.name}`)
    }
    return CONFIGS[context.name]
  }
}
