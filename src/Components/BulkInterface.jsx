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
      branchFromTheInput: "",
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
        "Accept-Language": "en-X-900000000000509007,en-X-900000000000508004,en, no"
      },
      showSpinner: false,
    };
  }

  getInput = (evt) => {
    let inputFromTextarea = evt.target.value;
    if (inputFromTextarea && inputFromTextarea.length > 0) { 
      this.setState({ inputFromTextarea: inputFromTextarea, showSpinner: true });
    } else {
      this.setState({ showSpinner: false });
    }
    console.log("inputFromTextarea", inputFromTextarea);
  };

  callbackBranchHandler = (branch) => {
    this.setState({ branchFromTheInput: branch });
    console.log("selected branch by parent component: ", branch);
  };

  getTerminologyEnvironment = (evt) => {
    let terminologyEnvironment = evt.target.value;
    this.setState({ terminologyEnvironment: terminologyEnvironment, showSpinner: true });
    console.log("Chosen terminology server: ", terminologyEnvironment);
  }

  callbackRefsetHandler = (refset) => {
    let branch = this.state.branchFromTheInput;
    this.setState({ refset: refset, showSpinner: true });
    // let terminologyEnvironment = this.state.terminologyEnvironment;

    let terminologyEnvironment = this.state.terminologyEnvironment;

    console.log("What the hell is here?!", terminologyEnvironment);

    // let terminologyEnvironment = terminologyEnvironment;

    console.log("What the refset is here?!", refset);

    // Handle here the case whan branch = helsedir
    
    let getMembersRequestUrl = terminologyEnvironment + "/" + branch + "/members?referenceSet=" + refset;

    console.log("getMembersRequestUrl", getMembersRequestUrl);


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
      fetch(getMembersRequestUrl, parameters)
        .then((response) => response.json())
        .then((dataWithMembers) => {
          console.log("dataWithMembers", dataWithMembers);
          this.getNOdata(dataWithMembers);
          this.setState({ showSpinner: false, dataWithMembers: dataWithMembers, showContent: true });
        });
      }

  };

  inputHandler = () => {

    if (this.state.refset===undefined || !this.state.inputFromTextarea) {
      alert("You should put data to the text area and chose a refset!");
    }

    this.setState({ showSpinner: true });

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


    let abort = false;
    sctIds.forEach((sctId) => {
      if(
          Array.isArray(this.state.dataWithMembers.items)
          &&
          this.state.dataWithMembers.items.some((mem) => mem.referencedComponent.conceptId === sctId)
        )
      {
        alert("Failed to add members: SCTID " + sctId + " already exists");
        abort = true;
      }
    });
    if(abort) {
      this.setState({ showSpinner: false });
      return;
    }

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
    this.setState({ showSpinner: false });

  };

  callPost = (memberForRequest, membersArray) => {
    let terminologyEnvironment = this.state.terminologyEnvironment;
    let branch = this.state.branchFromTheInput;
    this.setState({ showSpinner: true });

    // let branch = this.state.branchFromTheInput;
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
          console.log("nextMember.referencedComponentId POST", nextMember.referencedComponentId);

          this.callPost(nextMember, membersArray);
        } else {
          this.setState({ showSpinner: false });
        }
      });
  };

  getNOdata = (dataWithMembers) => {

    let conceptIdsArray = [];

    dataWithMembers.items.forEach((item) => {
      // check if "referencedComponent" exist!
      if (item.referencedComponent) {
        conceptIdsArray.push(item.referencedComponent.conceptId);
      } 
    });

    let inputFromTextarea = this.state.inputFromTextarea;
    
    inputFromTextarea = inputFromTextarea.replace(/[ \t\r\n\f]/g, ",");
    let terminlogyServer = this.state.terminologyEnvironment;
    let conceptIds = conceptIdsArray.join(",");
    console.log("Going to fetch conceptIds: ", conceptIds)

    let branch = this.state.branchFromTheInput;

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

          console.log("data before 202 str: ", data);

          data?.items?.forEach((item) => {
            // no need to check item.referencedComponent:
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
            if(item.referencedComponent) {
              item.$$NOTermName = conceptNONameMap[item.referencedComponent.conceptId];
            } 
            // else {
            //   return alert("Error: this member does not contain item.referencedComponent!");
            // }
          });

          this.setState({ data: data }); // !!!!!

          let dataBeforePost = data;
          console.log("data from 2nd GET", data);
          console.log("dataBeforePost", dataBeforePost);


          dataBeforePost?.items?.forEach((item) => {
            if (data && item.conceptId && dataBeforePost) {
              console.log("item.conceptId", item.conceptId);
              console.log("inputFromTextarea", this.state.inputFromTextarea);
  
              if (inputFromTextarea === item.conceptId) {
                alert("иди нахуй!");
              };

            } else {
              alert("There is no data or no referencedComponent || conceptId");
              return;
            };

          });
          // let conceptToCheck = dataBeforePost.map((item) => {
          //   return item.conceptId;
          // });

      });

  }

  showNames = () => {
    if(this.state.dataWithMembers && this.state.dataWithMembers.items) {
      return this.state.dataWithMembers.items.map((item, index) => {
            return (
              <div key={index}>

                <div className="row">
                
                    <div className="col-md-10">
                      
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
                            {item?.$$NOTermName}
                        </div>
                      </div>

                    </div>

                    <div className="col-md-2">

                    <div>
                      <button 
                        onClick={() => this.deleteMember(item)} 
                        className={'secondary'}
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


   // to define!!
   let memberToDelete = item?.referencedComponent?.conceptId;

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
          return;
        } else {
          showError = true;
          return;
        }
      });

      if(showError) {
        alert("This refset contains at least one wrong member without referencedComponent!");
        return;
      }

      console.log("memberToDelete before hanges:", memberToDelete);
      
      this.setState=({ memberToDelete: memberToDelete});

      console.log("refset is ready for changes!");
      this.callDelete(dataWithMembers, memberIdToDelete);
    } else {
      console.log("Ok, no changes this time.");
    }

  }

  callDelete = (dataWithMembers, memberIdToDelete) => {

    // this.setState({ showSpinner: true });

    console.log("member to delete in request URL:", memberIdToDelete);

    console.log("dataWithMembers when callPut is called: ", dataWithMembers);

    let branch = this.state.branchFromTheInput
      // "/MAIN/SNOMEDCT-NO/TEST"
      ;

    let terminlogyServer = this.state.terminologyEnvironment;

    let requestUrl =
      terminlogyServer + branch + "/members/" + memberIdToDelete + "?force=false";

    if (memberIdToDelete) {
      fetch(requestUrl, {
        method: "DELETE",
        credentials: "include",
        headers: {
          // Authorization: "Basic Y29udGVpcjpxN25TeHRGdA==",
          Accept: "application/json"
          // "Content-Type": "application/json",
        },
      });
      // this.setState({ showSpinner: false });
      console.log("dataWithMembers after delete", dataWithMembers);
    } else {
      // console.log("You have to add branch!");
      this.setState({ showSpinner: false });
    }
    alert("You have deleted a member!");
  };


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
                <div>
                  <select
                    defaultValue={"DEFAULT"}
                    className="input-width select"
                    onChange={this.getTerminologyEnvironment}
                >
                    <option 
                        value="DEFAULT" disabled
                        select="default">
                            Please, select a terminology server (choose wisely):
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
                <RefsetComponent disabled={!this.state.branchFromTheInput || this.state.branchFromTheInput.length === 0}
                  refsetFromChildToParent={this.callbackRefsetHandler}
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
                      placeholder="Please, enter one or several SCTIDs
                        (f.eks 233604007, 37271000202109)"
                      onChange={this.getInput}
                    />
                </div>
          
                <div className="col-md-7">
                  {this.state.showContent ? (
                    <div className="popup">

                      <div className="frame">
                        <span><h2>Refset medlemmer</h2></span>
                      </div>

                      <div className="content">
                        {this.showNames()}
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
