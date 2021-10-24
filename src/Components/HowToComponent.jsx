import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  CollapsibleComponent,
  CollapsibleHead,
  CollapsibleContent,
} from "react-collapsible-component";
import "../index.css";

export const HowToComponent = class HowToComponent extends React.Component {
  render() {
    return (
      <CollapsibleComponent>
          <CollapsibleHead>
            Documentation
          </CollapsibleHead>

          <CollapsibleContent>
            <div style={{ backgroundColor: "#3ec28f30" }}>
              <h5>
                <p>The format is: [conceptId(SCTID):mapTatget].</p>
                <p>191736004;P79</p>
                <p>63977007; S86</p>
                <p>88594005 ;S71</p>
              </h5>
              <h5>
                <p>
                  You can also leave the "mapTarget" field empty if you only
                  want to add a refset member (subset)
                </p>
              </h5>
              <h4>
                <b>
                  Please be sure that you have made a new line after each pair!
                </b>
              </h4>
              <h5>
                <p>Values of the refsets:</p>
                <p>ICPC-2: 450993002</p>
                <p>TEST1: 123456789</p>
                <p>TEST2: 666666666</p>
              </h5>
              <h5>
                <p>Use this branch: MAIN/SNOMEDCT-NO/TESTBRANCH</p>
                <p>
                  <b>
                    Make sure that you don't have extra spaces before the branch
                    and after
                  </b>
                </p>
                <p>
                  If you use random symbols instead of branch, it returns an
                  error, because the request can not be sent to the not existing
                  url (which uses a branch name as a component of url).
                </p>
              </h5>
            </div>
          </CollapsibleContent>
      </CollapsibleComponent>
    );
  }
};

export default HowToComponent;
