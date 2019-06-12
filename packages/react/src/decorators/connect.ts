import React, { PureComponent } from 'react'
import { ISchema, Dispatcher } from '@uform/types'
import { isArr, isFn, each } from '../utils'
import { IEvent, EventTargetOption, FieldProps } from '../type'

const isEvent = (candidate: IEvent): boolean =>
  !!(candidate && candidate.stopPropagation && candidate.preventDefault)

const isReactNative =
  typeof window !== 'undefined' &&
  window.navigator &&
  window.navigator.product &&
  window.navigator.product === 'ReactNative'

const getSelectedValues = (options?: EventTargetOption[]) => {
  const result = []
  if (options) {
    for (let index = 0; index < options.length; index++) {
      const option = options[index]
      if (option.selected) {
        result.push(option.value)
      }
    }
  }
  return result
}

// TODO 需要 any ?
const getValue = (event: IEvent | any, isReactNative: boolean) => {
  if (isEvent(event)) {
    if (!isReactNative && event.nativeEvent && event.nativeEvent.text !== undefined) {
      return event.nativeEvent.text
    }
    if (isReactNative && event.nativeEvent !== undefined) {
      return event.nativeEvent.text
    }

    const detypedEvent = event
    const {
      target: { type, value, checked, files },
      dataTransfer
    } = detypedEvent

    if (type === 'checkbox') {
      return !!checked
    }

    if (type === 'file') {
      return files || (dataTransfer && dataTransfer.files)
    }

    if (type === 'select-multiple') {
      return getSelectedValues(event.target.options)
    }
    return value
  }
  return event
}

const createEnum = (_enum: any, enumNames: string | any[]) => {
  if (isArr(_enum)) {
    return _enum.map((item, index) => {
      if (typeof item === 'object') {
        return {
          ...item
        }
      } else {
        return {
          ...item,
          label: isArr(enumNames) ? enumNames[index] || item : item,
          value: item
        }
      }
    })
  }

  return []
}

const bindEffects = (props: ConnectProps, effect: ISchema['x-effect'], dispatch: Dispatcher) => {
  each(effect(dispatch, { ...props }), (event, key) => {
    const prevEvent = key === 'onChange' ? props[key] : undefined
    props[key] = (...args) => {
      if (isFn(prevEvent)) prevEvent(...args)
      if (isFn(event)) return event(...args)
    }
  })
  return props
}

export interface ConnectProps extends FieldProps {
  disabled?: boolean
  readOnly?: boolean
  dataSource?: any[]
}

export interface ConnectOptions {
  valueName: string
  eventName: string
  defaultProps: Object
  getValueFromEvent: Function
  getProps: (props: ConnectProps, componentProps: FieldProps) => ConnectProps
  getComponent: Function
}

export const connect = (opts: ConnectOptions) => Target => {
  opts = {
    valueName: 'value',
    eventName: 'onChange',
    ...opts
  }
  return class extends PureComponent<FieldProps> {
    render() {
      const { value, name, mutators, schema, editable } = this.props

      let props = {
        ...opts.defaultProps,
        ...schema['x-props'],
        [opts.valueName]: value,
        [opts.eventName]: (event, ...args) => {
          mutators.change(
            opts.getValueFromEvent
              ? opts.getValueFromEvent.call({ props: schema['x-props'] || {} }, event, ...args)
              : getValue(event, isReactNative)
          )
        }
      } as ConnectProps

      if (editable !== undefined) {
        if (isFn(editable)) {
          if (!editable(name)) {
            props.disabled = true
            props.readOnly = true
          }
        } else if (editable === false) {
          props.disabled = true
          props.readOnly = true
        }
      }

      if (isFn(schema['x-effect'])) {
        props = bindEffects(props, schema['x-effect'], mutators.dispatch)
      }

      if (isFn(opts.getProps)) {
        let newProps = opts.getProps(props, this.props)
        if (newProps !== undefined) {
          props = newProps
        }
      }

      if (isArr(schema['enum']) && !props.dataSource) {
        props.dataSource = createEnum(schema['enum'], schema['enumNames'])
      }

      if (props.editable !== undefined) {
        delete props.editable
      }

      return React.createElement(
        isFn(opts.getComponent) ? opts.getComponent(Target, props, this.props) : Target,
        props
      )
    }
  }
}
