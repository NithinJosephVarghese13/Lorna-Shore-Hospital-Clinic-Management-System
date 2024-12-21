import { Component } from "react"

class FormContainer extends Component {

    render() {
        return <div className="container">
            <div className="row">
                <div className="col-md-2"></div>
                <div className="col border p-3 rounded-5 shadow-lg">
                    <h3 className="text-primary mb-4"> {this.props.title} </h3>
                    {this.props.children}
                    <div className="float-end mt-4">
                        <a href={this.props.back} className="btn btn-danger me-2">Back</a>
                        <button className="btn btn-success"> {this.props.submit_title} </button>
                    </div>
                </div>
                <div className="col-md-2"></div>
            </div>
        </div>
    }
}
FormContainer.defaultProps = {
    title: "Your Title",
    submit_title: "Submit",
    back: "/"
}
export default FormContainer