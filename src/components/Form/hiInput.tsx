import React from 'react'

type InputProps = {
  labelCols: string | number,
  requiredLabel: boolean,
  label: string,
  errorMessage: string,
  invalid: boolean,
  disabled: boolean,
  type: string,
  setValue: Function
}

class TsInput extends React.Component<InputProps, {}> {

  static defaultProps = {
    labelCols: '',
    requiredLabel: false,
    label: '',
    errorMessage: '',
    invalid: false,
    disabled: false,
    type: 'text',
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  get labelClass() {
    if (this.props.labelCols) {
      return `sm:col-span-${this.props.labelCols}`;
    } else {
      return "sm:col-span-12";
    }
  }

  get requiredLabel() {
    if (this.props.requiredLabel) {
      return <div className="bg-amber-900 text-white px-3 mr-3">必須</div>;
    } else {
      return '';
    }
  }

  get inputWrapClass() {
    if (this.props.labelCols) {
      let cols = this.props.labelCols
      if (typeof cols === 'string') {
        cols = parseInt(cols)
      }
      const col = 12 - cols;
      return `sm:col-span-${col}`
    } else {
      return "sm:col-span-12";
    }
  }

  get errorMessage() {
    if (this.haveError) {
      return <p className="text-red-500 text-xs italic">{this.props.errorMessage}</p>
    }
  }

  get haveError() {
    return this.props.invalid && !this.props.disabled;
  }

  get inputClass() {
    let inputClass = 'appearance-none border rounded w-full p-4 text-gray-700 leading-tight focus:outline-none'
    if (this.haveError) {
      inputClass += ' border-red-500'
    }
    if (this.props.invalid) {
      inputClass += ' focus:shadow-outline'
    }
    return inputClass
  }

  handleChange(event) {
    this.props.setValue(event.target.value)
  }

  render() {
    return <div className="grid grid-cols-12">
      <label className={'block text-sm flex items-center col-span-12 ' + this.labelClass}>
        { this.requiredLabel }
        { this.props.label }
      </label>
      <div className={'col-span-12 ' + this.inputWrapClass}></div>
      <input className={this.inputClass} type={this.props.type} onChange={this.handleChange} />
      {this.errorMessage}
    </div>
  }
}



export default TsInput
