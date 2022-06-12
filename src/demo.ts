import yargs from 'yargs'
import { ECommand } from './ECommand'
import { EOption } from './EOption'

class TeaCommand extends ECommand {
  static command = 'tea <...files>'
  static aliases?: string | string[] = 't'
  static describe?: string = 'a tea command'

  // flags
  yes = EOption.boolean('yes', { alias: 'y', default: false })

  quality = EOption.number('quality', {
    describe: '质量塞',
    alias: ['q'],
    choices: [120, 240, 360],
  })

  files = ECommand.positionalString('files', {
    alias: 'f',
    desc: 'files to include',
    array: true,
    demandOption: true,
  })

  async run() {
    const { yes, quality } = this
    console.log(yes, quality)
    console.log(this.files)
    throw new Error('Method not implemented.')
  }
}

yargs
  //
  .scriptName('some-demo')
  .command(new TeaCommand().transform())
  .demandCommand()
  .help().argv
