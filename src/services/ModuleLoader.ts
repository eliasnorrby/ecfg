import {
  File,
  FileConfig,
  ModuleResourceConfigList,
  ModuleResourceList,
  NodePackage,
  NodePackageConfig,
  Options,
} from '@common/types'

export class ModuleLoader {
  private options: Options

  constructor(options: Options) {
    this.options = options
  }

  loadAllAndMerge(modules: string[]): ModuleResourceList {
    return this.merge(modules.map((m) => this.load(m)))
  }

  loadAll(modules: string[]): ModuleResourceList[] {
    return modules.map((m) => this.load(m))
  }

  private merge(listOfResourceLists: ModuleResourceList[]): ModuleResourceList {
    return {
      nodePackages: listOfResourceLists.flatMap((l) => l.nodePackages || []),
      nodeScripts: listOfResourceLists.flatMap((l) => l.nodeScripts || []),
      nodeFields: listOfResourceLists.flatMap((l) => l.nodeFields || []),
      files: listOfResourceLists.flatMap((l) => l.files || []),
      commands: listOfResourceLists.flatMap((l) => l.commands || []),
    }
  }

  private load(module: string): ModuleResourceList {
    const resources: ModuleResourceConfigList = read(module)
    return this.transform(resources)
  }

  private transform(resources: ModuleResourceConfigList): ModuleResourceList {
    return {
      nodePackages: this.transformNodePackages(resources.nodePackages),
      nodeScripts: resources.nodeScripts,
      nodeFields: resources.nodeFields,
      files: this.transformFiles(resources.files),
      commands: resources.commands,
    }
  }

  private transformNodePackages(
    packages: NodePackageConfig[] = []
  ): NodePackage[] {
    if (this.options.noInstall) {
      return packages.filter((p) => !p.skipOnNoInstall)
    }
    return packages
  }

  private transformFiles(files: FileConfig[] = []): File[] {
    if (this.options.noInstall) {
      return files
        .map((f) =>
          f.noInstallFallback ? { ...f, source: f.noInstallFallback } : f
        )
        .map((f) => {
          delete f.noInstallFallback
          return f
        })
    }
    return files
  }
}

function read(module: string): ModuleResourceConfigList {
  console.log(`read ${module}`)
  if (module === 'prettier') {
    return {
      nodePackages: [
        {
          name: '@eliasnorrby/prettier-config',
          isDev: true,
        },
      ],
    }
  } else {
    return {}
  }
}
