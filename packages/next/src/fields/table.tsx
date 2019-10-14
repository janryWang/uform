import React from 'react'
import { Icon } from '@alifd/next'
import {
  registerFormField,
  ISchemaFieldComponentProps,
  SchemaField,
  Schema
} from '@uform/react-schema-renderer'
import { toArr, isFn, isArr } from '@uform/shared'
import { ArrayList } from '@uform/react-shared-components'
import { CircleButton, TextButton } from '../components/Button'
import { Table, Form } from '@alifd/next'
import styled from 'styled-components'

const ArrayComponents = {
  CircleButton,
  TextButton,
  AdditionIcon: () => <Icon type="add" className="next-icon-first" />,
  RemoveIcon: () => (
    <Icon size="xs" type="ashbin" className="next-icon-first" />
  ),
  MoveDownIcon: () => (
    <Icon size="xs" type="arrow-down" className="next-icon-first" />
  ),
  MoveUpIcon: () => (
    <Icon size="xs" type="arrow-up" className="next-icon-first" />
  )
}

const FormTableField = styled(
  (props: ISchemaFieldComponentProps & { className: string }) => {
    const { value, schema, className, editable, path, mutators } = props
    const {
      renderAddition,
      renderRemove,
      renderMoveDown,
      renderMoveUp,
      renderEmpty,
      renderExtraOperations,
      operations,
      ...componentProps
    } = schema.getExtendsComponentProps() || {}
    const onAdd = () => {
      const items = Array.isArray(schema.items)
        ? schema.items[schema.items.length - 1]
        : schema.items
      mutators.push(items.getEmptyValue())
    }
    const renderColumns = (items: Schema) => {
      return items.mapProperties((props, key) => {
        const itemProps = {
          ...props.getExtendsItemProps(),
          ...props.getExtendsProps()
        }
        return (
          <Table.Column
            {...itemProps}
            dataIndex={key}
            cell={(value: any, index: number) => {
              return <SchemaField path={path.concat(index, key)} />
            }}
          />
        )
      })
      return []
    }
    return (
      <div className={className}>
        <ArrayList
          value={value}
          minItems={schema.minItems}
          maxItems={schema.maxItems}
          editable={editable}
          components={ArrayComponents}
          renders={{
            renderAddition,
            renderRemove,
            renderMoveDown,
            renderMoveUp,
            renderEmpty
          }}
        >
          <Table {...componentProps} dataSource={toArr(value)}>
            {isArr(schema.items)
              ? schema.items.reduce((buf, items) => {
                  return buf.concat(renderColumns(items))
                }, [])
              : renderColumns(schema.items)}
            <Table.Column
              {...operations}
              key="operations"
              dataIndex="operations"
              cell={(value: any, index: number) => {
                return (
                  <Form.Item>
                    <div className="array-item-operator">
                      <ArrayList.Remove
                        index={index}
                        onClick={() => mutators.remove(index)}
                      />
                      <ArrayList.MoveDown
                        index={index}
                        onClick={() => mutators.moveDown(index)}
                      />
                      <ArrayList.MoveUp
                        index={index}
                        onClick={() => mutators.moveUp(index)}
                      />
                      {isFn(renderExtraOperations)
                        ? renderExtraOperations(index)
                        : renderExtraOperations}
                    </div>
                  </Form.Item>
                )
              }}
            />
          </Table>
          <ArrayList.Addition>
            {({ children }) => {
              return (
                <div className="array-table-addition" onClick={onAdd}>
                  {children}
                </div>
              )
            }}
          </ArrayList.Addition>
        </ArrayList>
      </div>
    )
  }
)`
  display: inline-block;
  min-width: 600px;
  table {
    margin-bottom: 0 !important;
  }
  .array-table-addition {
    padding: 10px;
    background: #fbfbfb;
    border-left: 1px solid #dcdee3;
    border-right: 1px solid #dcdee3;
    border-bottom: 1px solid #dcdee3;
    .next-btn-text {
      color: #888;
    }
    .next-icon:before {
      width: 16px !important;
      font-size: 16px !important;
      margin-right: 5px;
    }
    margin-bottom: 10px;
  }

  .array-item-operator {
    display: flex;
    button {
      margin-right: 8px;
    }
  }
`

registerFormField('table', FormTableField)
