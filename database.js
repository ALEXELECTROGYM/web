const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./gimnasio.db');

// Crear tabla de reservas
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS reservas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      fecha TEXT NOT NULL,
      hora TEXT NOT NULL
    )
  `);
});

module.exports = db;// JavaScript Document