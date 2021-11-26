import BulkInterface from "./Components/BulkInterface";
import TranslationInterface from "./Components/TranslationInterface";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import './App.css';

function App() {
  return (
    <div>
       <Router>
          <Nav variant="tabs" defaultActiveKey={window.location.pathname}>
              <Nav.Link href="/">Bulk-import</Nav.Link>
              <Nav.Link href="/translation">Translation</Nav.Link>
          </Nav>

          <Switch>
              <Route exact path="/"
                component={BulkInterface}>
                  <BulkInterface/>
              </Route>

              <Route path="/translation" 
                component={TranslationInterface}>
                  <TranslationInterface />
              </Route>
          </Switch>

      </Router>
    </div>

  );
}

export default App;