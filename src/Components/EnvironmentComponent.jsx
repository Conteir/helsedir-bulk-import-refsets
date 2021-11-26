import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { environments } from "../config";
import "../index.css";

export const EnvironmentComponent = class EnvironmentComponent extends React.Component {
   
    getEnvironment = (evt) => {
        let environment = evt.target.value;
        let selected = environments.find(b => b.environment === environment);

        if (!selected) {
            console.log("Please, provide with an environment");
        }

        this.props.environmentFromChildToParent(environment);
    }

    render() {
        return (
            <div>
                <select
                    defaultValue={"DEFAULT"}
                    className="input-width select"
                    onChange={this.getEnvironment}
                >
                    <option 
                        value="DEFAULT" disabled
                        select="default">
                            Velg environment:
                    </option>
                    
                    {environments.map((env, key) => 
                        <option 
                            key={key} 
                            value={env.urlPart}>
                                {env.title}
                        </option>) 
                    }
                </select>
            </div>
        );
    }
};

export default EnvironmentComponent;