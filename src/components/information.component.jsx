import React from 'react';

import ListGroup from 'react-bootstrap/ListGroup'


const Information = props => {


    const selected = props.selected;
    const featureList = props.featureList;

    const groupList = props.groupList;





    let featureType = "Selecciona una característica en el árbol...";
    let cost = "Selecciona una característica en el árbol...";
    let fid = "Selecciona una característica en el árbol...";
    let gruposAnd = "Selecciona una característica en el árbol...";
    let gruposOr = "Selecciona una característica en el árbol...";
    let gruposAlternative = "Selecciona una característica en el árbol...";

    

    let variantColor = "light";

    //hay alguno (en particular, siempre será uno máximo) seleccionado que tendremos que enseñar la inform.

    console.log("featureList es: "+JSON.stringify(featureList));
    if (selected.length!==0){
        [{fid, featureType, cost}] = featureList.filter(elem => elem["fid"]===selected[0]);
        let [infoFeatures] = groupList.filter(elem => elem["fid"]===selected[0]);

        console.log("infoFeatures es: "+JSON.stringify(infoFeatures));

        
        if (infoFeatures.groups!=="noG"){
            let auxGruposAnd = infoFeatures.groups.filter(gr => gr["groupType"]==="AND").map(grupo => grupo["gid"]);
            let auxGruposOr = infoFeatures.groups.filter(gr => gr["groupType"]==="OR").map(grupo => grupo["gid"]);
            let auxGruposAlternative = infoFeatures.groups.filter(gr => gr["groupType"]==="ALTERNATIVE").map(grupo => grupo["gid"]);
            
            gruposAnd = auxGruposAnd.length === 0 ? "Ø" : auxGruposAnd.map(elem => elem.replace("'", "")+" ");
            gruposOr = auxGruposOr.length === 0 ? "Ø" : auxGruposOr.map(elem => elem.replace("'", "")+" ");
            gruposAlternative = auxGruposAlternative.length === 0 ? "Ø" : auxGruposAlternative.map(elem => elem.replace("'", "")+" "); 


        }

        variantColor = "";
        
        
       
    }


    /*
    let gruposAnd = "Ø";
      //hay información sobre el feature seleccionadoo
    if (infoFeatures.length!==0){
    let auxGruposAnd = infoFeatures.groups.filter(gr => gr["groupType"]==="AND").map(grupo => grupo["gid"]);
    gruposAnd = auxGruposAnd.length===0 ? "Ø" : auxGruposAnd; 
    }
    */

    //let gruposAndPretty = gruposAnd.map(elem => elem.replace("'", ""));

    return (
        <ListGroup>
                    <ListGroup.Item key={"fid-"+fid} variant={variantColor}>
                        <strong>Feature id</strong>: {fid.replace("'", "")}
                    </ListGroup.Item>

                    <ListGroup.Item key={"featureType-"+featureType} variant={variantColor} >
                        <strong>FeatureType</strong>: {featureType}
                    </ListGroup.Item>
                    
                    <ListGroup.Item key={"cost-"+cost} variant={variantColor} >
                        <strong>Cost</strong>: {cost}
                    </ListGroup.Item>
                    <ListGroup.Item key={"gruposAnd-"+gruposAnd} variant={variantColor} >
                        <strong>Grupos AND</strong>: {gruposAnd}
                    </ListGroup.Item >
                    <ListGroup.Item key={"gruposOr-"+gruposOr} variant={variantColor} >
                        <strong>Grupos OR</strong>: {gruposOr}
                    </ListGroup.Item>
                    <ListGroup.Item key={"gruposAlternative-"+gruposAlternative} variant={variantColor} >
                        <strong>Grupos ALTERNATIVE</strong>: {gruposAlternative}
                    </ListGroup.Item>
        </ListGroup>
    )

}


export default Information;