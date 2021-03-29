import { Manager, ModuleResourceList } from '@common/types'
import { log } from '@eliasnorrby/log-util'
import { NodePackageManager } from './managers/NodePackageManager'
import { Execa } from './services/Execa'
import { ModuleLoader } from './services/ModuleLoader'

export function main(): void {
  // prompter
  // argsparser
  // moduleloader

  const modules = ['prettier', 'git']
  const options = { noInstall: false, force: false }
  const loader = new ModuleLoader(options)

  const managers: Manager[] = []

  const resources: ModuleResourceList[] = loader.loadAll(modules)

  managers.push(new NodePackageManager(new Execa()))

  resources.map((r) => managers.map((m) => m.register(r)))

  managers.map((m) => log.info(m.describe()))
}
