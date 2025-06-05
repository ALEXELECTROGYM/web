// index.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.post('/registro', async (req, res) => {
  const { nombre, fecha, hora } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM citas WHERE fecha = $1 AND hora = $2',
      [fecha, hora]
    );

    if (result.rows.length > 0) {
      return res.status(400).json({ mensaje: 'Ya existe una cita en ese horario.' });
    }

    await pool.query(
      'INSERT INTO citas (nombre, fecha, hora) VALUES ($1, $2, $3)',
      [nombre, fecha, hora]
    );

    res.json({ mensaje: 'Cita registrada exitosamente.' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
});

app.get('/citas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM citas');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener citas.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
