import React, { useState, useEffect } from 'react';
import "@aws-amplify/ui-react";
import Amplify, { Storage, Auth } from "aws-amplify";
import axios from 'axios';


function Prueba(props) {
    const [isLoading, setLoading] = useState(!props.logged);
    const [pokemon, setPokemon] = useState();
    const [usuario, setUsuario] = useState();
  

    /*
    useEffect(() => {
      axios.get("https://pokeapi.co/api/v2/pokemon/4").then(response => {
        setPokemon(response.data);
        setLoading(false);
      });
    }, []);*/

    console.log("PRUEBA: logged: "+props.logged);

 
    //              <Prueba logged={this.state.logged}></Prueba>


    useEffect(() => {
        Auth.currentAuthenticatedUser().then(response => {
            setUsuario(response.username);
            setLoading(false);
        });
      });




  
    if (isLoading) {
      return <div className="l">Cargando...</div>;
    }
  
    return (
        /*
      <div className="App">
        <h1>{pokemon.name}</h1>
        <img alt={pokemon.name} src={pokemon.sprites.front_default} />
      </div>
      */
     <div>
         <h1>{usuario}</h1>
     </div>

    );
  }
  
export default Prueba;