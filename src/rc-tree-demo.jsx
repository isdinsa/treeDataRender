import React, { useState } from "react";
import "./dropdown.less";
import "./assets/index.less";
import "./simplecss.css";
import styled from "styled-components";

//import Tree from '../Tree.jsx';
import Tree, { TreeNode } from "rc-tree";
import "@aws-amplify/ui-react";
import Amplify, { Storage, Auth } from "aws-amplify";

import Information from "./components/information.component";
import Validation from "./components/validation.component";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ListGroup from "react-bootstrap/ListGroup";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";

import { OverlayPopoverAddFeature } from "./components/options/overlay-popover-add-feature.component";
import { OverlayPopoverAddGroup } from "./components/options/overlay-popover-add-group.component";
import { OverlayPopoverRemoveFeature } from "./components/options/overlay-popover-remove-feature.component";
import { OverlayPopoverRemoveGroup } from "./components/options/overlay-popover-remove-group.component";
import Prueba from "./components/prueba";
import MyModal from "./components/modal.component";

import { AmplifySignIn, AmplifyAuthenticator } from "@aws-amplify/ui-react"; ////

//const featureListTest = [{"cost":"5","excludes":"noE","featureType":"mandatory","fid":"'Aircraft","requires":"noR"},{"cost":"5","excludes":"noE","featureType":"optional","fid":"'GPS","requires":"noR"},{"cost":"5","excludes":"noE","featureType":"mandatory","fid":"'Inertial_Navigation","requires":"noR"},{"cost":"5","excludes":"noE","featureType":"optional","fid":"'Laser","requires":"noR"},{"cost":"5","excludes":"noE","featureType":"mandatory","fid":"'Navigation_Avionics","requires":"noR"},{"cost":"5","excludes":"noE","featureType":"optional","fid":"'Std","requires":"noR"},{"cost":"0","excludes":"noE","featureType":"mandatory","fid":"root","requires":"noR"}]
//const groupListTest = [{"fid":"'Aircraft","groups":[{"features":[{"fid":"'Navigation_Avionics"}],"gid":"'aircraft_tech","groupType":"AND"}]},{"fid":"'GPS","groups":"noG"},{"fid":"'Inertial_Navigation","groups":[{"features":[{"fid":"'Laser"},{"fid":"'Std"}],"gid":"'devices","groupType":"ALTERNATIVE"}]},{"fid":"'Laser","groups":"noG"},{"fid":"'Navigation_Avionics","groups":[{"features":[{"fid":"'GPS"}],"gid":"'location","groupType":"AND"},{"features":[{"fid":"'Inertial_Navigation"}],"gid":"'navigation","groupType":"AND"}]},{"fid":"'Std","groups":"noG"},{"fid":"root","groups":[{"features":[{"fid":"'Aircraft"}],"gid":"rootGroup","groupType":"AND"}]}]
import "./icon.less";
import { AmplifySignOut } from "@aws-amplify/ui-react";
const URL_BASE_CONSTRUCT = "https://dbc300b58a44.ngrok.io/";
const URL_BASE_SELECT = "https://0448a91ba998.ngrok.io/";

const rootLabel = (
  <span className="cus-label">
    <span style={{ color: "black" }}>Root</span>
    &nbsp;
    <label style={{ fontSize: "10px" }} onClick={(e) => e.stopPropagation()}>
      Mandatory: <input type="checkbox" checked={true} />
    </label>
    <span></span>
  </span>
);

function hijosTree(groupList, actualF) {
  let hijos = [];

  for (let i = 0; i < groupList.length; i++) {
    if (groupList[i]["fid"] == actualF) {
      let grupos = groupList[i]["groups"];
      if (grupos == "noG") return [];
      for (let j = 0; j < grupos.length; j++) {
        grupos[j]["features"].forEach((ft) => (hijos = hijos.concat(ft)));
      }
    }
  }

  return hijos;
}

