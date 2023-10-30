//Imports
import express from "express";



//Creating app and setting port
const app = express();
const port = 3000;

//Set up folder for the static files
app.use(express.static("public"));


//setting up the server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})



//GET the root of the website
app.get("/", (req, res) => {
    res.render("page.ejs");
})