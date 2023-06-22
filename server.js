const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database('mydatabase.db', (err) => {
  if (err) {
    console.error('Error connecting to SQLite database: ', err);
    return;
  }

  console.log('Connected to SQLite database');
  db.run(`CREATE TABLE IF NOT EXISTS users (name TEXT, email TEXT, password TEXT)`, (error) => {
      if (error) {
        console.error('Error creating SQLite table: ', error);
        return;
      }

      console.log('SQLite table created');
    }); 
});

app.use(express.static('public'));

app.post('/register', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const sqlEmail = `SELECT * FROM users WHERE email = ?`;
  const sqlName = `SELECT * FROM users WHERE name = ?`;
  const sqlInsert = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

  db.get(sqlEmail, [email], (error, row) => {
    if (error) {
      console.error('Error checking email in SQLite table: ', error);
      res.status(500).json({ message: 'Error checking email' });
      return;
    }

    if (row) {
      console.error('Email already exists in SQLite table');
      res.status(400).json({ message: 'Email already exists' });
      return;
    }

    db.get(sqlName, [name], (error, row) => {
      if (error) {
        console.error('Error checking name in SQLite table: ', error);
        res.status(500).json({ message: 'Error checking name' });
        return;
      }

      if (row) {
        console.error('Name already exists in SQLite table');
        res.status(400).json({ message: 'Name already exists' });
        return;
      }

      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.error('Error hashing password: ', err);
          res.status(500).json({ message: 'Error hashing password' });
          return;
        }
        const values = [name, email, hash];

        db.run(sqlInsert, values, (error) => {
          if (error) {
            console.error('Error inserting registration data into SQLite table: ', error);
            res.status(500).json({ message: 'Error inserting data' });
          } else {
            console.log('Registration data inserted into SQLite table');
            res.json({ message: 'Registration successful!' });
          }
        });
      });
    });
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
