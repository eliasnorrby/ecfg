import { Context } from '@common/Context'
import {
  ConfigReader,
  File,
  FileConfig,
  ModuleContext,
  ModuleResourceConfigList,
  ModuleResourceList,
  NodePackage,
  NodePackageConfig,
  Options,
} from '@common/types'
import { YamlReader } from './YamlReader'

export class ModuleLoader {
  private options: Options
  private reader: ConfigReader
  private context: ModuleContext | null

  constructor(options: Options, reader?: ConfigReader) {
    this.options = options
    this.reader = reader || new YamlReader()
    this.context = null
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
    this.context = new Context(module)
    const resources = this.reader.read(this.context)
    const transformedResources = this.transform(resources)
    this.resetContext()
    return transformedResources
  }

  private resetContext() {
    this.context = null
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
    return files
      .map((f) =>
        this.options.noInstall && f.noInstallFallback
          ? { ...f, source: f.noInstallFallback }
          : f
      )
      .map((f) => this.addContextPath(f))
  }

  private addContextPath(file: FileConfig): FileConfig {
    if (!this.context) {
      throw new Error('Context is null, cannot add path.')
    }
    return {
      ...file,
      source: `${this.context.filesPath}/${file.source}`,
    }
  }
}
