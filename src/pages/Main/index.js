import React, { useState, useEffect, useCallback } from 'react';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';
import { Container, Form, SubmitButton, List, DeleteButton } from './styles';
import { Link } from 'react-router-dom';

import api from '../../services/api';


function Main(){

    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(false);

    //load to localStorage
    useEffect(()=>{
        const reposStorage = localStorage.getItem('repos');

        if(reposStorage){
            setRepositorios(JSON.parse(reposStorage));
        }
    }, []);

    //save on localstorage
    useEffect(()=>{
        localStorage.setItem('repos', JSON.stringify(repositorios));
    }, [repositorios]);



     const handleSubmit = useCallback( (e)=>{

        e.preventDefault();

        async function submit(){
            setLoading(true);
            setAlert(false);

            try{

                if(newRepo === ''){
                    throw new Error('Indique algum repositório!');
                }

                const response = await api.get(`repos/${newRepo}`);

                const hasRepo = repositorios.find(repo => repo.name === newRepo);

                if(hasRepo){
                    throw new Error('Repositório Duplicado!');
                }

                const data = {
                    name: response.data.full_name,
                }
    
                setRepositorios([...repositorios, data]);
                setNewRepo('');
            } catch(error){
                setAlert(true);
                console.log(error);
            } finally{
                setLoading(false);
            }
        }
        
        submit();

     }, [newRepo, repositorios]);

    function handleInputChange(e){
        setNewRepo(e.target.value);
        setAlert(false);
    }

   const handleDelete = useCallback((repo) => {
        const find = repositorios.filter( r => r.name !== repo); //return the repos differents of the repo clicked
        setRepositorios(find);

   }, [repositorios]);

    return(
        <Container>
            <h1>
                <FaGithub size={25}/>
                Meus Repositórios
            </h1>
        
            <Form onSubmit={handleSubmit} error={alert}>
                <input
                    type="text"
                    placeholder="Add Repositório"
                    value={ newRepo }
                    onChange={handleInputChange}
                />

                <SubmitButton loading={ loading ? 1 : 0}>
                    {loading ? (
                        <FaSpinner color="#FFF" size={14} />
                    ):(
                        <FaPlus color="#FFF" size={14} />
                    )}
                </SubmitButton>
            </Form>

            <List>
                {
                    repositorios.map( repo => (
                        <li key={repo.name}>
                            <span>
                                <DeleteButton onClick={() => handleDelete(repo.name) }>
                                    <FaTrash size={14} />
                                </DeleteButton>
                                {repo.name}
                            </span>
                            <Link to={`/repo/${encodeURIComponent(repo.name)}`}>
                                <FaBars size={20}/>
                            </Link>
                        </li>
                    ))
                }
            </List>

        </Container>

    );
}

export default Main;