import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ingresoUsuario.css';

import Pasos from './sensorPasos';
import Fuerza from './sensorFuerza';
import Temperatura from './sensorTemperatura';
import Perfil from './perfilUsuario';
import Admin from './Admin';

const Welcome = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const location = useLocation();
  const { state } = location;
  const userName = state?.name || 'Usuario'; 

  const renderContent = () => {
    switch (activeComponent) {
      case 'pasos':
        return <Pasos />;
      case 'fuerza':
        return <Fuerza />;
      case 'temperatura':
        return <Temperatura />;
      case 'perfil':
        return <Perfil />;
      default:
        return <div>Selecciona una opción del menú.{userName}</div>;
    }
  };

  return (
    <div id='ingreso-contenedor'>
      <div className="menu-lateral">
        <div className='my-3' id='logo-contenedor'></div>
        <button className="menu-btn" onClick={() => setActiveComponent('pasos')}>Pasos</button>
        <button className="menu-btn" onClick={() => setActiveComponent('fuerza')}>Distribución de fuerza</button>
        <button className="menu-btn" onClick={() => setActiveComponent('temperatura')}>Temperatura</button>
        <button className="menu-btn" onClick={() => setActiveComponent('perfil')}>Perfil de usuario</button>
        <button className="menu-btn">Cerrar sesión</button>
      </div>
      <div className="ingreso-contenido">
        {renderContent()}
      </div>
    </div>
  );
};

export default Welcome;
