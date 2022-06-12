import yargs, { PositionalOptionsType } from 'yargs'
import { isOptionSymbol } from './common'

// type =
// 'array': synonymous for array: true, see array()
// 'boolean': synonymous for boolean: true, see boolean()
// 'count': synonymous for count: true, see count()
// 'number': synonymous for number: true, see number()
// 'string': synonymous for string: true, see string()
type OptionTypeText = Exclude<yargs.Options['type'], undefined>

type ToExclude =
  //
  | 'type'
  // specific types
  | OptionTypeText
  // posible values
  | 'default'
  | 'choices'

type CommonOptions = Omit<yargs.Options, ToExclude>

type Options<T> = CommonOptions & {
  default?: T
  choices?: T[]
}

type OptionsString = Options<string>
type OptionsNumber = Options<number>
type OptionsBoolean = Omit<Options<boolean>, 'choices'> // boolean options does not need `choices`

const defineOptionFactory = <T extends PositionalOptionsType, V, OptionsV>(type: T) => {
  return (name: string, options: OptionsV) => {
    type Ret = V | undefined
    return { [isOptionSymbol]: true, name, options: { ...options, type } } as unknown as Ret
  }
}

const defineStringOption = defineOptionFactory<'string', string, OptionsString>('string')
const defineNumberOption = defineOptionFactory<'number', number, OptionsNumber>('number')
const defineBooleanOption = defineOptionFactory<'boolean', boolean, OptionsBoolean>('boolean')

// complex
const defineArrayOption = (name: string, options: CommonOptions) => {
  return {
    [isOptionSymbol]: true,
    name,
    options: { ...options, type: 'array' },
  } as unknown as string[]
}

// -v 	=>	v=1
// -vv 	=> 	v=2
// -vvv => 	v=3
const defineCountOption = (name: string, options: CommonOptions) => {
  return {
    [isOptionSymbol]: true,
    name,
    options: { ...options, type: 'count' },
  } as unknown as number
}

export class EOption {
  static string = defineStringOption
  static number = defineNumberOption
  static boolean = defineBooleanOption
  static array = defineArrayOption
  static count = defineCountOption
}
