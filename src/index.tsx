import * as React from "react";
import { render } from "react-dom";
import RCTreeDemo from "./rc-tree-demo";
import { AmplifyAuthenticator, AmplifySignIn } from "@aws-amplify/ui-react"; ////

import "./styles.css";

/*
function App() {
  return (
    <AmplifyAuthenticator>
      <div className="App">
        <RCTreeDemo />
      </div>
    </AmplifyAuthenticator>
  );
}*/

function App() {
  return (
    //<AmplifyAuthenticator>
        <div className="App">
          <RCTreeDemo />
        </div>
    //</AmplifyAuthenticator>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
