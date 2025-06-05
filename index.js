import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Registrar una cita
app.post('/api/registro', async (req, res) => {
  const { nombre, fecha, hora } = req.body;
  try {
    const existe = await pool.query(
      'SELECT * FROM citas WHERE fecha = $1 AND hora = $2',
      [fecha, hora]
    );
    if (existe.rowCount > 0) {
      return res.status(409).json({ mensaje: 'Ya está ocupada' });
    }

    await pool.query(
      'INSERT INTO citas (nombre, fecha, hora) VALUES ($1, $2, $3)',
      [nombre, fecha, hora]
    );
    res.json({ mensaje: 'Cita registrada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

// Obtener todas las citas
app.get('/api/citas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM citas');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});// JavaScript Document