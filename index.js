import fs from "fs";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

dotenv.config();

const getUsers = () => JSON.parse(fs.readFileSync("users.json"));

app.get("/", (req, res) => {
  res.send(`
  <html>
    <head>
      <Title>Express Srv</Title>
    </head>
    <body>
      <form action='/' method='POST'>
        <label/>Username
        <input name='username' type='text'/>
        <br />
        <label/>Email
        <input name='email' type='email'/>
        <br />
        <label/>Password
        <input name='password' type='password'/>
        <br />
        <button type='submit'>Send</button>
      </form>
      <br />
      <a href='delete'>Delete my user account</a>
    </body>
  </html>`);
});

app.post("/", (req, res) => {
  const myObject = JSON.parse(fs.readFileSync("users.json"));

  const myArrayIndex = Object.entries(myObject);

  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let id = myArrayIndex.length.toString();

  let key = username + "=" + id;

  let users = getUsers();

  users[key] = { username, email, password, id };

  fs.writeFileSync("users.json", JSON.stringify(users));

  res.json(users);
});

app.get("/delete", (req, res) => {
  res.send(`
    <form action='delete' method='POST'>
      <label>Insert your username</label>
      <input type='text' name='deleteUsername'/>
      <input type='text' name='deletePassword'/>
      <button type='submit'>Delete</button>
    </form>
  `);
});

app.post("/delete", (req, res) => {
  const myObject = JSON.parse(fs.readFileSync("users.json"));

  const myArrayIndex = Object.entries(myObject);

  const usernameDelete = req.body.deleteUsername;
  const passwordDelete = req.body.deletePassword;

  myArrayIndex.forEach((element) => {
    element.filter((specificElement) => {
      if (
        specificElement.username === usernameDelete &&
        specificElement.password === passwordDelete
      ) {
        let key = specificElement.username + "=" + specificElement.id;
        delete myObject[key];
        fs.writeFileSync("users.json", JSON.stringify(myObject));
      }
    });
  });

  res.json(myObject);
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', (req, res) => { 
  res.status(404);
  res.send(`<h1>Error 404: Not Found :(</h1>`)
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`);
});
