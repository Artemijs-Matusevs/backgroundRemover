//Imports
import express from "express";
import fileUpload from "express-fileupload";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));




//Creating app and setting port
const app = express();
const port = 3000;


//Set up folder for the static files
app.use(express.static("public"));
app.use(fileUpload());


//setting up the server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})


//Handling the post /upload route
app.post("/upload", (req, res) => {
    console.log(req.files);

    const image = req.files.image;

    image.mv(__dirname + '/tmp/' + image.name);
})


//GET the root of the website
app.get("/", (req, res) => {
    res.render("page.ejs");
})