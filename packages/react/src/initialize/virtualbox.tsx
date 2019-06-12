import React from 'react'
import { FieldProps } from '../type'
import { registerFormField } from '../shared/core'
import { registerVirtualboxFlag } from '../utils'

export default () => {
  registerVirtualboxFlag('slot')
  registerFormField(
    'slot',
    class extends React.Component<FieldProps> {
      static displayName = 'FormSlot'
      render() {
        const { schema } = this.props
        return <React.Fragment>{schema.renderChildren}</React.Fragment>
      }
    }
  )
}
