import { Component } from "react";

class AddressCtrl extends Component {
    render() {
        return <div className="row mt-2">
            <div className="col">
                <label htmlFor={this.props.name}> {this.props.label} </label>
                <textarea placeholder={this.props.label} name={this.props.name} id={this.props.name} className="form-control" required={this.props.required} rows="4">{this.props.defaultValue}</textarea>
                <div className="form-text help float-end">{this.props.help}</div>
            </div>
        </div>
    }
}

AddressCtrl.defaultProps = {
    label: "Your Label",
    help: "",
    name: "",
    required: true,
    defaultValue: ''
}

export default AddressCtrl