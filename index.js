//Imports
import express from "express";
import fileUpload from "express-fileupload";
import { dirname } from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import bodyParser from "body-parser";
const __dirname = dirname(fileURLToPath(import.meta.url));


//Gyazo API
const access_token = "";
const gyazoUploadURL = "https://upload.gyazo.com/api/upload";


//Config for the ObjectCut API
const encodedParams = new URLSearchParams();
encodedParams.set('image_url', 'https://objectcut.com/assets/img/raven.jpg');

const options = {
  method: 'POST',
  url: 'https://background-removal.p.rapidapi.com/remove',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'X-RapidAPI-Key': '',
    'X-RapidAPI-Host': 'background-removal.p.rapidapi.com'
  },
  data: encodedParams,
};


//Creating app and setting port
const app = express();
const port = 3000;



//MIDLEWARE
//Set up folder for the static files
app.use(express.static("public"));
app.use(fileUpload());
app.use(bodyParser.urlencoded( {extended:true} ));



//Save the path to the image dir in a var
const imgPath = __dirname + '/public/tmp/';



//Handling the post /upload route
app.post("/upload", (req, res) => {
    //console.log(req.files);

    //Save the uploaded image in the tmp directory on the server
    const image = req.files.image;
    image.mv(__dirname + '/public/tmp/' + image.name);

    //Render EJS page passing the saved image name
    res.render("uploaded.ejs", {imgURL: image.name});
})


//End point to handle the API calls
app.post("/test", async (req, res) => {
    console.log(req.body);
    const imgURL = __dirname + '/public/tmp/' + req.body.imgURL;


    //Create new form data object to be sent to Gyazo API
    const form = new FormData();
    form.append('access_token', access_token);
    form.append('imagedata', fs.createReadStream(imgURL));

    //Make axios request
    try {
        const response = await axios.post(gyazoUploadURL, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        const publicImgUrl = response.data.url;
        console.log(response.data);

        options.data.set('image_url', publicImgUrl)

        try {
            const response = await axios.request(options);
            console.log(response.data)

            res.render('finished.ejs',  {imgURL : response.data.response.image_url} )

        } catch (error) {
            console.error(error.message);
        }

    } catch (error) {
        console.error(error.message);
    }



}) 










//GET the root of the website
app.get("/", (req, res) => {
    res.render("page.ejs");
})







//setting up the server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})