function constructTree(flist, groupList, feature) {
  let fidHijos = [];
  hijosTree(groupList, feature).forEach(
    (hijo) => (fidHijos = fidHijos.concat(hijo["fid"]))
  );
  let resHijos = [];

  //resHijos = resHijos.concat(fidHijos.forEach(fid => constructTree(groupList, fid)));

  fidHijos.forEach(
    (fid) => (resHijos = resHijos.concat(constructTree(flist, groupList, fid)))
  );

  if (feature == "noF") {
    return [];
  }

  /*ejemplo filtro flist:
  [{"cost":"12","excludes":"noE","featureType":"mandatory","fid":"'asd","requires":"noR"},
  {"cost":"0","excludes":"noE","featureType":"mandatory","fid":"root","requires":"noR"}
  ].filter(feature => feature["fid"] == ("root" || "feature")).map(elem => elem["featureType"])
  */

  let tipoFeature = typeOfFeature(flist, feature);
  let descripcionGid = gidOfFeaturePretty(groupList, feature);

  let titulo;
  if (tipoFeature === "mandatory") {
    titulo = (
      <span
        id={feature === "root" ? "rootTrasparente" : ""}
        className="customize-icon"
      >
        {" "}
        &nbsp; &nbsp; {feature.replace("'", "")} {descripcionGid}{" "}
      </span>
    );
  } else {
    titulo = (
      <span className="customize-icon sub-icon">
        {" "}
        &nbsp; &nbsp; {feature.replace("'", "")} {descripcionGid}{" "}
      </span>
    );
  }

  let tree = {
    key: feature,
    title: [titulo],
    children: resHijos,
  };

  return [tree];
}

function typeOfFeature(flist, fid) {
  for (let i = 0; i < flist.length; i++) {
    if (flist[i]["fid"] === fid) {
      return flist[i]["featureType"];
    }
  }
}

//ejemplo glist: let glist = [ { fid: "'futbol", groups: "noG" }, { fid: "'hijo1", groups: "noG" },
//{ fid: "'padre", groups: [ { features: [ { fid: "'hijo1" } ], gid: "'familia", groupType: "AND" },
//{ features: [ { fid: "'futbol" } ], gid: "'hobbies", groupType: "AND" } ] },
//{ fid: "root", groups: [ { features: [ { fid: "'padre" } ], gid: "rootGroup", groupType: "AND" } ] } ]
function gidOfFeaturePretty(glist, fid) {
  if (fid === "root") {
    return <span id="descripcionGid">(Ø)</span>;
  }

  for (let i = 0; i < glist.length; i++) {
    if (glist[i].groups !== "noG")
      //let features = glist[i].groups;
      for (let j = 0; j < glist[i].groups.length; j++) {
        let features = glist[i].groups[j].features;
        for (let k = 0; k < features.length; k++) {
          let fid2 = features[k].fid;
          if (fid2 === fid) {
            //console.log("fid es :"+fid2)
            //console.log("padre es" + glist[i].fid)
            let gidToReturn = glist[i].groups[j].gid;
            //console.log("gidToReturn es: "+gidToReturn)
            return (
              <span id="descripcionGid">({gidToReturn.replace("'", "")})</span>
            );
          }
        }
      }
  }

  console.log(
    "doy noGG donde glist es: " + JSON.stringify(glist) + " y fid es " + fid
  );

  return <span id="descripcionGid">(noGG)</span>;
}

const enviarRequest = async (url) => {
  const response = await fetch(url);
  if (response.ok) {
    let json = await response.json();
    return json;
  } else {
    alert("Error al enviar el request: " + response);
    return -1;
  }
};

const initialState = {
  maxBudgetUpdated: false,
  filename: "",
  keyTitles: "",
  stateAux: "X",
  autenticado: true,
  usuario: "prueba1",
  checkeadas: ["root"],
  featureList: [
    {
      fid: "root",
      featureType: "mandatory",
      requires: "noR",
      excludes: "noE",
      cost: "0",
    },
  ],
  groupList: [
    {
      fid: "root",
      groups: [
        { groupType: "AND", gid: "rootGroup", features: [{ fid: "noF" }] },
      ],
    },
  ],

  treeData: constructTree(
    [
      {
        fid: "root",
        featureType: "mandatory",
        requires: "noR",
        excludes: "noE",
        cost: "0",
      },
    ],
    [
      {
        fid: "root",
        groups: [
          {
            groupType: "AND",
            gid: "rootGroup",
            features: [{ fid: "noF" }],
          },
        ],
      },
    ],
    "root"
  ),
  /*
  treeData : [
    {
      key: '0-0',
      title: [rootLabel],
      children: [{
        key: '0-0-1',
        title: 'hijo',
        children: [ ],
      } ],
    },
    {
      key: '0-1',
      title: 'probando',
      children: [ ],
    }
  ],*/

  listOfActions: "",
  resultConfiguration: "",
  selected: [],
  fm:
    "FM(< root | f(mandatory, noR, noE, 0) > , [ root -> g(AND, rootGroup, noF)])",
  featurelistfm: "< root | f(mandatory, noR, noE, 0) >",
  grouplistfm: "[ root -> g(AND, rootGroup, noF)]",
  configurationChecked:
    "{[ root -> g(AND, rootGroup, noF)], < root | f(mandatory, noR, noE, 0) >, root, 0, noF}",
  inputBudget: 500,
  maxBudget: 500,
  maxBudgetChanged: true,
};

