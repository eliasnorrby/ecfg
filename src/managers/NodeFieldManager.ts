import {
  Manager,
  ModuleResourceList,
  NodeField,
  PackageJsonIO,
} from '@common/types'

export class NodeFieldManager implements Manager {
  private fields: NodeField[]
  private pkgIo: PackageJsonIO

  constructor(pkgIo: PackageJsonIO) {
    this.fields = []
    this.pkgIo = pkgIo
  }

  register(resources: ModuleResourceList): void {
    if (resources.nodeFields) {
      this.fields = [...this.fields, ...resources.nodeFields]
    }
  }

  describe(): string {
    return `Will add ${this.fields.length} fields.`
  }

  execute(): void {
    if (this.fields.length < 1) return

    const pkgJson = this.pkgIo.read()

    const fields: { [key: string]: string } = {}

    this.fields.forEach(({ name, value }) => (fields[name] = value))

    this.pkgIo.write({
      ...pkgJson,
      ...fields,
    })
  }
}
