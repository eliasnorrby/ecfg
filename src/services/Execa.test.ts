import { Executor } from '@common/types'
import { DEFAULT_LABEL, Execa } from './Execa'
import { command } from 'execa'
import ora from 'ora'

jest.mock('execa')
jest.mock('ora', () =>
  jest.fn(() => ({
    start: () => jest.fn(),
    stop: () => jest.fn(),
  }))
)

const mockedCommand = (command as unknown) as jest.Mock<typeof command>
const mockedOra = (ora as unknown) as jest.Mock<typeof ora>

let ex: Executor

beforeEach(() => {
  jest.clearAllMocks()
  ex = new Execa()
})

test('it runs a command', () => {
  ex.run('ls')
  expect(mockedCommand).toHaveBeenCalledWith('ls')
})

test('it displays a label', () => {
  const label = 'Washing dishes...'
  ex.withLabel(label).run('ls')
  expectLabel(label)
})

test('it exits on error', () => {
  mockCommandError()
  const mockedExit = jest.spyOn(process, 'exit').mockImplementation(() => {
    return undefined as never
  })
  ex.run('problematic command')
  expect(mockedExit).toHaveBeenCalledWith(1)
})

test('it resets the label on both success and failure', async () => {
  await ex.withLabel('One').run('ls')
  await ex.run('git status')
  mockCommandError()
  await ex.withLabel('Crashing').run('broken')
  await ex.run('ls')

  expectNthLabel(1, 'One')
  expectNthLabel(2, DEFAULT_LABEL)
  expectNthLabel(3, 'Crashing')
  expectNthLabel(2, DEFAULT_LABEL)
})

function expectLabel(label: string) {
  return expect(mockedOra).toHaveBeenCalledWith(
    expect.objectContaining({
      text: label,
    })
  )
}

function expectNthLabel(nth: number, label: string) {
  return expect(mockedOra).toHaveBeenNthCalledWith(
    nth,
    expect.objectContaining({
      text: label,
    })
  )
}

function mockCommandError() {
  mockedCommand.mockImplementationOnce(() => {
    throw new Error('Ooops')
  })
}
