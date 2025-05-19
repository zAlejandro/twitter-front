import 'bootstrap/dist/css/bootstrap.min.css';

import {useEffect, useState} from 'react';
import {getDocs, collection, onSnapshot, arrayRemove} from 'firebase/firestore';
import db from '../firebase';
import '../App.css';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid} from 'recharts';

function TablaVotos(){
    const [votantes, setVotantes] = useState([]);
    const [conteoVotos, setConteoVotos] = useState({});


    async function guardarExcel(){
        try{
            const querySnashot = await getDocs(collection(db, 'votantes'));
            const data = [];

            querySnashot.forEach(doc => {
                data.push(doc.data());
            });

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(workbook,worksheet,'votantes');

            const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});

            const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
            saveAs(blob, 'votos.xlsx');
        }catch(e){
            console.error(e);
        }
        
    }

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
                        <h2 className="text-center mb-4">
                            LISTADO DE VOTOS
                            <button className="btn btn-success align-items-end gap-2" onClick={guardarExcel} hidden>
                                <i className="bi bi-file-earmark-excel-fill"></i>
                            </button>
                        </h2>
                        
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                <th>#</th>
                                <th>Cedula</th>
                                <th>Plancha</th>
                                <th>
                                    
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                                {votantes.map((voto, index) => (
                                <tr key={voto.id}>
                                    <td>{index + 1}</td>
                                    <td>{voto.cedula}</td>
                                    <td>VOTO</td>
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