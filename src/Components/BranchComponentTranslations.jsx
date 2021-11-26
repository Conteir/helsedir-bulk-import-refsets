import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";

export const BranchComponentTranslations = class BranchComponentTranslations extends React.Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
        this.state = {
            branchFromTextarea : ""
        }
    }
   
    getBranch = (evt) => {
        let branch = evt.target.value;
        let encodedBranch = encodeURIComponent(branch);
        branch = encodedBranch;

        if (branch.length===0 || branch===undefined) {
            console.log("Please, provide with a branch");
        }

        this.props.branchFromChildToParent(branch);
    }

    render() {
        return (
            <div>
                <input
                    id="Input"
                    className="input-width"
                    type="text"
                    autoComplete="off"
                    placeholder="Branch"
                    onChange={this.getBranch}
                    ref={this.input} 
                />
            </div>
        );
    }
};

export default BranchComponentTranslations;