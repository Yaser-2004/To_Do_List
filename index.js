import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
const port = 3000;
dotenv.config();

const db = new pg.Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const boxColors = ["#ffe7e7", "#c1ffd1", "#f8ffc1", "#c4fcff", "#DACDFF", "#FFCDF7"];
const textColors = ["#FF2929", "#06C138", "#B7BB00", "#039BCB", "#6B37FF", "#FF00D6"];

let listContent = [
    {id: 1, work: "Meditation - Yoga"},
    {id: 2, work: "Practice Development"},
];

app.get("/", async (req, res) => {
    listContent = [];
    const list = await db.query("SELECT * FROM list ORDER BY id ASC");
    list.rows.forEach(row => {
        listContent.push(row);
    });

    res.render("index.ejs", {listContent: listContent, boxColor: boxColors, textColor: textColors});
});

app.post("/add", async (req, res) => {
    // const newItem = {id: parseInt(req.params.id), work: req.body.work};
    try {
        const addItem = await db.query("INSERT INTO list (work) VALUES ($1)", [req.body.work]);
        res.redirect("/");
    } catch(err) {
        console.log(err);
    }
});

app.post("/edit", async (req, res) => {
    try {
        await db.query("UPDATE list SET work=($1) WHERE id=($2)", [req.body.updatedItemWork, req.body.updatedItemId]);
        res.redirect("/");
    } catch(err) {
        console.log(err);
    }
});

app.post("/delete", async (req, res) => {
    try {
        await db.query("DELETE FROM list WHERE id=($1)", [req.body.deleteItemId]);
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});





app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});


// CREATE TABLE list(
// 	id SERIAL PRIMARY KEY,
// 	work TEXT
// );

// INSERT INTO list (work)
// VALUES ('Meditation - Yoga'), ('Practice Development'), ('Leetcode Questions'), ('Study DSA Topics');