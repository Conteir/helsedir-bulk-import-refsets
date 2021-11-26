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
        let id = evt.target.value;
        let selected = branches.find(b => b.id === id);

        if (!selected) {
            console.log("Please, provide with a branch");
        }

        this.props.branchFromChildToParent(selected);
    }

    render() {
        return (
            <div>
                <select
                    defaultValue={"DEFAULT"}
                    className="input-width select"
                    onChange={this.getBranch}
                >
                    <option 
                        value="DEFAULT" disabled
                        select="default">
                            Velg BRANCH:
                    </option>
                    
                    {branches.map((branch, key) => 
                        <option 
                            key={key} 
                            value={branch.id}>
                                {branch.title}
                        </option>) 
                    }
                </select>
            </div>
        );
    }
};

export default BranchComponent;