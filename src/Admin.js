import React, { useState } from 'react';
import './Admin.css';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [backupDone, setBackupDone] = useState(false); // Nuevo estado para el respaldo

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        if (data.isAdmin === true) {
          setIsAdmin(true);
          setMessage(`Hola ${data.name}`);
        } else {
          setIsAdmin(false);
          setMessage('No tienes permisos de administrador.');
        }
      } else {
        setIsAdmin(false);
        setMessage(data.message);
      }
      
      setShowModal(true);

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setIsAdmin(false);
      setMessage('Error del servidor');
      setShowModal(true);
    }
  };

  const handleBackup = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/backup', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Respaldo realizado con éxito.');
        setBackupDone(true); // Actualizar estado para indicar que el respaldo se completó
      } else {
        setMessage(data.message);
        setBackupDone(false);
      }
      
      setShowModal(true);

    } catch (error) {
      console.error('Error al realizar el respaldo:', error);
      setMessage('Error del servidor');
      setBackupDone(false);
      setShowModal(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setBackupDone(false); 
  };

  return (
    <div className="admin-background">
      <div className='admin-container'>
        <form onSubmit={handleLogin}>
          <p className='h1 mt-4 txt-blue'>Administrador</p>
          <p className='h3 my-2'>Inicio de sesión</p>

          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-envelope-at-fill"></i>
            </span>
            <input type="email" className="admin-input" id="email" placeholder="Correo electrónico" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-key-fill"></i>
            </span>
            <input type="password" className="admin-input" id="password" placeholder="Contraseña" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary my-3">Iniciar sesión</button>
        </form>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p className='h3'>{message}</p>
          {isAdmin && !message.includes('Contraseña incorrecta') && !backupDone && (
            <>
              <p>¿Deseas realizar un respaldo?</p>
              <Button variant="secondary" onClick={handleBackup}>
                Aceptar
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Admin;
