const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(express.json());

function esHoraPermitida(fecha) {
  const ahora = new Date();
  const fechaCita = new Date(fecha);
  const diferenciaHoras = (fechaCita - ahora) / (1000 * 60 * 60);

  const hora = fechaCita.getHours();
  return (
    diferenciaHoras >= 12 &&
    hora >= 6 &&
    hora <= 20
  );
}

app.post('/citas', async (req, res) => {
  const { nombre, fecha } = req.body;

  if (!esHoraPermitida(fecha)) {
    return res.status(400).json({ error: 'La cita debe ser al menos 12 horas en el futuro y entre 6 a.m. y 8 p.m.' });
  }

  try {
    await pool.query('INSERT INTO citas (nombre, fecha) VALUES ($1, $2)', [nombre, fecha]);
    res.json({ mensaje: 'Cita agendada con éxito' });
  } catch (error) {
    console.error('Error al guardar cita:', error);
    res.status(500).json({ error: 'Error al guardar cita' });
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
