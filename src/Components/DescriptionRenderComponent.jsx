import React from "react";

export const DescriptionRenderComponent = class DescriptionRenderComponent extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            arrayOfFSN: [],
            arrayOfSYNONIMS: [],
            showSpinner: false
        };
      }

    render() {
        return (
        <div>
            <div>{this.renderDescriptions()}</div>
        </div>
        );
    }

    renderDescriptions = () => {

        if (this.props.renderDescriptionsData && Array.isArray(this.props.renderDescriptionsData.descriptions)) {
            let data = this.props.renderDescriptionsData; //json.parse calls error for some reason...

            data.descriptions.sort((fsn,synonim) => {
                if(fsn?.type && synonim?.type) return fsn.type.localeCompare(synonim.type);
                return 0;
            });

            return (
            <div>
                {data.descriptions.map((descr, index) => (
                    <div key={index}>
                        
                        <div className="form-group">
                                <div  >
                                    {descr?.active === true ?  
                                            (<div className="row">
                                                <div className="col-md-10">
                                                    <span>{index}</span><span>{". "}</span>
                                                    <span>{descr.term}</span><span>{" - "}</span> 
                                                    <span>{descr.type}</span><span>{" - "}</span> {/** TO DO: SORT BY THIS FIELD */}
                                                    <span>{descr.lang.toUpperCase()}</span><span>{" - "}</span>
                                                    <span>
                                                        {
                                                            Object.keys(descr.acceptabilityMap).map(function(field, index) {
                                                                return (
                                                                    <span key={index}>
                                                                        <p>{field==="900000000000508004" ? "GB: " + descr.acceptabilityMap[field] + "; " : null }</p>
                                                                        <p>{field==="900000000000509007" ? "US: " + descr.acceptabilityMap[field] + "; " : null }</p>
                                                                        <p>{field==="61000202103" ? "NO: " + descr.acceptabilityMap[field] + "; " : null }</p>
                                                                        <p>{field==="123456789" ? "FASTLEGER: " + descr.acceptabilityMap[field] + "; " : null }</p>
                                                                        {/* {field}: {descr.acceptabilityMap[field]} {" "} */}
                                                                    </span>
                                                                )
                                                              })
                                                        }
                                                    </span>
                                                </div>
                                                <div className="row col-md-2">
                                                    <div>
                                                        <button 
                                                            onClick={() => this.props.deleteDescription(descr)} 
                                                            className={'secondary'}
                                                            >
                                                                <b>Fjern</b>
                                                        </button>
                                                    </div>

                                                    <div>
                                                        <button 
                                                            onClick={() => this.props.updateTerm(descr)} 
                                                            className={'update'}
                                                            >
                                                                <b>Oppdater</b>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>)
                                    : ""}
                                </div>

                            </div>
                    </div>
                ))}

            </div>
            )
               
        }
    }

};

export default DescriptionRenderComponent;