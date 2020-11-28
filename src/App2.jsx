
import React from 'react';
import {OptionGroups} from './components/options/option-groups.component';
import {OptionFeatures} from './components/options/option-features.component';
import {OptionGroupTypes} from './components/options/option-group-types.component';
import {OptionFeatureTypes} from './components/options/option-feature-types.component';




const divStyle = {
  /*
  color: 'blue',
  background: '#428bca'
  */
};


//NEW
const featureTypes = ["mandatory", "optional"];
const groupTypes = ["AND", "OR", "ALTERNATIVE"];



class FeatureInput extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      fid: "",
      gid: "rootGroup",//por defecto
      type : featureTypes[0],//por defecto
      cost : ""
      
    }
    
    this.handleChangeFid= this.handleChangeFid.bind(this);
    this.handleChangeGid = this.handleChangeGid.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleChangeCost = this.handleChangeCost.bind(this);
    this.submitButton = this.submitButton.bind(this);
    
  }
  
  handleChangeFid(event){

     this.setState({
       fid: event.target.value
     } );
  }
  
  
  handleChangeGid(event){
     this.setState({
       gid: event.target.value
     } );
  }
  
  handleChangeType(event){
     this.setState({
       type: event.target.value
     } );
  }

  handleChangeCost(event){
    this.setState({
      cost: event.target.value
    } );
 }
  
  submitButton(fid,gid, type, cost){
    
    this.props.onAddFeature(fid, gid , type, cost);
    
  }
  

  render() {


    //FID GENERADO!!

    const fid = this.state.fid;

    const gid = this.state.gid;
    const type = this.state.type;
    const cost = this.state.cost;




    console.log(this.props.grupos);

    return (
      
      <div>
        
      <fieldset>
        <legend>Añadir característica
          </legend>
        <form  onSubmit={(e)=> { this.submitButton(fid,gid, type, cost); e.preventDefault(); }}>
          <label>
            fid:
            <input type="text" value={this.state.fid} onChange={this.handleChangeFid} />
           </label>
            <br />
           <label>
            gid
             <OptionGroups selectedGid={this.state.gid} groups={this.props.grupos}
               onChange={this.handleChangeGid}/>
           </label>
           <br />
           <label>
            type:
            <OptionFeatureTypes selectedFeatureType={this.state.type}
              onChange={this.handleChangeType} />
           </label>
           <br />
           <label>
            cost:
            <input type="number" value={this.state.cost} onChange={this.handleChangeCost} />
           </label>
            <br />


           <input type="submit" value="Añadir"  disabled={this.state.fid!=="" && this.state.cost!=="" && this.state.cost>=0  ? false : true}  />

           
         
      </form>
      </ fieldset>
        
        </div>
    );
  }

}

class GroupInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fid: "root",
      gid: "",
      type: groupTypes[0]
    };
    this.handleChangeFid = this.handleChangeFid.bind(this);
    this.handleChangeGid = this.handleChangeGid.bind(this);
    this.handleChangeGroupType= this.handleChangeGroupType.bind(this);
  }
  
  handleChangeFid(event){
    this.setState({
       fid: event.target.value
     } );
  }
  
  handleChangeGid(event){
    this.setState({
       gid: event.target.value
     } );
  }
  
  handleChangeGroupType(event){
    this.setState({
       type: event.target.value
     } );
  }
  
  

  render() {
  
    //console.log("En GroupInput featureIds es "+this.props.featureIds);
    
    const gid = this.state.gid;
    const type = this.state.type;
    const fid =  this.state.fid;

    
    return (
      
      <div>

      <fieldset>
        <legend>Añadir grupo
          </legend>
        <form onSubmit={(e)=> { this.props.onAddGroup(fid, gid, type); e.preventDefault()}} >
          <label>
            fid:
           <OptionFeatures selectedFid={fid}
             featureIds={this.props.featureIds}
             onChange={this.handleChangeFid} />
          </label>
            <br />
           <label>
            gid:
             <input type="text" value={gid} onChange={this.handleChangeGid} />
           </label>
           <br />
           <label>
            type:
            <OptionGroupTypes selectedGroupType={type} onChange={this.handleChangeGroupType}/>
           </label>
           <br /> 
           <input type="submit" value="Añadir"  disabled={this.state.fid!=="" && this.state.gid!=="" ? false : true}  />
      </form>
      </ fieldset>

      
        
        </div>
    );
  }
}


