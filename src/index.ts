#!/usr/bin/env node

import { log } from '@eliasnorrby/log-util'
import { main } from './program'

export function run(): void {
  log.info('Hello! This is a work in progress. Check back soon.')
  log.info('Learn more at: https://github.com/eliasnorrby/ecfg')
}

run()

main()
