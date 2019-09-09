import React from 'react'
import { isFn, FormPath } from '@uform/shared'
import { LifeCycleTypes, FormLifeCycle } from '@uform/core'
import { useForm } from '../hooks/useForm'
import { useEva, createActions } from 'react-eva'
import { Observable } from 'rxjs/internal/Observable'
import { filter } from 'rxjs/internal/operators'
import FormContext from '../context'
import { IFormProps, IFormEffect } from '../types'

const createFormEffects = (effects: IFormEffect | null, actions: any) => {
  if (isFn(effects)) {
    return (selector: (type: string) => Observable<any>) => {
      effects(
        (type: string, matcher?: string | ((payload: any) => boolean)) => {
          const observable$: Observable<any> = selector(type)
          if (matcher) {
            return observable$.pipe(
              filter(
                isFn(matcher)
                  ? matcher
                  : (payload: any = {}): boolean => {
                      return FormPath.parse(matcher).match(payload.name)
                    }
              )
            )
          }
          return observable$
        },
        actions
      )
    }
  } else {
    return () => {}
  }
}

export const createFormActions = () =>
  createActions(
    'getFormState',
    'getFieldState',
    'setFormState',
    'setFieldState',
    'setFormGraph',
    'getFormGraph',
    'reset',
    'submit',
    'validate',
    'dispatch'
  )

export const Form = (props: IFormProps = {}) => {
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
    validateFirst: props.validateFirst,
    lifecycles: [
      new FormLifeCycle(({ type, payload }) => {
        dispatch(
          type,
          payload ? payload.getState && payload.getState() : payload
        )
        if (type === LifeCycleTypes.ON_FORM_VALUES_CHANGE) {
          if (props.onChange) {
            props.onChange(payload.getState(state => state.values))
          }
        }
      }),
      new FormLifeCycle(LifeCycleTypes.ON_FORM_WILL_INIT, (payload, form) => {
        implementActions({
          ...form,
          dispatch
        })
      })
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