let logs = ["X"];
let indexState = 0;

class Demo extends React.Component {
  constructor(props) {
    super(props);
    const { keys } = props;
    this.state = {
      defaultExpandedKeys: keys,
      //defaultSelectedKeys: keys,
      defaultCheckedKeys: keys,
      //treeData : [],
      checkeadas : ["root"],

      /*
      treeData : [
        {
          key: '0-0',
          title: [rootLabel],
          children: [{
            key: '0-0-1',
            title: 'hijo',
            children: [ ],
          } ],
        },
        {
          key: '0-1',
          title: 'probando',
          children: [ ],
        }
      ],*/


      

      featureList : [{'fid': 'root', 'featureType': 'mandatory', 'requires': 'noR', 'excludes': 'noE', 'cost': '0'}],
      groupList : [{'fid': 'root', 'groups': [{'groupType': 'AND', 'gid': 'rootGroup', 'features': [{'fid': 'noF'}]}]}],

      treeData : constructTree([{'fid': 'root', 'featureType': 'mandatory', 'requires': 'noR', 'excludes': 'noE', 'cost': '0'}],
      [{'fid': 'root', 'groups': [{'groupType': 'AND', 'gid': 'rootGroup', 'features': [{'fid': 'noF'}]}]}],
      "root"),listOfActions : "",

      resultConfiguration : "",
      selected : [],
      fm : "FM(< root | f(mandatory, noR, noE, 0) > , [ root -> g(AND, rootGroup, noF)] )",
      featurelistfm : "< root | f(mandatory, noR, noE, 0) >",
      grouplistfm : "[ root -> g(AND, rootGroup, noF)]",
      configurationChecked : "{[ root -> g(AND, rootGroup, noF)], < root | f(mandatory, noR, noE, 0) >, root, 0, noF}",
      maxBudget : 500,
      autenticado: true,
      usuario: "prueba1",
    };

    this.treeRef = React.createRef();

    this.handleAddFeature = this.handleAddFeature.bind(this);
    this.handleAddGroup = this.handleAddGroup.bind(this);
    this.handleRemoveFeature = this.handleRemoveFeature.bind(this);
    this.handleRemoveGroup = this.handleRemoveGroup.bind(this);
    this.onCleanChecks = this.onCleanChecks.bind(this);
    //this.onBudget = this.onBudget.bind(this);
    this.handleChangeBudget = this.handleChangeBudget.bind(this);
    this.handleChangeInputBudget = this.handleChangeInputBudget.bind(this);
    this.onUpdateBudget = this.onUpdateBudget.bind(this);
    this.onSendUserJson = this.onSendUserJson.bind(this);
    this.onCheckUserJson = this.onCheckUserJson.bind(this);
    this.signOut = this.signOut.bind(this);
    this.handleAuthStateChangeSignIn = this.handleAuthStateChangeSignIn.bind(
      this
    );
    this.handleAuthStateChangeLogout = this.handleAuthStateChangeLogout.bind(
      this
    );
    this.recoverState = this.recoverState.bind(this);
    this.listarFicheros = this.listarFicheros.bind(this);
    this.handleChangeInputFileName = this.handleChangeInputFileName.bind(this);
    this.handleLoadFile = this.handleLoadFile.bind(this);
    this.handleUploadFile = this.handleUploadFile.bind(this);
    this.textInput = React.createRef();
  }

  async updateListFiles() {
    let keys = [];

    await Storage.list("") // for listing ALL files without prefix, pass '' instead
      .then((result) =>
        result
          .slice(0, 10)
          .forEach((elem) => (elem.key === "" ? elem : keys.push(elem.key)))
      )
      .catch((err) => console.log(err));

    this.setState({ keyTitles: keys });
  }

  async componentDidMount() {
    this.updateListFiles();
  }

