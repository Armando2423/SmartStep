import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Carousel, Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import IngresoUsuario from './ingresoUsuario'; // Asegúrate de que la ruta sea correcta
import Admin from './Admin';
import './App.css';
import RestablecerPwd from './restablecerPwd';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';


function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [showCuenta, setShowCuenta] = useState(false);
  const containerRef = useRef(null);
  const signUpButtonRef = useRef(null);
  const signInButtonRef = useRef(null);
  const seccion2Ref = useRef(null);
  const seccion5Ref = useRef(null);
  const navigate = useNavigate();
  const [showPayPal, setShowPayPal] = useState(false);

  const [center, setCenter] = useState({
    lat: 20.484419132398745,
    lng: -103.53277609429193
  });


  const PayPalCheckout = () => {
    const initialOptions = {
      "client-id": "AdZ5WhQfOp07hXjsDyKX2JVkDt6iFKWDx4KSVuY-HCqK7y5lxMfuLqxq6BR9F_BXi6r_InSV5UedeK_H",
      currency: "USD",
      intent: "capture"
    };

    return (
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{ layout: 'vertical' }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: '100.00'
                }
              }]
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then(details => {
              alert('Transacción completada por ' + details.payer.name.given_name);
              setShowPayPal(false); // Cierra el modal después de la transacción
            });
          }}
          onError={(err) => {
            console.error('Error con PayPal:', err);
          }}
        />
      </PayPalScriptProvider>
    );
  };
  

  useEffect(() => {
    const container = containerRef.current;
    const signUpButton = signUpButtonRef.current;
    const signInButton = signInButtonRef.current;

    signUpButton.addEventListener('click', () => {
      container.classList.add("right-panel-active");
    });

    signInButton.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
    });

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target) && showCuenta) {
        setShowCuenta(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      signUpButton.removeEventListener('click', () => {
        container.classList.add("right-panel-active");
      });
      signInButton.removeEventListener('click', () => {
        container.classList.remove("right-panel-active");
      });
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCuenta]);

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Registering user:', { nombre, apellido, email, password });
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, apellido, email, password })
    });

    const data = await response.json();
    if (response.ok) {
      alert(data.message);
      
      const userName = data.name; // Obtén el nombre del usuario de la respuesta
        navigate('/IngresoUsuario', { state: { id_usuario: data.id_usuario, name: userName } });
        console.log('ID de Usuario:', data.id_usuario); 
    } else {
      alert(data.message);
    }
  };

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
        // Usa el nombre del usuario del backend
        const userName = data.name; // Obtén el nombre del usuario de la respuesta
        navigate('/IngresoUsuario', { state: { id_usuario: data.id_usuario, name: userName } });
        console.log('ID de Usuario:', data.id_usuario); 
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };
  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="App">
      <div id='seccion1'>
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container-fluid" id='navbar-contenedor'>
          <div id='logo-navbar'></div>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                  <button className="btn me-2" id='btn-nav' type="button" onClick={() => scrollToSection(seccion2Ref)}>Nosotros</button>
                </li>
                <li className="nav-item">
                  <button className="btn me-2" id='btn-nav' type="button" onClick={() => scrollToSection(seccion5Ref)}>Contacto</button>
                </li>
                <li className="nav-item">
                  <button className="btn me-2" id='btn-nav' type="button" onClick={() => navigate('/Admin')}> Administrador</button>
                </li>
                <li className="nav-item">
                  <button className="btn me-2" id='btn-nav' type="button" onClick={() => setShowCuenta(!showCuenta)}>Usuario</button>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="inicio-contenedor">
          <p className='txt-inicio ms-5'>SmartStep</p>
          <p className='h5 ms-5 fst-italic'>"Un paso más cerca de tu objetivo"</p>
          <button className='btn_adquirir ms-5 mt-3' onClick={() => setShowPayPal(true)}>Adquirir</button>
          
          {/* Modal para PayPal */}
          <Modal show={showPayPal} onHide={() => setShowPayPal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Completa tu compra</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <PayPalCheckout />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowPayPal(false)}>Cerrar</Button>
            </Modal.Footer>
          </Modal>
          
          <div className={`form-overlay ${showCuenta ? 'd-flex' : ''}`}>
            <div className={`contenedor-cuenta justify-content-center text-center mx-auto ${showCuenta ? 'd-block' : 'd-none' }`} id="contenedor-cuenta" ref={containerRef}>
              <div className="form-container contenedor-login">
                <h2 className='text-center'>Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
                  <div className="mb-3 input-group">
                    <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                    <input type="email" className="form-control" id="correoLogin" placeholder='Correo electrónico' required value={email} onChange={(e) => setEmail(e.target.value)}/>
                  </div>
                  <div className="mb-3 input-group">
                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                    <input type="password" className="form-control" id="pwdLogin" placeholder='Contraseña' required value={password} onChange={(e) => setPassword(e.target.value)}/>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Ingresar</button>
                  <div className="text-center mt-3">
                    <a href="/restablecerPwd" className="text-muted">¿Olvidaste tu contraseña?</a>
                  </div>
                </form>
              </div>

              <div className="form-container contenedor-registro">
                <h2 className='text-center'>Registrarse</h2>
                <form onSubmit={handleRegister}>
                  <div className="mb-3 input-group">
                    <span className="input-group-text"><i className="bi bi-person"></i></span>
                    <input type="text" className="form-control" id="nombre" placeholder='Nombre(s)' required value={nombre} onChange={(e) => setNombre(e.target.value)}/>
                  </div>
                  <div className="mb-3 input-group">
                    <span className="input-group-text"><i className="bi bi-person"></i></span>
                    <input type="text" className="form-control" id="apellido" placeholder='Apellido(s)' required value={apellido} onChange={(e) => setApellido(e.target.value)}/>
                  </div>
                  <div className="mb-3 input-group">
                    <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                    <input type="email" className="form-control" id="correoRegistro" placeholder='Correo electrónico' required value={email} onChange={(e) => setEmail(e.target.value)}/>
                  </div>
                  <div className="mb-3 input-group">
                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                    <input type="password" className="form-control" id="pwdRegistro" placeholder='Contraseña' required value={password} onChange={(e) => setPassword(e.target.value)}/>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Registrarse</button>
                </form>
              </div>
              <div className="overlay-container col-6">
                <div className="overlay">
                  <div className="overlay-panel overlay-left">
                    <h1>Inicia sesión</h1>
                    <button className="ghost" id="signIn" ref={signInButtonRef}>Iniciar sesión</button>
                  </div>
                  <div className="overlay-panel overlay-right">
                    <h1>Crea una cuenta</h1>
                    <button className="ghost" id="signUp" ref={signUpButtonRef}>Registrar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center p-5" id='seccion2'>
        <div className="col-4 pt-5 me-5" id='nosotros' ref={seccion2Ref}>
          <p className='h2 txt-blue'>Impulsa tu rendimiento</p>
          <p className='mt-5'>Transforma cada paso en una oportunidad para superarte. SmartStep es tu compañero ideal en el camino hacia el éxito. Disfruta de una comodidad excepcional, mientras te ayudamos a medir y alcanzar tus objetivos.</p>
        </div>
        <div className="col-3 ms-5 mt-4" id='img-1'>
        </div>
      </div>

      <div className="row justify-content-center text-center p-5" id='seccion3'>
        <p className='h2 fw-semibold'>Analiza tu progreso, cuida tu salud</p>
        
        <div className='col-3 text-center mx-4' id='beneficios'>
          <i className="bi bi-thermometer-half" style={{ fontSize: '3rem', color: '#0af' }}></i>
          <hr id='linea'/>
          <p>Monitorea la temperatura de tu pie durante el ejercicio, notificándote si la temperatura es alta.</p>
        </div>
        <div className='col-3 text-center mx-4' id='beneficios'>
          <i className="bi bi-speedometer2" style={{ fontSize: '3rem', color: '#0af' }}></i>
          <hr id='linea'/>
          <p>Mide la fuerza ejercida por cada pie, notificándote sobre descompensaciones entre tus piernas durante los ejercicios.</p>
        </div>
        <div className='col-3 text-center mx-4' id='beneficios'>
          <i className="bi bi-activity" style={{ fontSize: '3rem', color: '#0af' }}></i>
          <hr id='linea'/>
          <p>Cuenta tus pasos con precisión, proporcionando datos claros sobre tu actividad física.</p>
        </div>
      </div>

      <div className="row justify-content-center text-white" id='seccion4'>
        <div className="col-8 pt-5">
          <Carousel className='carrusel'>
            <Carousel.Item>
              <div className="m-5 p-5 text-center" id='mision'>
                <h2>Misión</h2>
                <hr></hr>
                <p className='mt-3 mx-5'>Ayudar a los deportistas con tecnología innovadora que mide, analiza y mejora su rendimiento. Nos dedicamos a crear soluciones inteligentes que transformen cada paso en datos útiles, ayudando a nuestros usuarios a alcanzar sus metas y superar sus límites con confianza y precisión.</p>
              </div>
            </Carousel.Item>
            <Carousel.Item>
              <div className="m-5 p-5 text-center" id='vision'>
                <h2>Visión</h2>
                <hr></hr>
                <p className='mt-3 mx-5'>Convertirnos en la marca líder de calzado deportivo inteligente, reconocida por transformar la manera en que los atletas de todos los niveles alcanzan su máximo potencial. Aspiramos a ser sinónimo de innovación y excelencia en el rendimiento deportivo, inspirando a deportistas a superar sus límites con cada paso.</p>
              </div>
            </Carousel.Item>
          </Carousel>
        </div>
      </div>

      <div className="row justify-content-center p-5" id='seccion5' ref={seccion5Ref}>
        <div className="col-4" id=''>
          <p>Ubicación</p>
          <p><i className="bi bi-geo-alt-fill"></i> Carretera Santa Cruz-San Isidro Km. 4.5, 45640 Santa Cruz de las Flores, Jal.</p>
          <p><i className="bi bi-telephone-fill"></i> +523337701650</p>
          <p><i className="bi bi-envelope-at-fill"></i> smartstep.utzmg@gmail.com</p>
        </div>
        <div className="col-4" id=''>
  <p>Contáctanos</p>
  <p>
    <a href="https://www.facebook.com/profile.php?id=61564054506527&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
      <i className="bi bi-facebook"></i> Facebook
    </a>
  </p>
  <p>
    <a href="https://instagram.com/smartstepoficial/" target="_blank" rel="noopener noreferrer">
      <i className="bi bi-instagram"></i> Instagram
    </a>
  </p>
</div>
<div className="col-4" id='mapa'>
          <LoadScript googleMapsApiKey="AIzaSyCj_KS-zuADF2sLbzhZcgGwlpJ5EGK6jtA">
            <GoogleMap
              mapContainerStyle={{ height: "230px", width: "100%" }}
              center={center}
              zoom={15}
            >
              <Marker position={center} />
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/IngresoUsuario" element={<IngresoUsuario/>} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/restablecerPwd" element={<RestablecerPwd />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
