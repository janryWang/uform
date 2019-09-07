import { createStateModel, ModelType } from '../shared/model'
import { toArr, clone } from '@uform/shared'
import { IFormState, IFormStateProps, FormStateDirtyMap } from '../types'
/**
 * 核心数据结构，描述Form级别状态
 */

export type FormStateModel<P = any> = ModelType<P, IFormState, IFormStateProps>

export const FormState = createStateModel<any, IFormState, IFormStateProps>(
  class FormState {
    static displayName = 'FormState'
    static defaultState: IFormState = {
      pristine: true,
      valid: true,
      invalid: false,
      loading: false,
      validating: false,
      initialized: false,
      submitting: false,
      editable: true,
      errors: [],
      warnings: [],
      values: {},
      initialValues: {},
      mounted: false,
      unmounted: false,
      props: {}
    }
    static defaultProps: IFormStateProps = {
      lifecycles: []
    }

    private state: IFormState

    constructor(state: IFormState, props: IFormStateProps) {
      this.state = state
      this.state.initialValues = clone(props.initialValues || {})
      this.state.values = clone(props.values || props.initialValues || {})
    }

    computeState(draft: IFormState) {
      draft.errors = toArr(draft.errors).filter(v => !!v)
      draft.warnings = toArr(draft.warnings).filter(v => !!v)
      if (draft.errors.length) {
        draft.invalid = true
        draft.valid = false
      } else {
        draft.invalid = false
        draft.valid = true
      }
      if (draft.validating === true) {
        draft.loading = true
      } else if (draft.validating === false) {
        draft.loading = false
      }
      if (draft.mounted === true) {
        draft.unmounted = false
      }
      if (draft.unmounted === true) {
        draft.mounted = false
      }
    }

    dirtyCheck(dirtys: FormStateDirtyMap) {
      if (dirtys.values) {
        this.state.pristine = false
      }
    }
  }
)
