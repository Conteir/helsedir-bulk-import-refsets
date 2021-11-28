import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import { Spinner } from "reactstrap";
import NewTermComponent from "./NewTermComponent";
import BranchComponentTranslations from "./BranchComponentTranslations";
import AcceptabilityStatusComponent from "./AcceptabilityStatusComponent";
import RefsetIDComponent from "./RefsetIDComponent";
import DescriptionRenderComponent from "./DescriptionRenderComponent";
import EnvironmentComponent from "./EnvironmentComponent";
import { proxy } from "../config";

export const TranslationInterface = class TranslationInterface extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      environment: "",
      newTerm: "",
      acceptabilityStatusFromTheInput: "",
      branchFromTheInput: "",
      sctid: "",
      refsetID: "",
      requestUrl: "",
      showSpinner: false,
      data: {},
      showContent: false,
      acceptabilityPairs: [],
      preferredRefsets: {},
    };
  }

  checkPreffered = (refsetID, typeSynonim) => {
    if (typeSynonim === "PREFERRED" && this.state?.preferredRefsets[refsetID]) {
      console.log(
        "PREFERRED term for this REFSET already exists in description: " +
          this.state.preferredRefsets[refsetID] +
          "!"
      );
      alert(
        "PREFERRED term for this REFSET in this description already exists!"
      );
      return;
    }
  };

  callbackRefsetIDHandler = (refsetID) => {
    this.setState({ refsetID: refsetID });
    this.checkPreffered(refsetID, this.state.acceptabilityStatusFromTheInput);
  };

  callbackAcceptabilityStatusHandler = (acceptabilityStatus) => {
    this.setState({ acceptabilityStatusFromTheInput: acceptabilityStatus });
    console.log("type synonim is...", acceptabilityStatus);
    this.checkPreffered(this.state.refsetID, acceptabilityStatus);
  };

  getSCTID = (evt) => {
    let sctid = evt.target.value;
    console.log("Getting SCTID...", sctid);
    this.setState({ sctid: sctid }); // make it sure as well
    this.searchSCTID(sctid, this.state.branchFromTheInput); // the same effect if press SØK instead of calling the funct with this way
  };

  callbackBranchHandler = (branch) => {
    this.setState({ branchFromTheInput: branch });
    console.log("this is the branch!", branch);
    this.searchSCTID(this.state.sctid, branch);
  };

  callbackEnvironmentHandler = (environment) => {
    this.setState({ environment: environment });
    console.log("this is the environment!", environment);
    // this.searchSCTID(this.state.sctid, branch);
  };

  // callbackBranchHandler = (branch) => {
  //   this.setState({ branchFromTheInput: branch });
  //   console.log("this is the branch!", branch);
  //   // this.createConcept(this.state.pt, branch);
  // };

  searchSCTID = (sctid, branch) => {
    let arrayWithConceptDescriptions = [];
    let environment = this.state.environment;
    this.setState({ showSpinner: true, sctid: sctid });

    console.log("what is sctid in searchSCTID funct? ", sctid);

    if (!sctid) {
      this.setState({ showSpinner: false });
      return console.log(
        "Please, put the values! (sctid && newTerm && synonim type && refsetID"
      );
    }

    let requestUrl = environment + "/browser/" + branch + "/concepts/" + sctid;
    console.log("branch", branch);
    console.log("requestUrl", requestUrl);

    if (branch && sctid) {
      console.log("sctid at the beginning: " + sctid);

      fetch(requestUrl, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: "Basic Y29udGVpcjpxN25TeHRGdA==",
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("data from the response: ", data);
          this.setState({ data: data, showSpinner: false }); // !!!!!

          if (data) {
            let preferredRefsets = {};
            data.descriptions.forEach((desc) => {
              if (desc.type === "SYNONYM") {
                for (let refsetID in desc.acceptabilityMap) {
                  if (
                    desc.acceptabilityMap[refsetID] === "PREFERRED" &&
                    !preferredRefsets[refsetID]
                  ) {
                    preferredRefsets[refsetID] = desc.term; // optional, to use a value later
                  }
                }
              }
            });
            this.setState({ preferredRefsets: preferredRefsets });
          }

          arrayWithConceptDescriptions.push(data.descriptions);
          console.log(
            "arrayWithConceptDescriptions: ",
            arrayWithConceptDescriptions
          );
        });
    } else {
      console.log("You have to add branch!");
    }

    this.setState({ showContent: true });
  };

  POSThandler = () => {
    console.log("data taken from GET", this.state.data);

    this.setState({ showSpinner: true });

    let member = {
      active: true,
      moduleId: "51000202101",
      term: this.state.newTerm,
      conceptId: this.state.sctid,
      typeId: "900000000000013009",
      acceptabilityMap: {},
      type: "SYNONYM",
      caseSignificance: "CASE_INSENSITIVE",
      lang: "no",
      effectiveTime: new Date().toISOString().slice(0, 10).replace(/-/g, ""),
    };

    member.acceptabilityMap[this.state.refsetID] =
      this.state.acceptabilityStatusFromTheInput;

    let data = this.state.data;

    console.log(
      "this.state.typeSynonimFromTheInput",
      this.state.typeSynonimFromTheInput
    );

    data.descriptions.push(member);
    this.callPut(data);

    console.log(member);
  };

  callPut = (data) => {
    this.setState({ showSpinner: true });
    console.log("data when callPut is called: ", data);

    let environment = this.state.environment;
    let branch = this.state.branchFromTheInput;
    let requestUrl =
      environment + "/browser/" + branch + "/concepts/" + this.state.sctid;

    if (data) {
      fetch(requestUrl, {
        method: "PUT",
        credentials: "include",
        headers: {
          Authorization: "Basic Y29udGVpcjpxN25TeHRGdA==",
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      this.setState({ showSpinner: false });
    } else {
      console.log("You have to add branch!");
      this.setState({ showSpinner: false });
    }
    alert("You have just updated a concept with the new term!");
  };

  callbackTermHandler = (newTerm) => {
    this.setState({ newTerm: newTerm });
    console.log("newTerm is...", newTerm);
  };

  deleteDescriptionCallback = (descrToDelete) => {
    console.log(descrToDelete.descriptionId);

    let answerYes = window.confirm(
      "Are you sure you want to deactivate this description? This action can't be undone."
    );
    if (answerYes) {
      this.state.data.descriptions.forEach((descr) => {
        if (descr.descriptionId === descrToDelete.descriptionId) {
          descr.active = false;
          return;
        }
      });

      this.callPut(this.state.data);
    } else {
      console.log("Ok, no changes this time.");
    }
  };

  updateTermCallback = (descrToUpdate) => {
    console.log("descrToUpdate", descrToUpdate); // works fine
    console.log("newTerm", this.state.newTerm);

    let updatedTerm = this.state.newTerm;

    this.state.data.descriptions.forEach((descr) => {
      if (descr.descriptionId === descrToUpdate.descriptionId) {
        descrToUpdate.term = updatedTerm;
        console.log("updatedTerm on the last stage: ", updatedTerm);
        return;
      }
    });

    this.callPut(this.state.data);
  };

  render() {
    return (
      <div className="App">
        <header
          className="jumbotron text-left"
          style={{ backgroundColor: "#2F4746" }}
        >
          <img src="assets/logo.png" alt="logo" height="50px"></img>
          <h1>SNOMED CT - OVERSETTELSESAPP</h1>
        </header>

        <article>
          <div className="row">
            <div className="row col-md-12"></div>
          </div>

          <div className="container">
            <div className="row">
              <div className="form-group col-md-6">
                <EnvironmentComponent
                  environmentFromChildToParent={this.callbackEnvironmentHandler}
                />
                Velg environment
              </div>
            </div>

            <div className="row">
              <div className="form-group col-md-6">
                <BranchComponentTranslations
                  branchFromChildToParent={this.callbackBranchHandler}
                />
                Skriv BRANCH here
              </div>

              <div className="form-group col-md-6">
                <div>
                  <input
                    id="Input"
                    className="input-width"
                    placeholder="SCTID"
                    onChange={this.getSCTID}
                    ref={this.sctid}
                  />
                </div>
                SNOMED CT-ID til begrepet du vil oversette
              </div>
            </div>

            <div className="row">
              <div className="form-group col-md-12">
                {this.state.showContent ? (
                  <div className="popup">
                    <div className="header">
                      <span>Termer</span>
                      <span
                        className="popup-close"
                        onClick={() => this.setState({ showContent: false })}
                      >
                        X
                      </span>
                    </div>

                    <div className="content">
                      <DescriptionRenderComponent
                        renderDescriptionsData={this.state.data}
                        deleteDescription={this.deleteDescriptionCallback}
                        updateTerm={this.updateTermCallback}
                      />{" "}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="row">
              <div className="form-group col-md-6">
                <RefsetIDComponent
                  refsetIDFromChildToParent={this.callbackRefsetIDHandler}
                />
              </div>

              <div className="form-group col-md-6">
                <AcceptabilityStatusComponent
                  acceptabilityStatusFromChildToParent={
                    this.callbackAcceptabilityStatusHandler
                  }
                />
              </div>
            </div>

            <div className="row">
              <div className="form-group col-md-6">
                <NewTermComponent
                  placeholder="Ny oversettelse"
                  termFromChildToParent={this.callbackTermHandler}
                />
              </div>

              <div className="form-group col-md-6 flex-align-center">
                {/* <div className="row"> */}

                <button onClick={this.POSThandler}>Post</button>

                <span className="spinner-container">
                  {this.state.showSpinner ? <Spinner color="success" /> : null}
                </span>

                {/* </div> */}
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }
};

export default TranslationInterface;
