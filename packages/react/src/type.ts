import { IFormOptions, IFormPayload, ISchema, IField } from '@uform/types'
import { Form } from '@uform/core'
import { IBroadcast } from '@uform/utils'

export interface IEvent extends React.SyntheticEvent {}

export interface EventTargetOption {
  selected: boolean
  value: any
}

export interface IEnhanceSchema extends ISchema {
  renderChildren?: Function
}

export interface FieldProps extends Omit<IField, 'editable'>, StateFieldProps {
  children?: React.ReactNode
  schema: IEnhanceSchema
  getOrderProperties: Function
  renderField: Function
  editable: boolean | ((name: string) => boolean)
}

export interface StateFieldProps {
  name: string
  schema: ISchema
  path: string[]
  schemaPath: any
  locale: { [key: string]: any }
  getSchema: Function
  form: Form
  // TODO mutators 文件应该暴露出来 interface
  mutators: any
}

export interface StateFieldState {
  value?: any
  props?: any
  errors?: any
  visible?: boolean
  loading?: boolean
  editable?: boolean
  required?: boolean
}

export interface SchemaFormProps extends IFormOptions {
  className?: string
  children?: React.ReactNode
  value?: any
  onChange?: (payload: IFormPayload) => void
}

export interface StateFormProps extends SchemaFormProps {
  broadcast: IBroadcast

  // eva
  implementActions: (actions: Object) => Object
  dispatch: (type: string, ...args: any) => void
  subscription: Function

  // ConfigProvider
  locale: Object
}
