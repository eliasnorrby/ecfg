import ora from 'ora'
import execa from 'execa'
import { log } from '@eliasnorrby/log-util'
import { Executor } from '@common/types'

const DEFAULT_LABEL = 'Processing...'

export class Execa implements Executor {
  private label: string = DEFAULT_LABEL

  withLabel(label: string): Execa {
    this.label = label
    return this
  }

  async run(command: string): Promise<void> {
    const spinner = this.spinner(this.label)
    try {
      spinner.start()
      // TODO: remove me
      log.fail('About to actually call execa!')
      process.exit(1)
      await execa.command(command)
      spinner.stop()
      this.label = DEFAULT_LABEL
    } catch (error) {
      spinner.stop()
      log.fail(error)
      process.exit(1)
    }
  }

  private spinner(label: string) {
    return ora({
      text: label,
      spinner: 'growHorizontal',
      color: 'blue',
    })
  }
}
