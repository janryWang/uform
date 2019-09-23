import React, { useMemo } from 'react'
import { ISchemaFormProps } from '../types'
import {
  useForm,
  Form,
  createFormActions,
  createAsyncFormActions
} from '@uform/react'
import { Schema } from '../shared/schema'
import { SchemaField } from './SchemaField'
import { deprecate } from '@uform/shared'
import {
  useEva,
  mergeActions,
  createActions,
  createAsyncActions
} from 'react-eva'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '../types'
import SchemaContext, { FormItemContext } from '../context'

const EmptyItem = ({ children }) => children

export const createSchemaFormActions = (): ISchemaFormActions =>
  mergeActions(
    createFormActions(),
    createActions('getSchema', 'getFormSchema')
  ) as ISchemaFormActions

export const createAsyncSchemaFormActions = (): ISchemaFormAsyncActions =>
  mergeActions(
    createAsyncFormActions(),
    createAsyncActions('getSchema', 'getFormSchema')
  ) as ISchemaFormAsyncActions

export const SchemaForm: React.FC<ISchemaFormProps> = props => {
  const {
    components,
    component,
    schema,
    value,
    initialValues,
    actions,
    effects,
    onChange,
    onSubmit,
    onReset,
    onValidateFailed,
    useDirty,
    children,
    editable,
    validateFirst,
    ...innerProps
  } = props
  const { implementActions } = useEva({
    actions
  })
  const newSchema = useMemo(() => {
    const result = new Schema(schema)
    implementActions({
      getSchema: deprecate(() => result, 'Please use the getFormSchema.'),
      getFormSchema: () => result
    })
    return result
  }, [schema])
  const newForm = useForm(props)
  const FormItemComponent =
    components && components.formItem ? components.formItem : EmptyItem
  const FormComponent =
    components && components.form ? components.form : component

  return (
    <FormItemContext.Provider value={FormItemComponent}>
      <SchemaContext.Provider value={newSchema}>
        <Form {...props} form={newForm}>
          {React.createElement(
            FormComponent,
            {
              ...innerProps,
              onSubmit: () => {
                newForm.submit()
              },
              onReset: () => {
                newForm.reset({ validate: false, forceClear: false })
              }
            },
            <SchemaField path={''} />,
            children
          )}
        </Form>
      </SchemaContext.Provider>
    </FormItemContext.Provider>
  )
}

SchemaForm.defaultProps = {
  schema: {},
  component: 'form'
}

export default SchemaForm
