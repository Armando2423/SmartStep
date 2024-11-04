const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configuración de la URI de MongoDB
const MONGO_URI = 'mongodb+srv://carlos123:carlos123@cluster0.zldjw7s.mongodb.net/smartstep?retryWrites=true&w=majority&ssl=true';

// Crear el directorio de respaldo si no existe
const backupDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// Ruta para realizar el respaldo
router.get('/backup', (req, res) => {
  const backupPath = path.join(backupDir, 'backup-' + Date.now() + '.gz');
  const command = `mongodump --uri="${MONGO_URI}" --gzip --archive=${backupPath}`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error('Error al ejecutar mongodump:', err);
      return res.status(500).json({ message: 'Error al realizar el respaldo' });
    }

    console.log('Backup creado en:', backupPath);
    res.status(200).json({ message: 'Respaldo realizado exitosamente', path: backupPath });
  });
});

module.exports = router;