  signOut() {
    Auth.signOut()
      .then((data) => console.log(data))
      .catch((err) => console.log(err));

    //this.clearState();

  }

  async listarFicheros() {
    let keys = [];
    await Storage.list("") // for listing ALL files without prefix, pass '' instead
      .then((result) => result.forEach((elem) => keys.push(elem.key)))
      .catch((err) => console.log(err));

    return keys;
  }

  async handleLoadFile(key, exit) {
    let url = "";
    await Storage.get(key)
      .then((result) => (url = result))
      .catch((err) => console.log(err));

    //console.log("url es: " + url);

    fetch(url)
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));

    exit();
  }

  async handleUploadFile() {
    if (this.state.filename === "") {
      alert("Please enter a name for the session you want to save");
    } else {
      let ficheros = await this.listarFicheros();
      if (ficheros.includes(this.state.filename)) {
        alert("This name already exists. Please choose a different one");
      } else {
        await Storage.put(this.state.filename, {
          at1: "asd",
          at2: "xyz",
          autor: this.state.filename,
        })
          .then((result) => console.log(result)) // {key: "test.txt"}
          .catch((err) => console.log(err));
      }

      await this.updateListFiles();
    }
    console.log("handleUploadFile");
  }

  onSendUserJson(newState) {
    console.log("currentIndex" + indexState + " logs:" + logs);
    if (indexState == logs.length - 1) {
      console.log("HEY");
      Storage.put(this.state.usuario + "json.json", this.state)
        .then((result) => console.log(result)) // {key: "test.txt"}
        .catch((err) => console.log(err));

      logs = logs.concat(newState);
      indexState = indexState + 1;
      this.setState({
        stateAux: newState,
      });
    } else {
      //let newLogs = logs.slice(0, currentIndex + 1);
      //newLogs.push(newState);
      //logs = newLogs;
      console.log("AYYY" + logs);
      logs = logs.slice(0, indexState + 1).concat(newState);

      indexState = indexState + 1;
      this.setState({
        stateAux: newState,
      });
    }

    console.log("onSendUserJson: logs=" + logs);
  }

  recoverState(recoverIndex) {
    indexState = recoverIndex;
    console.log(
      "stateAux antes es: " +
        this.state.stateAux +
        " y recoverIndex es:" +
        recoverIndex +
        " y indexState es: " +
        indexState
    );
    this.setState({ stateAux: logs[recoverIndex] });
    //console.log("stateAux:"+this.state.stateAux+" el index actual es: "+recoverIndex);
    console.log("stateAux despues es: " + this.state.stateAux);
  }

  onCheckUserJson = () => {
    Storage.get(this.state.usuario + "json.json")
      .then((obj) => console.log("Existe " + obj))
      .catch((err) => console.log("Error " + err));
  };

  handleChangeInputBudget(budget) {
    // eslint-disable-next-line no-restricted-globals
    event.preventDefault();
    this.setState({
      inputBudget: parseInt(budget),
      maxBudgetChanged: false,
      maxBudgetUpdated: false,
    });
  }

  handleChangeInputFileName(name) {
    this.setState({
      filename: name,
    });
  }

  async handleAddGroup(fid, gid, type) {
    
    console.log("estoy en handleAddGroup")
    // eslint-disable-next-line no-restricted-globals
    event.preventDefault();
    const currentConfiguration = this.state.fm;
    const URL =
      URL_BASE_CONSTRUCT +
      "addgroup" +
      "/" +
      currentConfiguration +
      "/" +
      fid +
      "/" +
      gid +
      "/" +
      type;
    const responseJson = await enviarRequest(URL);

    console.log("JAJAJA"+JSON.stringify(responseJson)+"status: "+responseJson["status"])
    // otra opcion: const response = await fetch(URL); const json = await response.json(); glist = json["groupList"];

    if (responseJson !== -1) {
      //request okey
      if (responseJson["status"] == 0) {
        let glist = responseJson["groupList"];
        let flist = responseJson["featureList"];
        let finalConfiguration = responseJson["FM"];
        let flConfiguration = responseJson["featurelistFM"];
        let glConfiguration = responseJson["grouplistFM"];
        let resultConfiguration = responseJson["resultConfiguration"];
        console.log(
          "en handleAddGroup, resultConfiguration: " + resultConfiguration
        );

        this.setState({
          groupList: glist,
          featureList: flist,
          treeData: constructTree(flist, glist, "root"),
          fm: finalConfiguration,
          featurelistfm: flConfiguration,
          grouplistfm: glConfiguration,
          configurationChecked:
            "{" + glConfiguration + ", " + flConfiguration + ", root, 0, noF}",
          checkeadas: ["root"],
        });
      } else {
        alert(responseJson["error"]);
      }
      console.log("JOOJOJOJJOJOJOJO")
    }
  }

  async handleRemoveGroup(gid) {
    // eslint-disable-next-line no-restricted-globals
    event.preventDefault();
    const currentConfiguration = this.state.fm;
    const URL =
      URL_BASE_CONSTRUCT +
      "removegroup" +
      "/" +
      currentConfiguration +
      "/" +
      gid;
    console.log(URL);
    const responseJson = await enviarRequest(URL);

    if (responseJson !== -1) {
      //request okey

      if (responseJson["status"] == 0) {
        let glist = responseJson["groupList"];
        let flist = responseJson["featureList"];
        let finalConfiguration = responseJson["FM"];
        let flConfiguration = responseJson["featurelistFM"];
        let glConfiguration = responseJson["grouplistFM"];

        this.setState({
          groupList: glist,
          featureList: flist,
          treeData: constructTree(flist, glist, "root"),
          fm: finalConfiguration,
          featurelistfm: flConfiguration,
          grouplistfm: glConfiguration,
          configurationChecked:
            "{" + glConfiguration + ", " + flConfiguration + ", root, 0, noF}",
          checkeadas: ["root"],
        });
      } else {
        alert(responseJson["error"]);
      }
    }
  }

  async handleAddFeature(fid, gid, type, cost) {
    // eslint-disable-next-line no-restricted-globals
    event.preventDefault();
    const currentConfiguration = this.state.fm;
    const URL =
      URL_BASE_CONSTRUCT +
      "addfeature" +
      "/" +
      currentConfiguration +
      "/" +
      fid +
      "/" +
      gid +
      "/" +
      type +
      "/" +
      cost;
    const responseJson = await enviarRequest(URL);

    if (responseJson !== -1) {
      //request okey
      if (responseJson["status"] == 0) {
        let glist = responseJson["groupList"];
        let flist = responseJson["featureList"];
        let finalConfiguration = responseJson["FM"];
        let flConfiguration = responseJson["featurelistFM"];
        let glConfiguration = responseJson["grouplistFM"];
        let resultConfiguration = responseJson["resultConfiguration"];
        console.log(
          "en handleAddFeature, resultConfiguration: " + resultConfiguration
        );
        this.setState({
          groupList: glist,
          featureList: flist,
          treeData: constructTree(flist, glist, "root"),
          fm: finalConfiguration,
          featurelistfm: flConfiguration,
          grouplistfm: glConfiguration,
          configurationChecked:
            "{" + glConfiguration + ", " + flConfiguration + ", root, 0, noF}",
          checkeadas: ["root"],
        });
      } else {
        alert(responseJson["error"]);
      }
    }
  }

  async handleRemoveFeature(fid) {
    // eslint-disable-next-line no-restricted-globals
    event.preventDefault();
    const currentConfiguration = this.state.fm;
    const URL =
      URL_BASE_CONSTRUCT +
      "removefeature" +
      "/" +
      currentConfiguration +
      "/" +
      fid;
    const responseJson = await enviarRequest(URL);

    if (responseJson !== -1) {
      //request okey
      if (responseJson["status"] == 0) {
        let glist = responseJson["groupList"];
        let flist = responseJson["featureList"];
        console.log("al eliminarFid tenemos que flist es: " + flist);
        let finalConfiguration = responseJson["FM"];
        let flConfiguration = responseJson["featurelistFM"];
        let glConfiguration = responseJson["grouplistFM"];
        this.setState({
          groupList: glist,
          featureList: flist,
          treeData: constructTree(flist, glist, "root"),
          fm: finalConfiguration,
          featurelistfm: flConfiguration,
          grouplistfm: glConfiguration,
          configurationChecked:
            "{" + glConfiguration + ", " + flConfiguration + ", root, 0, noF}",
          checkeadas: ["root"],
        });
      } else {
        alert(responseJson["error"]);
      }
    }
  }

  onExpand = (expandedKeys) => {
    //('onExpand', expandedKeys);
  };

  onSelect = (selectedKeys, info) => {
    //console.log('selected', selectedKeys, info);
    //console.log('selected===[] ¿?', selectedKeys.length===0, info);
    this.setState({
      selected: selectedKeys,
    });
    this.selKey = info.node.props.eventKey;
  };

  async onCheck(ch, info) {
    //console.log('onCheck', checkedKeys, info);
    //info.node.check = false;
    //console.log("checkedKeys: "+checkedKeys.checked+" info: "+JSON.stringify(info));
    //console.log(info.node.key )

    if (!Number.isInteger(this.state.maxBudget)) {
      alert("¡Debes introducir un presupuesto (número entero)!");
      return;
    }

    const seleccionadasActualmente = this.state.checkeadas.slice();
    const fidChecked = info.node.key;
    const currentConfigurationChecked = this.state.configurationChecked;
    const URL =
      URL_BASE_SELECT +
      "selectfeature" +
      "/" +
      currentConfigurationChecked +
      "/" +
      fidChecked.replace("'", "") +
      "/" +
      this.state.maxBudget;
    const responseJson = await enviarRequest(URL);

    if (responseJson !== -1 && !seleccionadasActualmente.includes(fidChecked)) {
      //request okey
      if (responseJson["status"] == 0) {
        let newConfigurationChecked = responseJson["newConfigurationChecked"];
        let resultConfiguration = responseJson["newConfigurationChecked"];
        let newChecked = seleccionadasActualmente.concat(fidChecked);
        this.setState({
          checkeadas: newChecked,
          configurationChecked: newConfigurationChecked,
        });
      } else {
        //no actualizo checkdKeys y muestro el error.
        alert(responseJson["error"]);
      }
    }
  }

  onEdit = () => {
    setTimeout(() => {
      console.log("current key: ", this.selKey);
    }, 0);
  };

  onDel = (e) => {
    if (!window.confirm("sure to delete?")) {
      return;
    }
    e.stopPropagation();
  };

  setTreeRef = (tree) => {
    this.tree = tree;
  };

  onRightClick(info) {
    //alert(info.node["key"].replace(",", ""));
  }
  onCleanChecks() {
    const featurelistfm = this.state.featurelistfm.slice();
    const grouplistfm = this.state.grouplistfm.slice();

    this.setState({
      //configurationChecked : "{[ root -> g(AND, rootGroup, noF)], < root | f(mandatory, noR, noE, 0) >, root, 0, noF}",
      configurationChecked:
        "{" + grouplistfm + ", " + featurelistfm + ", root, 0, noF}",
      checkeadas: ["root"],
    });
  }

  onUpdateBudget() {
    if (
      Number.isInteger(this.state.inputBudget) &&
      this.state.inputBudget >= 0
    ) {
      this.setState({
        maxBudget: this.state.inputBudget,
        maxBudgetChanged: true,
        maxBudgetUpdated: true,
      });
    } else {
      this.setState({
        maxBudget: 500,
      });
      alert("Introduce un número entero positivo! ");
    }
  }

  handleChangeBudget(event) {
    this.setState({
      inputBudget: event.target.value,
    });
  }

  getContainer() {
    if (!this.cmContainer) {
      this.cmContainer = document.createElement("div");
      document.body.appendChild(this.cmContainer);
    }
    return this.cmContainer;
  }

  async handleAuthStateChangeSignIn() {
    let user = await Auth.currentAuthenticatedUser();
    this.setState({ autenticado: true, usuario: user.username });
  }

  handleAuthStateChangeLogout() {
    this.setState({ autenticado: false, usuario: "" });
    console.log(
      "autenticado logout: " +
        this.state.autenticado +
        " usuario:" +
        this.state.usuario
    );
  }

  render() {
    const featureList = this.state.featureList.slice();
    const groupList = this.state.groupList.slice();
    const selected = this.state.selected.slice();
    const treeData = this.state.treeData.slice();
    const checkeadas = this.state.checkeadas.slice();

    console.log("groupList es (en render)"+JSON.stringify(groupList));

    if (!this.state.autenticado) {
      console.log("bloque 1");
      return (
        <WrapperSignIn>
          <AmplifySignIn
            headerText="Sign In"
            slot="sign-in"
            handleAuthStateChange={this.handleAuthStateChangeSignIn}
          ></AmplifySignIn>
        </WrapperSignIn>
      );
    } else {
      console.log("bloque 2");
      return (
        <div>
          <Tree
                ref={this.treeRef}
                showIcon={false}
                className="myCls"
                treeData={treeData}
                defaultExpandAll={true}
                onSelect={this.onSelect}
                height={150}
                onRightClick={this.onRightClick}
                checkable={true}
                checkStrictly={true}
                onCheck={(ch, info) => this.onCheck(ch, info)}
                checkedKeys={checkeadas}
              />
          <Navbar variant="light" expand="lg">
            <Navbar.Brand href="#home">App's name</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#link">Examples</Nav.Link>
              </Nav>
              <h5>Hello, {this.state.usuario}! &nbsp; </h5>
              <Button
                variant="outline-danger"
                onClick={this.handleAuthStateChangeLogout}
              >
                Sign out
              </Button>
            </Navbar.Collapse>
          </Navbar>
          <div style={{ margin: "0 0px" }}>
            <WrapperTree>
              <h2>Árbol de características</h2>
              <Tree
                ref={this.treeRef}
                showIcon={false}
                className="myCls"
                treeData={treeData}
                defaultExpandAll={true}
                onSelect={this.onSelect}
                height={150}
                onRightClick={this.onRightClick}
                checkable={true}
                checkStrictly={true}
                onCheck={(ch, info) => this.onCheck(ch, info)}
                checkedKeys={checkeadas}
              />
            </WrapperTree>

            <WrapperTree>
              <div>
                <br></br>
                <Information
                  selected={selected}
                  featureList={featureList}
                  groupList={groupList}
                />
              </div>
              &nbsp;
              <WrapperMenu2Col>
                <div>
                  <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text>
                        Presupuesto ($){" "}
                        {this.state.maxBudgetUpdated ? "👍" : "👎"}{" "}
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      ref={this.textInput}
                      type="number"
                      onChange={(event) =>
                        this.handleChangeInputBudget(event.target.value)
                      }
                      placeholder={500}
                    />
                  </InputGroup>
                </div>
                <div>
                  &nbsp;&nbsp;
                  <Button
                    variant="dark"
                    disabled={this.state.maxBudgetChanged}
                    onClick={this.onUpdateBudget}
                  >
                    Actualizar presupuesto
                  </Button>
                </div>
              </WrapperMenu2Col>
              <WrapperMenu4Col>
                <div>
                  <span id="opcion1">
                    <OverlayPopoverAddFeature
                      handleAddFeature={(fid, gid, type, cost) =>
                        this.handleAddFeature(fid, gid, type, cost)
                      }
                      featureList={featureList}
                      groupList={groupList}
                    />
                  </span>
                </div>
                <div>
                  <span id="opcion2">
                    <OverlayPopoverAddGroup
                      handleAddGroup={(fid, gid, type) =>
                        this.handleAddGroup(fid, gid, type)
                      }
                      featureList={featureList}
                      groupList={groupList}
                    />
                  </span>
                </div>
                <div>
                  <span id="opcion3">
                    <OverlayPopoverRemoveFeature
                      handleRemoveFeature={(fid) =>
                        this.handleRemoveFeature(fid)
                      }
                      featureList={featureList}
                    />
                  </span>
                </div>
                <div>
                  <span id="opcion4">
                    <OverlayPopoverRemoveGroup
                      handleRemoveGroup={(gid) => this.handleRemoveGroup(gid)}
                      groupList={groupList}
                    />
                  </span>
                </div>
              </WrapperMenu4Col>
              <WrapperMenu2Col>
                <div>Añadir dependencia</div>
                <div>
                  <Validation />
                </div>
                <div>
                  <span>
                    <Button variant="info" onClick={this.onCleanChecks}>
                      Nuevo árbol
                    </Button>
                  </span>
                </div>
                <div>
                  <span>
                    <Button variant="outline-info" onClick={this.onCleanChecks}>
                      Limpiar marcadas
                    </Button>
                  </span>
                </div>
              </WrapperMenu2Col>
              <WrapperBackAndForward>
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
                <div>5</div>
                <div>6</div>
                <div>7</div>
                <div>a</div>
                <div>
                  <Form>
                    <InputGroup className="mb-3">
                      <InputGroup.Prepend>
                        <InputGroup.Text>Name</InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        ref={this.textInput}
                        type="string"
                        onChange={(event) =>
                          this.handleChangeInputFileName(event.target.value)
                        }
                        placeholder="example1"
                      />
                    </InputGroup>
                  </Form>
                </div>
                <div>
                  {" "}
                  <MyModal
                    lista={this.state.keyTitles}
                    handleLoadFile={(keySelected, exit) =>
                      this.handleLoadFile(keySelected, exit)
                    }
                  />
                </div>
                <div>
                  <Buttoncito
                    onClick={(e) =>
                      indexState == 0
                        ? e.preventDefault()
                        : this.recoverState(indexState - 1)
                    }
                    leftRemaining={indexState == 0 ? true : false}
                  >
                    <h4>
                      <span aria-label="left arrow" role="img">
                        ←
                      </span>
                    </h4>
                  </Buttoncito>
                  &nbsp; {indexState}&nbsp;
                  <Buttoncito
                    onClick={(e) =>
                      indexState == logs.length - 1
                        ? e.preventDefault()
                        : this.recoverState(indexState + 1)
                    }
                    leftRemaining={indexState >= logs.length - 1 ? true : false}
                  >
                    <h4>
                      <span aria-label="right arrow" role="img">
                        →
                      </span>
                    </h4>
                  </Buttoncito>
                </div>
                <div>
                  <Button
                    variant="primary"
                    type="submit"
                    variant="dark"
                    onClick={() => this.handleUploadFile()}
                  >
                    Submit
                  </Button>
                </div>
              </WrapperBackAndForward>
            </WrapperTree>
          </div>
        </div>
      );
    }
  }
}
const WrapperMenu2Col = styled.div`
  text-align: center;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(70px, auto);
  grid-column: 2;
  grid-row: 4;
`;

