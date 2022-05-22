import React, { Component } from 'react'
import { CascadePickerView } from 'antd-mobile'
import FilterFooter from '../../../../components/FilterFooter'

export default class FilterPicker extends Component {
  state = {
    value: this.props.defaultValue,
  }

  render() {
    const { value } = this.state
    const { onCancel, onOk, data, openType } = this.props

    return (
      <>
        <CascadePickerView
          options={data}
          value={value}
          onChange={(val) => {
            this.setState({
              value: val,
            })
          }}
        />
        <FilterFooter
          onCancel={() => onCancel(null, openType)}
          onOk={() => onOk(value, openType)}
        />
      </>
    )
  }
}
