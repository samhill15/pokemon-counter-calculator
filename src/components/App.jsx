import React from 'react';
import { useState } from 'react';
import axios from 'axios';

import Heading from './Heading';
import SearchBar from './SearchBar';
import CounterResults from './CounterResults'
import Selector from './Selector';
import TypeSelector from './TypeSelector';

function App() {

    const baseURL = 'https://pokeapi.co/api/v2/';
    const [pokemon, setPokemon] = useState({});
    const [typeData, setTypeData] = useState([]);
    const [isPokemon, setIsPokemon] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    function handleQuery(query) {
        setIsLoading(true);

        if(isPokemon) {
            queryByName(query);
        } else {
            queryByType(query);
        }
    }

    function handleSelection(choice) {
        setIsPokemon(choice);
        setIsLoading(true);
    }

    async function queryByName(query) {
        setTypeData([]);
        await axios.get(baseURL + 'pokemon/' + query.toLowerCase()).then(res => {
            setPokemon(res.data);
            const typeURLs = res.data.types.map(obj => {
                return obj.type.url;
            });
    
            typeURLs.forEach(url => {
                axios.get(url).then(res => {
                    setTypeData(oldData => [...oldData, res.data.damage_relations]);
                }).catch(err => {
                    setTypeData(oldData => [...oldData, {error: `Could not find type with name, "${query}."`}]);
                });
            });
        }).catch(() => {
            setPokemon({error: `Could not find pokemon with name, "${query}."`});
        });

        setIsLoading(false);
    }

    async function queryByType(query) {
        setTypeData([]);
        query.forEach(type => {
            if (type !== 'none') {
                axios.get(baseURL + 'type/' + type).then(res => {
                    setTypeData(oldData => [...oldData, res.data.damage_relations]);
                }).catch(() => {
                    setTypeData(oldData => [...oldData, {error: `Could not find type with name, "${query}."`}]);
                });
            }
        });
        setIsLoading(false);
    }
    
    return (
        <div>
            <Heading />
            {isPokemon ? <SearchBar onSubmit={handleQuery} /> : <TypeSelector onSubmit={handleQuery}/>}
            <Selector onSelect={handleSelection} />
            {!isLoading && 
                <CounterResults 
                    pokemon={pokemon} 
                    typeData={typeData} 
                    isPokemon={isPokemon} 
                />
            }
        </div>
    );
}

export default App;