const WrapperMenu4Col = styled.div`
  text-align: center;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(70px, auto);
  grid-column: 2;
  grid-row: 4;
`;

const WrapperBackAndForward = styled.div`
  text-align: center;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(70px, auto);
  grid-column: 2;
  grid-row: 4;
`;

const Buttoncito = styled.button`
  margin: auto;
  opacity: ${(props) => (props.leftRemaining ? "0.5" : "1")};
  padding: 6px 10px;
  font-size: 48px;
  text-align: center;
  cursor: pointer;
  outline: none;
  color: #fff;
  background-color: #4caf50;
  border: none;
  border-radius: 15px;
  box-shadow: ${(props) => (props.leftRemaining ? "none" : "0 5px #666")};
  :hover {
    background-color: #3e8e41;
  }
  :active {
    background-color: ${(props) => (props.leftRemaining ? "none" : "#3e8e41")};
    box-shadow: ${(props) => (props.leftRemaining ? "none" : "5px #666")};
    transform: ${(props) => (props.leftRemaining ? "none" : "translateY(4px)")};
  }
`;

/*
background-color: #3e8e41;
box-shadow: 0 5px #666;
transform: translateY(4px);*/

const WrapperTree = styled.div`
  max-width: 50%;
  width: 50%;
  float: left;
  height: 100vh;
  overflow-x: scroll;
  overflow-y: scroll;
  background: #eff0f1;
  overflow: scroll;
`;

