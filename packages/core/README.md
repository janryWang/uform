# @uform/core
> UForm 内核包

## quick start

```jsx
import { createForm, LifeCycleTypes, FormLifeCycle, FormPath } from './src'

const resetInitValues = {
    aa: {
    bb: [{ aa: 123 }, { aa: 321 }]
    }
};
// const form = createForm({
//     values: resetInitValues
// })
// form.registerField({ path: 'aa' })
// form.registerField({ path: 'aa.bb' })
// form.registerField({ path: 'aa.bb.0' })
// form.registerField({ path: 'aa.bb.1' })
// form.registerField({ path: 'aa.bb.0.aa' })
// form.registerField({ path: 'aa.bb.1.aa' })
// form.setFieldState('aa.bb.0.aa', state => {
//     state.value = 'aa changed'
// })
// form.reset()
// console.log(form.getFormState(state => state.values))
// console.log(form.getFormState(state => state.initialValues))
// const form = createForm()
// form.registerField({ path: 'a' })
// form.registerVirtualField({ path: 'a.b' })
// form.registerField({ path: 'a.b.c' })
// form.registerVirtualField({ path: 'a.b.c.d' })
// form.registerField({ path: 'a.b.c.d.e' })

// console.log(form.transformDataPath(new FormPath('a')).toString());
// console.log(form.transformDataPath(new FormPath('a.b')).toString());
// console.log(form.transformDataPath(new FormPath('a.b.c')).toString());
// console.log(form.transformDataPath(new FormPath('a.b.c.d')).toString());
// console.log(form.transformDataPath(new FormPath('a.b.c.d.e')).toString());

// const form = createForm({ values: { a: 1, b: 2, c: 3, d: 4 }})
// form.registerField({ path: 'a' })
// form.registerField({ path: 'b', value: 'x' })
// form.registerField({ path: 'c', initialValue: 'y' })
// form.registerField({ path: 'd', initialValue: 'z', value: 's' })
// console.log(form.getFieldValue('a'), form.getFieldValue('a') === 1)
// console.log(form.getFieldValue('b'), form.getFieldValue('b') === 'x')
// console.log(form.getFieldValue('c'), form.getFieldValue('c') === 3) // false, 得到y
// console.log(form.getFieldValue('d'), form.getFieldValue('d') === 's')

// const testValues = { aa: 111, bb: 222 }
// const form = createForm({
//     initialValues: testValues
// })
// const aa = form.registerField({ path: 'aa' })
// const bb = form.registerField({ path: 'bb' })

// console.log('getFormGraph', form.getFormGraph());

const form = createForm({
    values: resetInitValues
})
form.registerField({ path: 'aa' })
form.registerField({ path: 'aa.bb' })
form.registerField({ path: 'aa.bb.0' })
form.registerField({ path: 'aa.bb.1' })
form.registerField({ path: 'aa.bb.0.aa' })
form.registerField({ path: 'aa.bb.1.aa' })
console.log('getFormGraph change before', form.getFormGraph());
form.setFieldState('aa.bb.0.aa', state => {
    state.value = 'aa changed'
})
console.log('getFormGraph reset before', form.getFormGraph());
form.reset()
console.log('getFormGraph reset after', form.getFormGraph());
```