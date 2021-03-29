import {
  Executor,
  Manager,
  ModuleResourceList,
  NodePackage,
} from '@common/types'
import hasYarn from 'has-yarn'

enum InstallCommand {
  NPM = 'npm install',
  YARN = 'yarn add',
}

export class NodePackageManager implements Manager {
  private dependencies: NodePackage[]
  private devDependencies: NodePackage[]
  private installCommand: InstallCommand
  private executor: Executor

  constructor(executor: Executor) {
    this.dependencies = []
    this.devDependencies = []
    this.installCommand = hasYarn() ? InstallCommand.YARN : InstallCommand.NPM
    this.executor = executor
  }

  register(resources: ModuleResourceList): void {
    if (resources.nodePackages) {
      this.dependencies = [
        ...this.dependencies,
        ...resources.nodePackages.filter((p) => !p.isDev),
      ]
      this.devDependencies = [
        ...this.devDependencies,
        ...resources.nodePackages.filter((p) => p.isDev),
      ]
    }
  }

  execute(): void {
    this.install(this.dependencies)
    this.install(this.devDependencies, '-D')
  }

  describe(): string {
    return `Will install ${this.dependencies.length} (${this.devDependencies.length}) dependencies using ${this.installCommand}.`
  }

  private names(dependencies: NodePackage[]) {
    return dependencies.map((d) => d.name).join(' ')
  }

  private install(dependencies: NodePackage[], flags = '') {
    if (dependencies.length < 1) return

    const command = [this.installCommand, flags, this.names(dependencies)]
      .filter((arg) => !!arg)
      .join(' ')

    this.executor.withLabel('Installing...').run(command)
  }
}
