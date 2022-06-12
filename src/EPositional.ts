import { PositionalOptions, PositionalOptionsType } from 'yargs'
import { isPositonalSymbol } from './common'

type ToExclude =
  //
  | 'type'
  // specific types
  | PositionalOptionsType
  // posible values
  | 'default'
  | 'choices'

type CommonOptions = Omit<PositionalOptions, ToExclude>

type Options<T> = CommonOptions & {
  default?: T
  choices?: T[]
}

type OptionsString = Options<string>
type OptionsNumber = Options<number>
type OptionsBoolean = Omit<Options<boolean>, 'choices'> // boolean options do not need choices

function definePositionalFactory<T extends 'string' | 'number' | 'boolean', V, OptionsV>(type: T) {
  return (name: string, options: OptionsV) => {
    return { [isPositonalSymbol]: true, name, options: { ...options, type } } as unknown as
      | V
      | undefined
  }
}

export const defineStringPositional = definePositionalFactory<'string', string, OptionsString>(
  'string'
)
export const defineNumberPositional = definePositionalFactory<'number', number, OptionsNumber>(
  'number'
)
export const defineBooleanPositional = definePositionalFactory<'boolean', boolean, OptionsBoolean>(
  'boolean'
)

export class EPositional {
  static string = defineStringPositional
  static number = defineNumberPositional
  static boolean = defineBooleanPositional
}
