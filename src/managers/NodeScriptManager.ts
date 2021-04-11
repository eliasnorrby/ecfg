import {
  Manager,
  ModuleResourceList,
  NodeScript,
  PackageJsonIO,
  PackageJsonScript,
} from '@common/types'

export class NodeScriptManager implements Manager {
  private scripts: NodeScript[]
  private pkgIo: PackageJsonIO

  constructor(pkgIo: PackageJsonIO) {
    this.scripts = []
    this.pkgIo = pkgIo
  }

  register(resources: ModuleResourceList): void {
    if (resources.nodeScripts) {
      this.scripts = [...this.scripts, ...resources.nodeScripts]
    }
  }

  describe(): string {
    return `Will add ${this.scripts.length} scripts.`
  }

  execute(): void {
    if (this.scripts.length < 1) return

    this.validateScripts()
    const pkgJson = this.pkgIo.read()

    const scripts: PackageJsonScript = {}

    this.scripts.forEach((script) => (scripts[script.name] = script.script))

    this.pkgIo.write({
      ...pkgJson,
      scripts: {
        ...pkgJson.scripts,
        ...scripts,
      },
    })
  }

  private validateScripts(): void {
    const seen = new Set()
    const hasDuplicates = this.scripts.some(
      (script) => seen.size === seen.add(script.name).size
    )
    if (hasDuplicates) {
      throw new Error('Duplicate script names detected')
    }
  }
}
