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
      headers: {
        // "Access-Control-Allow-Origin": "https://danger-danger.netlify.app",
        Accept: "application/json",
        "Content-Type": "application/json",
        credentials: "include",
        SameSite: "None"
        // Authorization: "Basic Y29udGVpcjpxN25TeHRGdA==",
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

  inputHandler = () => {
    this.setState({ showSpinner: true });

    let inputFromTextarea = this.state.inputFromTextarea;
    let splitedPairs = [];
    let membersArray = [];

    if (!inputFromTextarea) {
      return console.log("Please, put the list of values!");
    }

    let pairs = inputFromTextarea.match(/[^\n\r]+/g);

    pairs.forEach((pair) => {
      let pairArray = pair.split(";");

      pairArray[0] = pairArray[0].trim();
      pairArray[1] = pairArray[1] || "";
      pairArray[1] = pairArray[1].trim();

      splitedPairs.push(pairArray);
    });

    splitedPairs.forEach((pair) => {
      let member = {
        active: true,
        additionalFields: {
          mapTarget: pair[1],
        },
        effectiveTime: new Date().toISOString().slice(0, 10).replace(/-/g, ""),
        moduleId: "715152001",
        referencedComponentId: pair[0],
        refsetId: this.state.refset,
      };

      membersArray.push(member);
    });

    let memberForRequest = membersArray.shift();

    this.callPost(memberForRequest, membersArray);
  };

  callPost = (memberForRequest, membersArray) => {
    this.setState({ showSpinner: true });

    let branch = "MAIN/SNOMEDCT-NO/TESTBRANCH";
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
          let nextMember = membersArray.shift();
          this.callPost(nextMember, membersArray);
        } else {
          this.setState({ showSpinner: false });
        }
      });
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
            
            <div className="col-md-6">

              <div className="row form-group">
                <RefsetComponent
                  refsetFromChildToParent={this.callbackRefsetHandler}
                />
              </div>
              <div className="row form-group">
                {/* MAIN/SNOMEDCT-NO/HELSEDIREKTORATET */}
                  {/* MAIN/SNOMEDCT-NO/TESTBRANCH */}
              </div>

              <div>
                <textarea
                  className="select"
                  aria-label="Input"
                  // id="input_id"
                  type="text"
                  autoComplete="off"
                  placeholder="SCTID;mapTarget"
                  onChange={this.getInput}
                />
              </div>

                <div>
                  <button onClick={this.inputHandler}>IMPORT</button>
              </div>
            </div>

            <div className="col-md-6">
                <HowToComponent />
              </div>
              {this.state.showSpinner ? <Spinner color="success" /> : null}
            </div>
        </article>
      </div>
    );
  }
};

export default BulkInterface;
