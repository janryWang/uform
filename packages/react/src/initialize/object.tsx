import React from 'react'
import { FieldProps } from '../type'
import { registerFormField } from '../shared/core'
import { each } from '../utils'

export default () =>
  registerFormField(
    'object',
    class ObjectField extends React.Component<FieldProps> {
      renderProperties() {
        const { renderField, getOrderProperties } = this.props
        const properties = getOrderProperties()
        const children = []
        each(properties, ({ key }: { key?: string } = {}) => {
          key && children.push(renderField(key, true))
        })
        return children
      }

      render() {
        return this.renderProperties()
      }
    }
  )
