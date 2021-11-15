import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { branches } from "../config";
import "../index.css";


export const BranchComponent = class BranchComponent extends React.Component {
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
                {/* KEEP ONLY ONE WAY */}
                <input
                    id="Input"
                    className="input-width"
                    // aria-label="Branch"
                    // id="branch_id"
                    type="text"
                    autoComplete="off"
                    placeholder="Branch"
                    onChange={this.getBranch}
                    ref={this.input} 
                />

                <select
                    defaultValue={"DEFAULT"}
                    className="input-width select"
                    onChange={this.getBranch}
                >
                    <option 
                        value="DEFAULT" disabled
                        select="default">
                            Please, select a BRANCH:
                    </option>
                    
                    {branches.map((branches, key) => 
                    <option 
                        key={key} 
                        value={branches.id}>
                            {branches.title}
                    </option>) 
                    }
                </select>

            </div>

        );
    }
};

export default BranchComponent;