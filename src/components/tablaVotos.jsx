import 'bootstrap/dist/css/bootstrap.min.css';

import {useEffect, useState} from 'react';
import {collection, onSnapshot} from 'firebase/firestore';
import db from '../firebase';
import '../App.css';

import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid} from 'recharts';

function TablaVotos(){
    const [votantes, setVotantes] = useState([]);
    const [conteoVotos, setConteoVotos] = useState({});

    useEffect(() => {
        const unsubcribe = onSnapshot(collection(db,'votantes'), (snapshot) =>{
            const nuevosVotantes = [];
            const votosTemp = {};

            snapshot.forEach((doc) => {
                const data = doc.data();
                nuevosVotantes.push({ id: doc.id, ...data });

                const voto = data.voto;
                if (voto !== undefined){
                    votosTemp[voto] = (votosTemp[voto] || 0) + 1;
                }
            });

            setVotantes(nuevosVotantes);
            setConteoVotos(votosTemp);
        });

        return () => unsubcribe();
  }, []);

  const opcionesVoto = {
  1: 'PLANCHA 1',
  2: 'PLANCHA 2',
};

    return(
        <div className="fondo-blur">
            <div className="tarjeta-contenedora">
                <div className="w-100">
                    <div className="tabla-contenedor mx-auto mt-5 p-4">
                        <h3 className="mt-5 text-center">Gráfico de Votos</h3>
                        <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart
                                layout="vertical" // 👈 esto hace que las barras sean horizontales
                                data={Object.entries(conteoVotos).map(([voto, cantidad]) => ({
                                voto: opcionesVoto[voto] || `Voto ${voto}`,
                                cantidad
                                }))}
                                margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" allowDecimals={false} />
                                <YAxis dataKey="voto" type="category" />
                                <Tooltip />
                                <Bar dataKey="cantidad" fill="#0d6efd" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className="w-100">
                    <div className="tabla-contenedor mx-auto mt-5 p-4">
                        <h2 className="text-center mb-4">LISTADO DE VOTOS</h2>
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                <th>#</th>
                                <th>Cedula</th>
                                <th>Plancha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {votantes.map((voto, index) => (
                                <tr key={voto.id}>
                                    <td>{index + 1}</td>
                                    <td>{voto.cedula}</td>
                                    <td>{voto.voto}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default TablaVotos;