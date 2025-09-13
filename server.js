import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import path from "path";
import {db} from "./db/index.js"
import {createSchema} from "./db/user.js";


const app = express();
app.set('view engine', "ejs");
app.set('views', path.join(process.cwd(),'/views'));
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(express.static('./public'))

app.get('/', (req, res) => {
   res.render('index');
});

app.post('/create', (req, res) => {
   const {username, email, password, age} = req.body;

   bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt,async (err, hash) => {
         try {
            const result = await db.query(
               "INSERT INTO users (username, email, password, age) VALUES ($1, $2, $3, $4) RETURNING *",
               [username,email,hash,age]
            );
            res.json(result.rows[0]);
         } catch(err) {
            console.error("error inserting user:", err.message);
            res.status(500).send("Error creating user");
         }
      });
   });
   
});

app.get('/logout', (req, res) => {
   // res.cookie('token', "");
   res.clearCookie("token") // good way
   res.redirect('/');
});

app.get("/login", (req, res) => {
   res.render('login');
});

app.post('/login', async (req, res) => {
   const {username, password} = req.body;
   const result = await db.query('select * from users where username=($1)',[username]);
   if(result.rows.length === 0) {
      return res.status(400).send("User or email not found");
   } 

   const user = result.rows[0];
   const isMatch = await bcrypt.compare(password, user.password);
   if(!isMatch) {
      return res.status(400).send("Invalid username or password");
   }

   const token = jwt.sign({email: user.email}, "Secret Key");
   res.cookie("token", token);

   res.send("Login sucessful")
})

app.listen(8000, () => console.log('server runninng'));