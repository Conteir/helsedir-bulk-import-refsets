import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import { typeSynonimRefsets } from "../config";

export const RefsetIDComponent = class RefsetIDComponent extends React.Component {
   
    getRefsetID = (evt) => {
        
        let refsetID = evt.target.value;

        if (!refsetID) {
            console.log("Please, select a refsetID");
        }

        console.log("refsetID is: ", refsetID);

        this.props.refsetIDFromChildToParent(refsetID);
    }

    render() {
        return (
            <div className="form-group">
                
                <select
                    // id="select"
                    defaultValue={"DEFAULT"}
                    // className="select"
                    // name="refsets"
                    // id="refsets"
                    className="input-width select"
                    onChange={this.getRefsetID}
                >
                    <option 
                        value="DEFAULT" disabled
                        // className="select"
                        // value="" 
                        select="default">
                            Please, select a refset:
                    </option>
                    
                    {typeSynonimRefsets.map((typeSynonimRefsets, key) => 
                    <option 
                        key={key} 
                        value={typeSynonimRefsets.referenceSet}>
                            {typeSynonimRefsets.title}
                    </option>) 
                    }
                </select>
                
            </div>
        );
    }
};

export default RefsetIDComponent;