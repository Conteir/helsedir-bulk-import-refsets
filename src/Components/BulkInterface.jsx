import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import { Spinner } from "reactstrap";
import RefsetComponent from "./RefsetComponent";
import BranchComponent from "./BranchComponent";
import { terminlogyServer } from "../config";

export const BulkInterface = class BulkInterface extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputFromTextarea: "",
      branchFromTheInput: "",
      refset: "",
      requestUrl: "",
      data: {},
      dataWithMembers: {},
      showContent: false,
      headers: {
        // "Access-Control-Allow-Origin": "https://danger-danger.netlify.app",
        Accept: "application/json",
        "Content-Type": "application/json",
        // credentials: "include",
        // SameSite: "None",
        Authorization: "Basic Y29udGVpcjpxN25TeHRGdA==",
        "Accept-Language": "en-X-900000000000509007,en-X-900000000000508004,en, no"
      },
      showSpinner: false,
    };
  }

  getInput = (evt) => {
    let inputFromTextarea = evt.target.value;
    this.setState({ inputFromTextarea: inputFromTextarea });
    console.log("inputFromTextarea", inputFromTextarea);
  };

  callbackBranchHandler = (branch) => {
    this.setState({ branchFromTheInput: branch });
    console.log("branch: ", branch);
  };

  callbackRefsetHandler = (refset) => {
    this.setState({ refset: refset, showSpinner: true });

    let branch = "MAIN/SNOMEDCT-NO/TEST";

    // Handle here case whan branch = helsedir
    
    let getMembersRequestUrl = terminlogyServer
        + "/" + branch
        + "/members?referenceSet=" + refset 
        // + "&languages=no,en"
    ;

    const parameters = {
      method: "GET",
      credentials: "include",
      headers: this.state.headers,
      // body: JSON.stringify(member),
    };

    fetch(getMembersRequestUrl, parameters)
      .then((response) => response.json())
      .then((dataWithMembers) => {
        console.log("dataWithMembers", dataWithMembers);
        this.getNOdata(dataWithMembers);
        this.setState({ showSpinner: false, dataWithMembers: dataWithMembers, showContent: true });
      });

  };

  inputHandler = () => {

    let inputFromTextarea = this.state.inputFromTextarea;
    
    let sctIds = [];
    let membersArray = [];
    let conceptIds = inputFromTextarea.match(/[^\n\r]+/g);

    conceptIds.forEach((el) => {
      let elArray = el.split(",");

      elArray.forEach( (sctid) => {
        let trimmedSctId = sctid.trim();

        if(trimmedSctId && trimmedSctId.length > 0) {
          sctIds.push(trimmedSctId);
        }
      });
    });

    sctIds.forEach( (mem) => {
      let member = {
        active: true,
        effectiveTime: new Date().toISOString().slice(0, 10).replace(/-/g, ""),
        moduleId: "715152001",
        referencedComponentId: mem,
        refsetId: this.state.refset
      };

      console.log("member:", member);

      membersArray.push(member);
    });

    let memberForRequest = membersArray.shift();
    this.callPost(memberForRequest, membersArray);
    this.setState({ showSpinner: true });

  };

  callPost = (memberForRequest, membersArray) => {
    this.setState({ showSpinner: true });

    // let branch = this.state.branchFromTheInput;
    // TODO options
    let branch = "MAIN/SNOMEDCT-NO/TEST";
    let requestUrl = terminlogyServer + "/" + branch + "/members";

    const parameters = {
      method: "POST",
      credentials: "include",
      headers: this.state.headers,
      body: JSON.stringify(memberForRequest),
    };

    fetch(requestUrl, parameters)
      .then((response) => response.json())
      .then((data) => {
        if (membersArray.length > 0) {
          this.setState({ data: data, showSpinner: true });
          let nextMember = membersArray.shift();
          this.callPost(nextMember, membersArray);
        } else {
          this.setState({ showSpinner: false });
        }
      });
  };

  getNOdata = (dataWithMembers) => {

    let conceptIdsArray = dataWithMembers.items.map((item) => {
      return item.referencedComponent.conceptId;
    });

    let conceptIds = conceptIdsArray.join(",");
    console.log("Going to fetch conceptIds: ", conceptIds)

    let branch = "MAIN/SNOMEDCT-NO/TEST";

    let noUrl = terminlogyServer 
        + "/browser/"
        + branch 
        + "/concepts?conceptIds=" + conceptIds;

    const parameters = {
      method: "GET",
      credentials: "include",
      headers: this.state.headers,
    };

    fetch(noUrl, parameters)
      .then((response) => response.json())
      .then((data) => {
          // let nextMember = membersArray.shift();
          let conceptNONameMap = {};

          data.items.forEach((item) => {
            if(Array.isArray(item.descriptions)) {
              let noDesc = item.descriptions.find((desc) => {
                return desc.term && desc.lang === "no";
              });
              console.log("noDesc:", noDesc);

              if(noDesc) {
                conceptNONameMap[item.conceptId] = noDesc.term;
                console.log("conceptNONameMap: ", conceptNONameMap);
              }
            }
          });

          const dataWithMembers = this.state.dataWithMembers;
          dataWithMembers.items.forEach((item) => {
            item.$$NOTermName = conceptNONameMap[item.referencedComponent.conceptId];
          });

          this.setState({ data: data, showSpinner: true }); // !!!!!
          console.log("data from 2nd GET", data);

      });

  }

  showNames = () => {
    if(this.state.dataWithMembers && this.state.dataWithMembers.items) {
      return this.state.dataWithMembers.items.map((item, index) => {
            return (
              <div key={index}>
                <div>
                  <b>{item?.referencedComponent?.id}{" "}{item?.referencedComponent?.fsn?.term}</b>
                </div>
                <div>
                  {item?.referencedComponent?.pt?.term}
                </div>
                <div>
                  {item?.$$NOTermName}
                </div>
                
              </div>
            );
      })
    }

  }

  render() {
    return (
      <div className="App">

         <header className="jumbotron text-left" style={{ backgroundColor: "#2F4746" }}>
          <img src="assets/logo.png" alt="logo" height="50px"></img>
          <h1>HELSEDIREKTORATET Bulk import refsets</h1>
          <aside className="implementationNote">
            The header should always be used in order to establish Conteir as the
            product owner. In some cases (as for Helsedirektoratet), we use the
            customers logo and name.
          </aside>
        </header>

        <article>
          <div className="row form-group">
            
            <div className="col-md-8">

              <div className="row form-group">
                <RefsetComponent
                  refsetFromChildToParent={this.callbackRefsetHandler}
                />
              </div>
              <div className="row form-group">
                <BranchComponent branchFromChildToParent={this.callbackBranchHandler}/>
              </div>

              <div className="row form-group">
                <div className="col-md-6">
                    <textarea
                      className="select"
                      aria-label="Input"
                      // id="input_id"
                      type="text"
                      autoComplete="off"
                      placeholder="Please, enter one or several SCTIDs
                        (f.eks 233604007, 37271000202109)"
                      onChange={this.getInput}
                    />
                </div>
          
                <div className="col-md-6">
                  {this.state.showContent ? (
                    <div className="popup">

                      <div className="frame">
                        <span><h2>Refset medlemmer</h2></span>
                      </div>

                      <div className="content">
                        {this.showNames()}
                        {/* {item} */}
                      </div>
                      
                    </div>
                  ) : null}
                </div>

              </div>

              <div>
                <button onClick={this.inputHandler}>Legg til medlem</button>
              </div>

            </div>

            {
              this.state.showSpinner ? 
                <Spinner color="success" /> 
              : null
            }

          </div>
        </article>

      </div>
    );
  }
};

export default BulkInterface;
