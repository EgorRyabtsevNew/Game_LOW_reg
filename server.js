const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

class RegistrationController {
  constructor(db) {
    this.db = db;
  }

  async registerUser(name, email, password, confirm_password) {
    if (!this.validatePassword(password)) {
      throw new Error('Password must be between 8 to 15 characters and contain at least one lowercase letter, one uppercase letter and one numeric digit.');
    }

    if (password !== confirm_password) {
      throw new Error('Passwords do not match.');
    }

    const userExists = await this.checkUserExists(email, name);
    if (userExists.emailExists) {
      throw new Error('Email already exists');
    }
    if (userExists.nameExists) {
      throw new Error('Name already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    await this.insertUser(name, email, hashedPassword);
  }

  validatePassword(password) {
    if (password.length < 8 || password.length > 15) {
      return false;
    }

    if (!/[a-z]/.test(password)) {
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      return false;
    }

    if (!/[0-9]/.test(password)) {
      return false;
    }

    return true;
  }

  async checkUserExists(email, name) {
    const sqlEmail = `SELECT * FROM users WHERE email = ?`;
    const sqlName = `SELECT * FROM users WHERE name = ?`;

    const emailExists = await new Promise((resolve, reject) => {
      this.db.get(sqlEmail, [email], (error, row) => {
        if (error) {
          reject(new Error('Error checking email'));
          return;
        }
        resolve(!!row);
      });
    });

    const nameExists = await new Promise((resolve, reject) => {
      this.db.get(sqlName, [name], (error, row) => {
        if (error) {
          reject(new Error('Error checking name'));
          return;
        }
        resolve(!!row);
      });
    });

    return { emailExists, nameExists };
  }

  async hashPassword(password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          reject(new Error('Error hashing password'));
          return;
        }
        resolve(hash);
      });
    });
  }

  async insertUser(name, email, password) {
    const sqlInsert = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;

    return new Promise((resolve, reject) => {
      this.db.run(sqlInsert, [name, email, password], function (err) {
        if (err) {
          reject(new Error('Error inserting user'));
          return;
        }
        resolve();
      });
    });
  }
}

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

app.post('/register', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;

  const registrationController = new RegistrationController(db);

  try {
    await registrationController.registerUser(name, email, password, confirm_password);
    res.status(200).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
