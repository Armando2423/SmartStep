import React, { useState } from 'react';
import './ingresoUsuario.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const PerfilUsuario = () => {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const perfilData = { nombre, fecha, altura, peso };
    
    try {
      const response = await fetch('http://localhost:5000/api/perfil', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(perfilData),
      });
    
      if (response.ok) {
        const result = await response.json();
        alert(result.message);
      } else {
        console.error('Error:', response.status, response.statusText);
        alert('Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    }
    
  };

  return (
    <div id='perfil-container'>
      <form onSubmit={handleSubmit}>
        <div className='row'>
          <div className='col-10 p-5 mx-auto'>
            <p className='h2'>Perfil</p>
            <div className='perfil-input'>
              <input type='text' id='nombre' value={nombre} onChange={(e) => setNombre(e.target.value)} required/>
              <label>Nombre</label>
            </div>
            <div className='perfil-input'>
              <input type='date' id='fecha' value={fecha} onChange={(e) => setFecha(e.target.value)} required/>
              <label>Fecha de nacimiento</label>
            </div>
            <div className='perfil-input'>
              <input type='text' id='altura' value={altura} onChange={(e) => setAltura(e.target.value)} required/>
              <label>Altura (cm)</label>
            </div>
            <div className='perfil-input'>
              <input type='text' id='peso' value={peso} onChange={(e) => setPeso(e.target.value)} required/>
              <label>Peso (kg)</label>
            </div>
          </div>
          <div className='col-4 mx-auto d-grid'>
            <button className='btn btn-primary' id='btn-actualizar-perfil' type="submit">Actualizar</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PerfilUsuario;
