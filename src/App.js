//import logo from './logo.svg';
import './App.css';
//import Button from 'react-bootstrap/Button';

import {useEffect, useState} from 'react';
import {collection, getDocs} from 'firebase/firestore';
import db from './firebase';

import TablaVotos from './components/tablaVotos';
import './App.css';

function App() {
  const [votantes, setVotantes] = useState([]);

  useEffect(() => {
    const obtenerVotantes = async () => {
      const querySnapshot = await getDocs(collection(db, 'votantes'));
      const datos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVotantes(datos)
    };

    obtenerVotantes();
  }, []);



  return (
    <div className="App">
      <header className="">
      </header>
      <TablaVotos/>
    </div>
  );
}


export default App;
