import React, { useState } from 'react';
import './Admin.css';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate
import 'bootstrap-icons/font/bootstrap-icons.css';

const RestablecerPwd = () => {
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetToken, setResetToken] = useState(null);
  const navigate = useNavigate(); // Inicializa useNavigate

  const handlePasswordRequest = (e) => {
    e.preventDefault();

    if (email) {
      alert('Hemos enviado un enlace de restablecimiento a ' + email);
      setResetToken('1234567890');
      setStep('reset');
    } else {
      alert('Por favor, ingrese su correo electrónico.');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword, token: resetToken }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Contraseña actualizada con éxito');
        setStep('request');
        setEmail('');
        setNewPassword('');
      } else {
        alert(data.message || 'Error al restablecer la contraseña');
      }
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      alert('Error del servidor');
    }
  };

  const handleCancel = () => {
    setStep('request');
    setEmail('');
    setNewPassword('');
    setResetToken(null);
  };

  const handleCancelRequest = () => {
    navigate('/'); // Redirige a la página principal
  };

  return (
    <div className="reset-background">
      {step === 'request' ? (
        <div className="request-container text-center pt-5">
          <p className='h2 txt-blue'>Recupera tu cuenta</p>
          <p>Ingresa tu dirección de correo para continuar</p>
          <form onSubmit={handlePasswordRequest}>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope-at-fill"></i>
              </span>
              <input type="email" className="admin-input" id="email" placeholder='Correo electrónico' value={email} onChange={(e) => setEmail(e.target.value)} required/>
            </div>
            <div className="btn-group">
              <button type="submit" className="btn-reset btn-aceptar">Aceptar</button>
              <button type="button" className="btn-reset btn-cancelar" onClick={handleCancelRequest}>Cancelar</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="reset-container text-center pt-4">
          <p className='h2 txt-blue'>Ingresa tu nueva contraseña</p>
          <form onSubmit={handlePasswordReset}>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope-at-fill"></i>
              </span>
              <input type="email" className="admin-input" id="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            </div>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-key-fill"></i>
              </span>
              <input type="password" className="admin-input" id="newPassword" placeholder="Contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required/>
            </div>
            <div className="btn-group">
              <button type="submit" className="btn-reset btn-aceptar">Confirmar</button>
              <button type="button" className="btn-reset btn-cancelar" onClick={handleCancel}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RestablecerPwd;
