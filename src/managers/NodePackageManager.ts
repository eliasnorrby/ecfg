import { Manager, ModuleResourceList, NodePackage } from '@common/types'

export class NodePackageManager implements Manager {
  private dependencies: NodePackage[] = []
  private devDependencies: NodePackage[] = []

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

  private names(dependencies: NodePackage[]) {
    return dependencies.map((d) => d.name).join(' ')
  }

  private install(dependencies: NodePackage[], flags = '') {
    if (dependencies.length < 1) return

    console.log(`npm install ${flags} ${this.names(dependencies)}`)
  }
}
