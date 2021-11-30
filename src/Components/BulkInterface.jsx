import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import { Spinner } from "reactstrap";
import RefsetComponent from "./RefsetComponent";
import BranchComponent from "./BranchComponent";
import { environments } from "../config";

export const BulkInterface = class BulkInterface extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputFromTextarea: "",
      branchFromTheInput: undefined,
      refset: "",
      requestUrl: "",
      data: {},
      dataWithMembers: {},
      memberToDelete: {},
      dataBeforePost: [],
      showContent: false,
      terminologyEnvironment: "",
      headers: {
        // "Access-Control-Allow-Origin": "https://danger-danger.netlify.app",
        Accept: "application/json",
        "Content-Type": "application/json",
        // credentials: "include",
        // SameSite: "None",
        Authorization: "Basic Y29udGVpcjpxN25TeHRGdA==",
        // "Accept-Language": "en-X-900000000000509007,en-X-900000000000508004,en, no"
      },
      showSpinner: false,
    };
  }

  getTerminologyEnvironment = (evt) => {
    let terminologyEnvironment = evt.target.value;
    this.setState({ terminologyEnvironment: terminologyEnvironment });
    console.log("Chosen terminology server: ", terminologyEnvironment);
  }

  callbackBranchHandler = (branch) => {
    this.setState({ branchFromTheInput: branch });
    console.log("selected branch by parent component: ", branch);
  };

  callbackRefsetHandler = (refset) => {
    this.getRefsetData(refset);
    this.setState({ refset: refset });
  }

  getInput = (evt) => {
    let inputFromTextarea = evt.target.value;
    if (inputFromTextarea && inputFromTextarea.length > 0) { 
      this.setState({ inputFromTextarea: inputFromTextarea });
    }
    console.log("inputFromTextarea", inputFromTextarea);
  };

  // First GET. Getting all members from the certain refset:
  getRefsetData = (refset) => {
    let branch = encodeURIComponent(this.state.branchFromTheInput.branch);
    let terminologyEnvironment = this.state.terminologyEnvironment;
    let getMembersRequestUrl = terminologyEnvironment + "/" + branch + "/members?limit=300&referenceSet=" + refset;

    const parameters = {
      method: "GET",
      credentials: "include",
      headers: this.state.headers,
      // body: JSON.stringify(member),
    };

    console.log("refset before fetch", refset);
    console.log("branch before fetch", branch);
    console.log("terminologyEnvironment before fetch", this.state.terminologyEnvironment);

    if (refset && branch && terminologyEnvironment) {
      this.setState({showSpinner: true});
      fetch(getMembersRequestUrl, parameters)
        .then((response) => response.json())
        .then((dataWithMembers) => {
          if (dataWithMembers === undefined) {
            this.setState({showSpinner: false});
          }
          console.log("dataWithMembers", dataWithMembers);
          // Getting only correct members from the serverx:
          // Filter out without referencedComponent OR fsn
          dataWithMembers.items = dataWithMembers.items.filter(item => item?.referencedComponent?.fsn !== undefined);
          this.getNOdata(dataWithMembers);
          // this.setState({ showSpinner: false, dataWithMembers: dataWithMembers, showContent: true });
        });
    } else {
      alert("Du må velg server!");
    }

  };

  importMembers = (sctIds) => {
    let membersArray = [];
    sctIds.forEach( (mem) => {
      let member = {
        active: true,
        effectiveTime: new Date().toISOString().slice(0, 10).replace(/-/g, ""),
        moduleId: "715152001",
        referencedComponentId: mem || "",
        refsetId: this.state.refset
      };

      console.log("member:", member);
      membersArray.push(member);
    });

    if(membersArray.length === 0) {
      console.log("No members!");
      return;
    }

    let memberForRequest = membersArray.shift();
    this.callPost(memberForRequest, membersArray);
  }

  inputHandler = () => {
    if (this.state.refset===undefined || !this.state.inputFromTextarea) {
      alert("You should put data to the text area and chose a refset!");
    }

    this.setState({ showSpinner: true });

    let inputFromTextarea = this.state.inputFromTextarea;
    let sctIds = inputFromTextarea.split(/[\n\r\s,;]+/);

    console.log("sctIds from the input 129 line:", sctIds);

    // Chack that all wanted sctIds exist in general (or valid)
    let requestConceptIds = sctIds.join(',');
    let branch = encodeURIComponent(this.state.branchFromTheInput.branch);
    let terminlogyServer = this.state.terminologyEnvironment;
    let conteptsUrl = terminlogyServer 
        + "/browser/"
        + branch 
        + "/concepts?conceptIds=" + requestConceptIds;

    const parameters = {
      method: "GET",
      credentials: "include",
      headers: this.state.headers,
    };

    fetch(conteptsUrl, parameters)
      .then((response) => response.json())
      .then((data) => {
          if(Array.isArray(data.items)) {
            let validMap = {};

            data.items.forEach((item) => {
              validMap[item.conceptId] = 'wanted';
            });

            let invalidIds = [];

            sctIds.forEach((id) => {
              if(!validMap[id]) {
                invalidIds.push(id);
              }
            });

            if(invalidIds.length > 0) {
              this.setState({showSpinner: false});
              alert("Invalid concept ids: " + invalidIds.join(','));
            } else {
              // Check that conceptIds are not yet added to required refset

              let branch = encodeURIComponent(this.state.branchFromTheInput.branch);
              let terminologyEnvironment = this.state.terminologyEnvironment;
              let currentRefsetMembersUrl = terminologyEnvironment + "/" + branch
                + "/members?limit=200&referenceSet=" + this.state.refset
                + "&referencedComponentId=" + sctIds.join(",");

              const parameters = {
                method: "GET",
                credentials: "include",
                headers: this.state.headers,
                // body: JSON.stringify(member),
              };

              fetch(currentRefsetMembersUrl, parameters)
              .then((response) => response.json())
              .then((data) => {
                if(Array.isArray(data.items)) {
                  let existingMembersMap = {};

                  data.items.forEach((item) => {
                    existingMembersMap[item.referencedComponentId] = 'exists';
                  });

                  let existingRequiredIds = [];

                  sctIds.forEach((id) => {
                    if(existingMembersMap[id]) {
                      existingRequiredIds.push(id);
                    }
                  });

                  if(existingRequiredIds.length > 0) {
                    this.setState({showSpinner: false});
                    alert("These concepts already exist: " + existingRequiredIds.join(','));
                  } else {
                    console.log("ALL GOOD, PROCEED WITH IMPORT...");
                    this.importMembers(sctIds);
                  }
                } else console.log("No data with members!");
                
              });
            }
          } else console.log("no items!!!");
      });

  };

  callPost = (memberForRequest, membersArray) => {
    let terminologyEnvironment = this.state.terminologyEnvironment;
    let branch = encodeURIComponent(this.state.branchFromTheInput.branch);
    this.setState({ showSpinner: true });

    // TODO options
    // let branch = "MAIN/SNOMEDCT-NO/TEST";
    let requestUrl = terminologyEnvironment + "/" + branch + "/members";

    const parameters = {
      method: "POST",
      credentials: "include",
      headers: this.state.headers,
      body: JSON.stringify(memberForRequest),
    };

    console.log("inputFromTextarea inside OIST", this.state.inputFromTextarea);

    fetch(requestUrl, parameters)
      .then((response) => response.json())
      .then((data) => {
        if (membersArray.length > 0) {

          this.setState({ data: data, showSpinner: true });

          let nextMember = membersArray.shift();
          console.log("nextMember.referencedComponentId POST", nextMember?.referencedComponentId);

          this.callPost(nextMember, membersArray);

        } else {
          alert("Added!");
          this.setState({ showSpinner: false });
          this.getRefsetData(this.state.refset);
        }
      });
  };

  getNOdata = (dataWithMembers) => {

    let conceptIdsMap = {};

    console.log("Valid items: " + dataWithMembers.items.length);

    dataWithMembers.items.forEach((item) => {
      // check if "referencedComponent" exist!
      if (item.referencedComponent) {
        conceptIdsMap[item.referencedComponent.conceptId] = true; // restrics duplicated ids
      } else conceptIdsMap[item.referencedComponentId] = true;
    });

    let conceptIdsArray = [];
    for(let conceptId in conceptIdsMap) {
      conceptIdsArray.push(conceptId);
    }

    let terminlogyServer = this.state.terminologyEnvironment;
    let conceptIds = conceptIdsArray.join(",");
    console.log("Going to fetch conceptIds: ", conceptIdsArray.length);

    let branch = encodeURIComponent(this.state.branchFromTheInput.branch);

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

          console.log("Fetched concepts: ", data);
          console.log("Fetched NO terms size: ", data?.items?.length);

          data?.items?.forEach((item) => {
            // no need to check item.referencedComponent:
            if(Array.isArray(item.descriptions)) {
              let noDesc = item.descriptions.find((desc) => {
                return desc.term && ( desc.lang === "no" || desc.lang === "nb");
              });
              // fallback
              if(!noDesc) {
                noDesc = item.descriptions.find((desc) => {
                  return desc.term && desc.lang === "en";
                });
              }

              // console.log("noDesc:", noDesc);

              if(noDesc) {
                conceptNONameMap[item.conceptId] = noDesc.term;
                // console.log("conceptNONameMap: ", conceptNONameMap);
              }
            } 
          });
        
          dataWithMembers.items.forEach((item) => {
            if(item.referencedComponent) {
              // Create new field for norsk
              item.$$NOTermName = conceptNONameMap[item.referencedComponent.conceptId];
            } else item.$$NOTermName = conceptNONameMap[item.referencedComponentId];
            // else {
            //   return alert("Error: this member does not contain item.referencedComponent!");
            // }
          });

          this.setState({ showSpinner: false, dataWithMembers: dataWithMembers, showContent: true });
      });

  }

  showNames = () => {
    let counter = 1; // for checking
    if(this.state.dataWithMembers && this.state.dataWithMembers.items) {
      return this.state.dataWithMembers.items.map((item, index) => {
            return (
              <div key={index}>

                <div className="form-group row">
                
                    <div className="col-md-10">
                      {/* for checking: */}
                      {counter++}
                      
                      <div className="row">
                        <b>
                          {item?.referencedComponent?.id}
                          {" "}
                          {item?.referencedComponent?.fsn?.term}
                          {" "}
                        </b>
                      </div>

                      <div className="row">
                        <div>
                            {item?.referencedComponent?.pt?.term}
                        </div>
                      </div>

                      <div className="row">
                        <div>
                            {"NO: " + item?.$$NOTermName}
                        </div>
                      </div>

                    </div>

                    <div className="col-md-2">

                      <div>
                        <button 
                          onClick={() => this.deleteMember(item)} 
                          className={'warning'}
                          >
                              <b>Fjern</b>
                        </button>
                      </div>

                    </div>

                </div>

              </div>
            );
      })
    }
    this.setState({ showSpinner: false });

  }

  deleteMember = (item) => {

    let dataWithMembers = this.state.dataWithMembers;

    console.log("item", item);

  //  console.log("item.conceptId", item.conceptId);
   console.log("dataWithMembers: ", dataWithMembers);

    let memberToDelete = item?.referencedComponent?.conceptId;
    // Getting member uuid:
    let memberIdToDelete = item?.memberId;

    let answerYes = window.confirm(
      "Are you sure you want to delete this member? This action can't be undone."
    );

    console.log("dataWithMembers:", dataWithMembers);

    let showError = false;

    if (answerYes && dataWithMembers) {
      dataWithMembers.items.forEach((item) => {
        if (item?.referencedComponent?.conceptId && (item?.referencedComponent?.conceptId === memberToDelete)) {
          item.active = false;
          // to make this condition better
          if (!item.referencedComponent.conceptId || !item.referencedComponentId) {
            showError = true;
            console.log("not safe");
          }
          return;
        // } else {
        //   showError = true;
        //   return;
        }
      });

      if(showError) {
        alert("If you see this alert, then this refset contains at least one wrong member without referencedComponent!");
        // return;
      }

      console.log("memberToDelete before changed conceptId/referencedComponentId:", memberToDelete);
      
      console.log("refset is ready for changes!");
      this.callDelete(dataWithMembers, memberIdToDelete);
    } else {
      console.log("Ok, no changes this time.");
    }

  }

  callDelete = (dataWithMembers, memberIdToDelete) => {

    // this.setState({ showSpinner: true });

    console.log("uuid of member to delete in request URL:", memberIdToDelete);

    console.log("dataWithMembers when callPut is called: ", dataWithMembers);

    let branch = encodeURIComponent(this.state.branchFromTheInput.branch);
      // "/MAIN/SNOMEDCT-NO/TEST"

    let terminlogyServer = this.state.terminologyEnvironment;

    let requestUrl =
      terminlogyServer + "/" + branch + "/members/" + memberIdToDelete + "?force=false";

    if (memberIdToDelete) {
      fetch(requestUrl, {
        method: "DELETE",
        credentials: "include",
        headers: {
          // Authorization: "Basic Y29udGVpcjpxN25TeHRGdA==",
          Accept: "application/json"
          // "Content-Type": "application/json",
        },
      })
      .then(() => {
        alert("Deleted");
        this.getRefsetData(this.state.refset);
      });
      // this.setState({ showSpinner: false });
      console.log("dataWithMembers after delete", dataWithMembers);
    } else {
      // console.log("You have to add branch!");
      this.setState({ showSpinner: false });
    }
  };


  render() {
    return (
      <div className="App">

         <header className="jumbotron text-left" style={{ backgroundColor: "#2F4746" }}>
          <img src="assets/logo.png" alt="logo" height="50px"></img>
          <h1>SNOMED CT - OPPDATERING AV REFSET</h1>
        </header>

        <article>
          <div className="form-group">
            
            <div className="col-md-8">

              <div className="row form-group">
                <div style={{}}>
                  <select
                    defaultValue={"DEFAULT"}
                    className="input-width select"
                    onChange={this.getTerminologyEnvironment}
                  >
                    <option 
                        value="DEFAULT" disabled
                        select="default">
                            Velg server:
                    </option>
                    
                    {
                      environments.map((environments, key) => 
                        <option 
                            key={key} 
                            value={environments.urlPart}>
                                  {environments.title}
                        </option>
                      ) 
                    }
                  </select>
                </div>
              </div>

              <div className="row form-group">
                <BranchComponent branchFromChildToParent={this.callbackBranchHandler}/>
              </div>

              <div className="row form-group">
                <RefsetComponent disabled={!this.state.branchFromTheInput}
                  refsetFromChildToParent={this.callbackRefsetHandler} 
                  branch={this.state.branchFromTheInput}
                />
              </div>

              <div className="row form-group">
                <div className="col-md-5">
                    <textarea
                      className="select"
                      aria-label="Input"
                      // id="input_id"
                      type="text"
                      autoComplete="off"
                      placeholder="Legg til ett eller flere medlemmer. Legg til SCTID separert med komma, mellomrom eller linjeskift."
                      onChange={this.getInput}
                    />
                </div>
          
                <div className="col-md-7">
                  {this.state.showContent ? 
                    (<div className="popup">

                      <div className="frame">
                        <span><h2>Refset medlemmer</h2></span>
                      </div>

                      <div className="content">
                        {this.showNames()}
                      </div>
                      
                    </div>)
                  : null}
                </div>
              </div>

              <div>
                <button onClick={this.inputHandler}>Legg til medlem</button>
              </div>

            </div>

          </div>
        </article>

        {this.state.showSpinner && 
          <div>
            <div className="backdrop"></div>
            <div className="spinner-container"><Spinner color="success" /></div>
          </div>
        }
      </div>
    );
  }
};

export default BulkInterface;
