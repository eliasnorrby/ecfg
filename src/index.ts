#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Manager, ModuleResourceList } from '@common/types'
import { log } from '@eliasnorrby/log-util'
import { NodePackageManager } from './managers/NodePackageManager'
import { ModuleLoader } from './services/ModuleLoader'

export function run(): void {
  log.info('Hello! This is a work in progress. Check back soon.')
  log.info('Learn more at: https://github.com/eliasnorrby/ecfg')
}

run()

function main() {
  // prompter
  // argsparser
  // moduleloader

  const modules = ['prettier', 'git']
  const options = { noInstall: false, force: false }
  const loader = new ModuleLoader(options)

  const managers: Manager[] = []

  const resources: ModuleResourceList[] = loader.loadAll(modules)

  // managers.push(
  //   new NodePackageManager({
  //     withLabel: (label: string) => {
  //       console.log(label)
  //       return this
  //     },
  //     run: async (command: string) => {
  //       console.log(command)
  //     },
  //   })
  // )

  resources.map((r) => managers.map((m) => m.register(r)))

  managers.map((m) => m.execute())
}

// main()
