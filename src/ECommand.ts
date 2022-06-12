import yargs, { CommandModule as YargsCommand } from 'yargs'
import { isOptionSymbol, isPositonalSymbol } from './common'
import { EOption } from './EOption'
import { EPositional } from './EPositional'
export { YargsCommand }

export abstract class ECommand {
  // string (or array of strings) that executes this command when given on the command line, first string may contain positional args
  static command: string | string[]
  // array of strings (or a single string) representing aliases of exports.command, positional args defined in an alias are ignored
  static aliases?: string[] | string
  // string used as the description for the command in help text, use false for a hidden command
  static describe?: string
  // a boolean (or string) to show deprecation notice.
  static deprecated?: string | boolean
  // subcommands of this command
  static subcommands?: Array<ECommand | YargsCommand>
  // extra builder
  static extraBuilder: (yargs: yargs.Argv) => yargs.Argv

  abstract run(): Promise<void> | void

  // helpers
  static string = EOption.string
  static number = EOption.number
  static boolean = EOption.boolean
  static array = EOption.array
  static count = EOption.count
  static positionalString = EPositional.string
  static positionalNumber = EPositional.number
  static positionalBoolean = EPositional.boolean

  private readonly C!: typeof ECommand
  constructor() {
    // @ts-ignore
    this.C = this.constructor
    if (!this.C.command) {
      const className = this.C.name || 'Anonymous'
      const msg = `static property \`command\` of type \`string | string[]\` must be defined on class ${className}`
      throw new Error(msg)
    }
  }

  optionPairs: [fieldName: string | symbol, argvName: string][] = []
  positionalPairs: [fieldName: string | symbol, argvName: string][] = []

  transform(): YargsCommand {
    this.optionPairs = []
    this.positionalPairs = []

    return {
      command: this.C.command,
      aliases: this.C.aliases,
      describe: this.C.describe,
      deprecated: this.C.deprecated,

      builder: (yargs) => {
        // subcommands
        ;(this.C.subcommands || [])
          .map((c) => {
            if (c instanceof ECommand) return c.transform()
            else return c
          })
          .forEach((c) => {
            yargs = yargs.command(c)
          })

        // positions arguments
        Reflect.ownKeys(this).forEach((k) => {
          if (this[k]?.[isPositonalSymbol]) {
            const { name, options } = this[k]
            yargs = yargs.positional(name, options)
            // connect
            this.positionalPairs.push([k, name])
          }
        })

        // options
        Reflect.ownKeys(this).forEach((k) => {
          if (this[k]?.[isOptionSymbol]) {
            // add 1 option
            const { name, options } = this[k]
            yargs = yargs.option(name, options)

            // connect
            this.optionPairs.push([k, name])
          }
        })

        // auto help
        yargs = yargs.help()

        // custom builder
        if (this.C.extraBuilder) {
          yargs = this.C.extraBuilder(yargs)
        }

        return yargs
      },

      handler: (argv) => {
        // attach value
        for (let [fieldName, argvName] of this.optionPairs) {
          this[fieldName] = argv[argvName]
        }
        for (let [fieldName, argvName] of this.positionalPairs) {
          this[fieldName] = argv[argvName]
        }
        return this.run()
      },
    }
  }
}
