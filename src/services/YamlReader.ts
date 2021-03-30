import { log } from '@eliasnorrby/log-util'
import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'

import {
  ConfigReader,
  ModuleContext,
  ModuleResourceConfigList,
} from '@common/types'

const BASE_PATH = path.join(__dirname, '..', 'modules')
const CONFIG_FILE_NAME = 'config.yml'

export class YamlReader implements ConfigReader {
  read(context: ModuleContext): ModuleResourceConfigList {
    const configFile = this.configPath(context.name)
    if (!fs.existsSync(configFile)) {
      log.warn(
        `Could not find config for module: ${context.name} at ${configFile}`
      )
      return {}
    }
    try {
      const fileContents = fs.readFileSync(configFile, 'utf8')
      const data = yaml.load(fileContents)
      return data as ModuleResourceConfigList
    } catch (error) {
      log.warn(`Could not read config for module: ${context.name}`)
      return {}
    }
  }

  private configPath(module: string) {
    return path.join(BASE_PATH, module, CONFIG_FILE_NAME)
  }
}
