import {Client} from "pg";

const db = new Client({
   user: "postgres",
   password: "123",
   host: "localhost",
   database: "authlogin",
   port: 5432
});

db.connect().then(() => {
   console.log('dataBase Connected');
}).catch((err) => {
   console.error(err);
});

export{db};