//removefeature
class FeatureRemove extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fid: " "
    };
    this.handleChangeFid= this.handleChangeFid.bind(this);

  }
  
  handleChangeFid(event){
    this.setState({
       fid: event.target.value
     } );
  }
  
 
  render() {
  
    //("En GroupInput featureIds es "+this.props.featureIds);
    
    const fid = this.state.fid;
 

    
    return (
      
      <div>

      <fieldset>
        <legend>Eliminar característica
          </legend>
        <form onSubmit={(e)=> { this.props.onRemoveFeature(fid); e.preventDefault();}} >
          <label>
            fid:
           <OptionFeatures selectedFid={fid}
             featureIds={[" "].concat(this.props.featureIds)}
             onChange={this.handleChangeFid} />
          </label>
           <br /> 
          <input type="submit" value = "Eliminar" disabled={fid===" " ? true : false} />
      </form>
      </ fieldset>
        
        </div>
    );
  }
}



//groupremove
class GroupRemove extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gid: " "
    };
    this.handleChangeGid= this.handleChangeGid.bind(this);

  }
  
  handleChangeGid(event){
    this.setState({
       gid: event.target.value
     } );
  }
  
 
  render() {
  
    console.log("En GroupInput featureIds es"+this.props.featureIds);    
    const gid = this.state.gid;
 

    
    return (
      
      <div>

      <fieldset>
        <legend>Eliminar grupo
          </legend>
        <form onSubmit={(e)=> { this.props.onRemoveGroup(gid); e.preventDefault();}} >
          <label>
            gid:
           <OptionGroups selectedGid={gid}
             groups={this.props.grupos}
             onChange={this.handleChangeGid} />
          </label>
           <br /> 
          <input type="submit" value = "Eliminar" disabled={gid===" " ? true : false} />
      </form>
      </ fieldset>
        
        </div>
    );
  }
}
  

class Appi extends React.Component {
  constructor(props) {
    super(props);
  }
  
 


  handleRemoveFeature(fid){
    //TODO
  }

  handleRemoveGroup(gid){
    //TODO
  }
  

  
  render(){
    console.log('this propos:', this.props);
    const featureList = this.props.featureList;
    const groupList = this.props.groupList;
    
    const ftIds = extractFidsFromFeatureList(featureList);
    const grIds = extractGidsFromGroupList(groupList);

    console.log("listaFeatures en App: "+ ftIds);
    console.log("listaGroups en App: "+ grIds);
    


    let accion;

    if (this.props.accion === 'addFeature'){
      accion = (
        <div>
          <div style={divStyle}>
          <FeatureInput grupos={grIds}
            onAddFeature={(fid, gid, type, cost) => this.props.handleAddFeature(fid, gid, type, cost)}/>
          </div>
       </div>
  
      );
    }

    
    else if (this.props.accion === 'addGroup'){
      console.log("JIJIJI");
      accion = (
        <div>
          <div style={divStyle}>
  
          <GroupInput grupos={grIds} featureIds={ftIds}
            onAddGroup={(fid, gid, type) => this.props.handleAddGroup(fid, gid, type)} />
          </div>
          
  
       </div>
  
      );
    }


    

    return (
      [accion]
    );


  }
}
  

//[{'fid': "'Aircraft", 'featureType': 'featureType', 'requires': 'noR', 'excludes': 'noE', 'cost': '5'},
//{'fid': 'root', 'featureType': 'featureType', 'requires': 'noR', 'excludes': 'noE', 'cost': '0'}]
function extractFidsFromFeatureList(featureList){
  let fids = [];
  if(!featureList || (featureList && featureList.length === 0) ){
    console.log('still loading features list!');
    return fids;
  }
  for (let i = 0; i < featureList.length; i++) {
    fids = fids.concat(featureList[i]["fid"].replace("'", ""))
  }
  return fids
}

//[{'fid': "'Aircraft", 'groups': 'noG'}, {'fid': 'root', 'groups': [{'groupType': 'AND', 'gid': 'rootGroup', 'features': [{'fid': "Aircraft"}]}]}]
function extractGidsFromGroupList(groupList){
  let gids = [];//set unique gids
  if(!groupList || (groupList && groupList.length === 0) ){
    console.log('still loading GroupList!');
    return gids;
  }
  for (let i = 0; i < groupList.length; i++) {
    let groups = groupList[i]["groups"];
    if (groups!=="noG"){
	    for (let j = 0; j < groups.length; j++){
        let newGid = groups[j]["gid"]
        if (!gids.includes(newGid))
	        gids = gids.concat(newGid.replace("'", ""))
	    }
	  }
  }

  return gids
}

// TO DO: Eliminar random. Recibir de Api, etc...

export default Appi;