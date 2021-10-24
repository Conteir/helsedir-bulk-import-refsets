import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import { refsets } from "../config";

export const RefsetComponent = class RefsetComponent extends React.Component {
   
    getRefset = (evt) => {
        
        let refset = evt.target.value;

        if (!refset) {
            console.log("Please, select a refset");
        }

        this.props.refsetFromChildToParent(refset);
    }

    render() {
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
                        >
                            <option value="DEFAULT" 
                                    select="default" disabled> 
                                    Please, select a refset:
                            </option>
                           
                            {refsets.map((refsets, key) => 
                            <option key={key} value={refsets.referenceSet}>{refsets.title}</option>) }
                        </select>
                    </div>
                
            </div>
        );
    }
};

export default RefsetComponent;