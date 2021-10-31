import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import { Spinner } from "reactstrap";
import HowToComponent from "./HowToComponent";
import RefsetComponent from "./RefsetComponent";
import { terminlogyServer } from "../config";

export const BulkInterface = class BulkInterface extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputFromTextarea: "",
      refset: "",
      requestUrl: "",
      data: {},
      dataWithMembers: {},
      showContent: true,
      headers: {
        // "Access-Control-Allow-Origin": "https://danger-danger.netlify.app",
        Accept: "application/json",
        "Content-Type": "application/json",
        // credentials: "include",
        // SameSite: "None",
        Authorization: "Basic Y29udGVpcjpxN25TeHRGdA=="
      },
      showSpinner: false,
    };
  }

  getInput = (evt) => {
    this.setState({ inputFromTextarea: evt.target.value });
  };

  // callbackBranchHandler = (branch) => {
  //   this.setState({ branchFromTheInput: branch });
  // };

  callbackRefsetHandler = (refset) => {
    this.setState({ refset: refset });
  };

  // callPost = (memberForRequest, membersArray) => {
  inputHandler = () => {

      let member = {
        active: true,
        // additionalFields: {
        //   mapTarget: pair[1],
        // },
        effectiveTime: new Date().toISOString().slice(0, 10).replace(/-/g, ""),
        moduleId: "715152001",
        referencedComponentId: this.state.inputFromTextarea,
        refsetId: this.state.refset
      };

    this.setState({ showSpinner: true });

    // let branch = "MAIN/SNOMEDCT-NO/TESTBRANCH";
    let branch = "MAIN/SNOMEDCT-NO/TEST";

    let requestUrl = terminlogyServer + "/" + branch + "/members";

    const parameters = {
      method: "POST",
      credentials: "include",
      headers: this.state.headers,
      body: JSON.stringify(member),
    };

    fetch(requestUrl, parameters)
      .then((response) => response.json())
      .then((data) => {
        if (member.length > 0) {
          // let nextMember = membersArray.shift();
          this.setState({ data: data, showSpinner: true }); // !!!!!
          console.log("what is the data here after fetch and set? ", data);
          this.callPost(member); // Does it need to be here?
        } else {
          console.log("Data here (inside bulk-import): ", data);
          console.log("refsetId here (inside bulk-import): ", data.refsetId);
          this.setState({ showSpinner: false, data: data });
        }

        this.getMembers(data);
      });

      
  };

  getMembers = (data) => {
    this.setState({ showSpinner: true });

    let refsetId = data.refsetId;
    let referencedComponentId = data.referencedComponentId;

    console.log("data from inputHandler ", data);
    console.log("refsetId from inputHandler ", refsetId);
    console.log("referencedComponentId from inputHandler ", referencedComponentId);


    let branch = "MAIN/SNOMEDCT-NO/TEST";

    let getMembersRequestUrl = terminlogyServer + "/" + branch + "/members";

    const parameters = {
      method: "GET",
      credentials: "include",
      headers: this.state.headers,
      // body: JSON.stringify(member),
    };

    fetch(getMembersRequestUrl, parameters)
      .then((response) => response.json())
      .then((dataWithMembers) => {

        // let elem = dataWithMembers.map((item, index)=> {
        //   return (
        //     <div key={index}>
        //       {console.log("refsetId here (inside bulk-import): ", item)}
        //     </div>
        //   );
        // });

        this.setState({ showSpinner: false, dataWithMembers: dataWithMembers, showContent: true });
        // console.log("dataWithMembers here (inside bulk-import): ", dataWithMembers);
        // this.showNames(dataWithMembers);

      });

  }

  showNames = () => {
    // console.log("dataWithMembers here (inside bulk-import): ", dataWithMembers);
    // let importantData = [];

    if(this.state.dataWithMembers && this.state.dataWithMembers.items) {

      return this.state.dataWithMembers.items.map((item, index) => {
        return (
          <div key={index}>
            {item.referencedComponent.term}
            {console.log("item.referencedComponent.term: ", item.referencedComponent.term)}
            {/* {importantData = item.referencedComponent.term} */}
          </div>
        );
      });
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
                
                <div className="col-md-6">
                    <textarea
                      className="select"
                      aria-label="Input"
                      // id="input_id"
                      type="text"
                      autoComplete="off"
                      placeholder="SCTID
                        (
                          referencedComponentId
                          )"
                      onChange={this.getInput}
                    />
                </div>
          

                <div className="col-md-6">

                  {this.state.showContent ? (
                    <div className="popup">

                      <div className="header">
                        <span>Refset members' names</span>
                        <span
                          className="popup-close"
                          onClick={() => this.setState({ showContent: false })}
                        >
                          X
                        </span>
                      </div>

                      <div className="content">
                        {this.showNames()}
                      </div>
                      
                    </div>
                  ) : null}
                  
                </div>

              </div>

                <div>
                  <button onClick={this.inputHandler}>Add member</button>
                </div>

            </div>




            <div className="col-md-4">
                <HowToComponent />
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
