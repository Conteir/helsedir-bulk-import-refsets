import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import { acceptabilityStatus } from "../config";



export const AcceptabilityStatusComponent = class AcceptabilityStatusComponent extends React.Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
        this.state = {
            acceptabilityStatus : ""
        }
    }
   
    getAcceptabilityStatus = (evt) => {
        let acceptabilityStatus = evt.target.value;


        if (acceptabilityStatus===undefined) {
            console.log("Please, provide with an acceptability status!");
        }

        this.setState({ acceptabilityStatus: acceptabilityStatus });
        this.props.acceptabilityStatusFromChildToParent(acceptabilityStatus);
    }

    render() {
        return (
  
            // <div className="Input">
            //     <input
            //         aria-label="TypeSynonymComponent"
            //         id="branch_id"
            //         type="text"
            //         autoComplete="off"
            //         placeholder="Type synonym"
            //         onChange={this.getTypeSynonim}
            //         ref={this.input} 
            //     />
            // </div>

            <div className="form-group">
                <select
                    defaultValue={"DEFAULT"}
                    className="input-width select"
                    // className="select"
                    // name="typeStatus"
                    // id="typeStatus"
                    onChange={this.getAcceptabilityStatus}
                >
                    <option value="DEFAULT" disabled
                            select="default">
                            Please, select an acceptability status:
                    </option>
                    
                    {acceptabilityStatus.map(
                            (acceptabilityStatus, key) => 
                            <option 
                                key={key} 
                                value={acceptabilityStatus.id}>
                                    {acceptabilityStatus.title}
                            </option>
                    )}
                </select>
            </div>

        );
    }
};

export default AcceptabilityStatusComponent;