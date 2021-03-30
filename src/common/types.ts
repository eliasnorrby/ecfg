// A ResourceConfig is what is read from a module, a resource is what is
// handled by a manager. Sometimes ResourceConfigs differ from Resources,
// sometimes they don't.

export interface ModuleResourceList {
  nodePackages?: NodePackage[]
  nodeScripts?: NodeScript[]
  nodeFields?: NodeField[]
  files?: File[]
  commands?: Command[]
}

export interface ModuleResourceConfigList {
  nodePackages?: NodePackageConfig[]
  nodeScripts?: NodeScriptConfig[]
  nodeFields?: NodeFieldConfig[]
  files?: FileConfig[]
  commands?: CommandConfig[]
}

export interface NodePackage {
  name: string
  isDev?: boolean
  version?: string
  skipOnNoInstall?: boolean
}

export interface NodePackageConfig extends NodePackage {
  skipOnNoInstall?: boolean
}

export interface NodeScript {
  name: string
  script: string
}

export type NodeScriptConfig = NodeScript

export interface NodeField {
  name: string
  value: string
}

export type NodeFieldConfig = NodeField

export interface File {
  name: string
  content?: string
  source?: string
  append?: boolean
  noInstallFallback?: string
}

export interface FileConfig extends File {
  noInstallFallback?: string
}

export type Command = string

export type CommandConfig = Command

// ===

export interface Manager {
  register(resources: ModuleResourceList): void
  describe(): string
  execute(): void
}

export interface Module {
  resources(): ModuleResourceList[]
}

export interface Executor {
  withLabel(label: string): Executor
  run(command: string): Promise<void>
}

// ==

export interface Options {
  noInstall: boolean
  force: boolean
}

export interface ConfigReader {
  read(context: ModuleContext): ModuleResourceConfigList
}

export interface ModuleContext {
  name: string
  filesPath: string
  configPath: string
}
