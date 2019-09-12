import React, { useContext } from 'react'
import { isFn } from '@uform/shared'
import {
  LifeCycleTypes,
  FormLifeCycle,
  IForm,
  IModel,
  isStateModel,
  IFormState
} from '@uform/core'
import { useForm } from '../hooks/useForm'
import { useEva, createActions } from 'react-eva'
import FormContext, { BroadcastContext } from '../context'
import { IFormProps } from '../types'
import { createFormEffects, FormEffectHooks } from '../shared'

export const createFormActions = (): IForm =>
  createActions(
    'submit',
    'reset',
    'validate',
    'setFormState',
    'getFormState',
    'setFieldState',
    'getFieldState',
    'registerField',
    'registerVirtualField',
    'createMutators',
    'getFormGraph',
    'setFormGraph',
    'subscribe',
    'unsubscribe',
    'notify',
    'setFieldValue',
    'getFieldValue',
    'setFieldInitialValue',
    'getFieldInitialValue'
  ) as IForm

export const Form: React.FunctionComponent<IFormProps> = (props = {}) => {
  const broadcast = useContext(BroadcastContext)
  const actionsRef = React.useRef<any>(null)
  actionsRef.current =
    actionsRef.current || props.actions || createFormActions()
  const { implementActions, dispatch } = useEva({
    actions: actionsRef.current,
    effects: createFormEffects(props.effects, actionsRef.current)
  })
  const form = useForm({
    values: props.value,
    initialValues: props.initialValues,
    useDirty: props.useDirty,
    editable: props.editable,
    validateFirst: props.validateFirst,
    lifecycles: [
      new FormLifeCycle(
        ({ type, payload }: { type: string; payload: IModel }) => {
          dispatch.lazy(type, () => {
            return isStateModel(payload) ? payload.getState() : payload
          })
          if (type === LifeCycleTypes.ON_FORM_INPUT_CHANGE) {
            if (props.onChange) {
              props.onChange(
                isStateModel(payload)
                  ? payload.getState((state: IFormState) => state.values)
                  : {}
              )
            }
          }
          if (broadcast) {
            broadcast.notify({ type, payload })
          }
        }
      ),
      new FormLifeCycle(
        LifeCycleTypes.ON_FORM_WILL_INIT,
        (payload: IModel, form: IForm) => {
          const actions = {
            ...form,
            dispatch
          }
          if (broadcast) {
            broadcast.setContext(actions)
          }
          implementActions(actions)
        }
      )
    ],
    onReset: props.onReset,
    onSubmit: props.onSubmit,
    onValidateFailed: props.onValidateFailed
  })

  return (
    <FormContext.Provider value={form}>
      {isFn(props.children) ? props.children(form) : props.children}
    </FormContext.Provider>
  )
}

Form.displayName = 'ReactInternalForm'

export { FormEffectHooks }
