import yargs from 'yargs'
import { ECommand } from './ECommand'
import { EOption } from './EOption'

class TeaCommand extends ECommand {
  // static command = 'tea <files..>'
  static command = 'tea'
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
  })

  async run() {
    const { yes, quality } = this
    console.log(yes, quality)
    console.log(this.files)
  }
}

//
yargs
  //
  .scriptName('some-demo')
  .command(new TeaCommand().transform())
  .demandCommand()
  .alias({ h: 'help', v: 'version' }) // just works fine with this
  .help().argv
