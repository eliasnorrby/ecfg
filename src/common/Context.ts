import { ModuleContext } from './types'
import path from 'path'

export class Context implements ModuleContext {
  name: string
  filesPath: string
  configPath: string

  constructor(module: string) {
    this.name = module
    this.filesPath = path.join(__dirname, 'modules', module, 'files')
    this.configPath = path.join(__dirname, 'modules', 'config.yml')
  }
}
