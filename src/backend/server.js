
require('dotenv').config();

const express = require('express');
const crypto = require('crypto');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const backupRoutes = require('./backupRoutes'); // Importar las rutas de respaldo

const algorithm = 'aes-256-cbc';
const secretKey = process.env.SECRET_KEY; // Clave secreta de 32 bytes (256 bits)
const iv = crypto.randomBytes(16) // Vector de inicialización de 16 bytes

// Crear la aplicación Express
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Conectar a MongoDB Atlas
const uri = 'mongodb+srv://carlos123:carlos123@cluster0.zldjw7s.mongodb.net/smartstep?retryWrites=true&w=majority&ssl=true';
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false
  })
  .then(() => console.log('MongoDB database connection established successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Definir el esquema y modelo de usuario
const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }, // Agrega esta línea
  sessionActive: { type: Boolean, default: false } // Campo para estado de sesión
});

const User = mongoose.model('User', userSchema);

// Función para cifrar la contraseña con el método de cifrado César
// Función para cifrar la contraseña con AES
function encryptPassword(password) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`; // Guardamos el IV junto al mensaje cifrado
}

// Función para descifrar la contraseña cifrada con el método de cifrado César
// Función para descifrar la contraseña con AES
function decryptPassword(encryptedPassword) {
  const [ivHex, encryptedText] = encryptedPassword.split(':');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), Buffer.from(ivHex, 'hex'));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}


//register
app.post('/register', async (req, res) => {
  const { nombre, apellido, email, password } = req.body;

  try {
    const encryptedPassword = encryptPassword(password); // Cifrar la contraseña
    const newUser = new User({ nombre, apellido, email, password: encryptedPassword });
    await newUser.save();
    
    // Verificar que newUser._id está presente antes de enviarlo
    if (newUser._id) {
      console.log('User ID generated by MongoDB:', newUser._id);
    } else {
      console.error('Failed to generate user ID');
    }
    
    res.status(201).json({
      message: 'User registered successfully',
      id_usuario: newUser._id, // Devolver el ID del usuario creado
      name: newUser.nombre
    });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Buscar al usuario por correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña (desencriptar y comparar)
    const isPasswordValid = decryptPassword(user.password) === password;
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // Actualizar el estado de sesión activa
    user.sessionActive = true;
    await user.save();

    // Devolver la respuesta con los datos del usuario
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      id_usuario: user._id,
      name: user.nombre,
      isAdmin: user.isAdmin
    });

    console.log(`Usuario ${user.nombre} ha iniciado sesión con ID: ${user._id}`); // Mostrar el ID del usuario en la consola
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

app.post('/api/perfil', (req, res) => {
  const { nombre, fecha, altura, peso } = req.body;
  
  if (!nombre || !fecha || !altura || !peso) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  console.log(`Nombre: ${nombre}, Fecha: ${fecha}, Altura: ${altura}, Peso: ${peso}`);
  
  res.status(200).json({ message: 'Perfil actualizado correctamente' });
});

app.listen(5000, () => {
  console.log('Servidor corriendo en el puerto 5000');
});


app.listen(5000, () => {
  console.log('Servidor corriendo en puerto 5000');
});
// Ruta para verificar el estado de sesión
app.get('/check-session', async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Verificar el estado de sesión
    res.status(200).json({
      sessionActive: user.sessionActive,
      id_usuario: user._id
    });

    console.log(`Estado de sesión para el usuario ${user.nombre}: ${user.sessionActive ? 'Activa' : 'Inactiva'}`); // Mostrar el estado de sesión en la consola
  } catch (error) {
    console.error('Error al verificar el estado de sesión:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Ruta para cerrar sesión
app.post('/logout', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar el estado de sesión inactiva
    user.sessionActive = false;
    await user.save();

    res.status(200).json({ message: 'Sesión cerrada con éxito' });

    console.log(`Usuario ${user.nombre} ha cerrado sesión`); // Mostrar el ID del usuario en la consola
  } catch (error) {
    console.error('Error durante el cierre de sesión:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Ruta para restablecimiento de contraseña
app.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Correo electrónico y nueva contraseña son requeridos' });
  }
  
  try {
    const encryptedPassword = encryptPassword(newPassword); // Cifrar la nueva contraseña

    const result = await User.updateOne(
      { email }, // Encontrar al usuario por correo electrónico
      { $set: { password: encryptedPassword } } // Actualizar la contraseña
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Contraseña actualizada con éxito' });
    } else {
      res.status(400).json({ message: 'No se pudo actualizar la contraseña. Verifique el correo electrónico.' });
    }
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Usar las rutas de respaldo
app.use('/admin', backupRoutes); // Usa la ruta para las solicitudes de respaldo

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
