import {
  ConfigReader,
  ModuleContext,
  ModuleResourceConfigList,
} from '@common/types'

export class YamlReader implements ConfigReader {
  read(context: ModuleContext): ModuleResourceConfigList {
    console.log(`reading ${context.name}`)
    return {}
  }
}
