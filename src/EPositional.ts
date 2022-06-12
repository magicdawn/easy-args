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
  //
  // http://yargs.js.org/docs/#api-reference-positionalkey-opt
  // 不好使的选项, 在 yargs 文档中不包含, 但 @types/yargs 中有的, 这里剔除一下
  // 需要在 command 中指定, 如 <files..>
  // 尖括号表示 demand, ..表示 array
  //
  | 'array'
  | 'demandOption'

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