const WrapperSignIn = styled.div`
  margin-top: 200px;
  display: flex;
  justify-content: center;
  top: 50%;
`;

Amplify.configure({
  Auth: {
    identityPoolId: "us-east-1:d3f11344-e32e-40d5-9c8e-ef162d9ce2b0",
    region: "us-east-1",
    userPoolId: "us-east-1_NpgNCnkEL",
    userPoolWebClientId: "7k2afoghpv5vq4g53bfvfb95f6",
  },
  Storage: {
    AWSS3: {
      bucket: "amplify-vuedevelopment-vuedevelop-181349-deployment", //REQUIRED -  Amazon S3 bucket name
      region: "us-east-1", //OPTIONAL -  Amazon service region
    },
  },
});

async function enviarFichero() {
  console.log("enviando fichero...");

  let user = await Auth.currentAuthenticatedUser();

  await Storage.put("jsonprueba22.json", { at1: "asd", at2: "xyz" })
    .then((result) => console.log(result)) // {key: "test.txt"}
    .catch((err) => console.log(err));

  await console.log("fichero enviado. usuario: " + user.username);
}

//enviarFichero();

let contador = 0;

async function getFichero(key) {
  let url = "";
  await Storage.get(key)
    .then((result) => (url = result))
    .catch((err) => console.log(err));

  console.log("url es: " + url);

  fetch(url)
    .then((response) => response.json())
    .then((data) => console.log(data));
}

//getFichero("frutas.json");

export default Demo;