import { Component } from "react";

class InputCtrl extends Component {
    render() {
        return <div className="row mt-2">
            <div className="col">
                <label htmlFor={this.props.name}> {this.props.label} </label>
                {
                    this.props.type === 'text' ?
                        <input defaultValue={this.props.defaultValue} type={this.props.type} placeholder={this.props.label} name={this.props.name} id={this.props.name} className="form-control title-case" required={this.props.required} pattern={this.props.pattern} />
                        :
                        this.props.type === 'file' ?
                            <input type={this.props.type} name={this.props.name} id={this.props.name} className="form-control"/>
                            :
                            <input defaultValue={this.props.defaultValue} type={this.props.type} placeholder={this.props.label} name={this.props.name} id={this.props.name} className="form-control" required={this.props.required} />
                }
                <div className="form-text help float-end">{this.props.help}</div>
            </div>
        </div>
    }
}

InputCtrl.defaultProps = {
    label: "Your Label",
    type: "text",
    help: "",
    name: "",
    required: true,
    pattern: "",
    defaultValue: ''
}

export default InputCtrl