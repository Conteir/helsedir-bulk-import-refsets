import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";


export const NewTermComponent = class NewTermComponent extends React.Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
        this.state = {
            newTerm : ""
        }
    }
   
    getTerm = (evt) => {
        let newTerm = evt.target.value;

        if (newTerm.length===0 || newTerm===undefined) {
            console.log("Please, provide with a term");
        }

        this.setState({ newTerm: newTerm });
        console.log(newTerm);
        this.props.termFromChildToParent(newTerm);
    }

    render() {
        return (
  
            <div>
                <input
                    className="input-width"
                    placeholder={this.props.placeholder}
                    onChange={this.getTerm}
                    ref={this.input} 
                />
            </div>

        );
    }
};

export default NewTermComponent;