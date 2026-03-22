const express = require("express");
const path = require("path");
// const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const { v7: uuidv7 } = require("uuid");
const methodOverrite = require("method-override");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(methodOverrite("_method"));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// to create a fake data
// const getFakeUser = () => {
//     return [
//         faker.string.uuid(),
//         faker.internet.username(),
//         faker.internet.email(),
//         faker.internet.password()
//     ];
// };

// to connect to mysql database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "demo",
    password: "T@H@mysql4879"
});

// to get count of all user
app.get("/", (req, res) => {
    let q = 'SELECT count(*) FROM users'
    connection.query(q, (err, result) => {
        if (err) {
            console.log(err);
            connection.end();
            return;
        }
        let count = result[0]['count(*)'];
        res.render("index.ejs", { count });
    })
})

// to see all users
app.get("/user", (req, res) => {
    let q = 'SELECT * FROM users'
    connection.query(q, (err, result) => {
        if (err) {
            console.log(err);
            connection.end();
            return;
        }
        let datas = result;
        res.render("users.ejs", { datas });
    })
})

// to go create page
app.get("/user/new", (req, res) => {
    res.render("new.ejs");
})

//to create a new user 
app.post("/user", (req, res) => {
    let { username, email, password } = req.body;
    let id = uuidv7();
    let q = `INSERT INTO users(id,username,email,password) VALUES ('${id}','${username}','${email}','${password}')`
    connection.query(q, (err, result) => {
        if (err) {
            console.log(err);
            connection.end();
            return;
        }
        res.redirect("/user");
    })
})

// to go edit page for username
app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM users WHERE id='${id}'`;
    connection.query(q, (err, result) => {
        if (err) {
            console.log(err);
            connection.end();
            return;
        }
        let data = result[0];
        res.render("edit.ejs", { data });
    })
})

// to update username in database
app.patch("/user/:id/edit", (req, res) => {
    let { id } = req.params;
    let { username, password } = req.body;
    let q = `SELECT * FROM users WHERE id='${id}'`;
    connection.query(q, (err, result) => {
        if (err) {
            console.log(err);
            connection.end();
            return;
        }
        let data = result[0];
        if (data.password === password) {
            let q2 = `UPDATE users SET username = '${username}' WHERE id='${id}'`;
            connection.query(q2, (err, result) => {
                if (err) {
                    console.log(err);
                    connection.end();
                    return;
                }
                res.redirect("/user");
            })
        } else {
            res.send("Please enter a correct password");
        }
    })
})

// to delete a user from database
app.delete("/user/:id", (req, res) => {
    let { id } = req.params;
    let q = `DELETE FROM users WHERE id = '${id}'`;
    connection.query(q, (err, result) => {
        if (err) {
            console.log(err);
            connection.end();
            return;
        }
        res.redirect("/user");
    })
})

app.listen(port, () => {
    console.log(`server running on port: ${port}`);
}); 