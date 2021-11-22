import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import { refsetsProd, refsetsTest } from "../config";

export const RefsetComponent = class RefsetComponent extends React.Component {
   
    getRefset = (evt) => {
        
        let refset = evt.target.value;

        if (!refset) {
            console.log("Please, select a refset");
        }

        this.props.refsetFromChildToParent(refset);
    }

    render() {
        let ref = null;
        
        if(this.props.branch) {
            if(this.props.branch.id === "TEST") ref = refsetsTest;
            else if (this.props.branch.id === "PROD") ref = refsetsProd;
        }

        return (
            <div>
                <div className="form-group">
                    <select
                        defaultValue={"DEFAULT"}
                        className="input-width select"
                        // className="select"
                        // name="refsets"
                        // id="refsets"
                        onChange={this.getRefset}
                        disabled={this.props.disabled}
                    >
                        {/* {this.props.disabled ?
                            <option value="DEFAULT" select="default" disabled> 
                                    Please, select branch
                            </option>
                        : null}

                        {!this.props.disabled ?
                            <option value="DEFAULT" 
                                select="default" disabled> 
                                Please, select a refset:
                            </option>
                        : null}

                        {!this.props.disabled ?
                            refsets.map((refsets, key) => 
                                <option key={key} value={refsets.referenceSet}>{refsets.title}</option>) 
                        : null} */}

                        <option value="DEFAULT" 
                            select="default" disabled>
                            Velg refset:
                        </option>


                        {ref &&
                        ref.map((r, index) => 
                            <option key={index} 
                                    value={r.referenceSet}
                            >
                                {r.title}
                            </option>) 
                        }
                    </select>
                </div>
                
            </div>
        );
    }
};

export default RefsetComponent;