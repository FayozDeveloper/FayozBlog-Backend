import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import fs from 'fs'
import cors from 'cors'
import {signUpValidation, loginValidation, postCreateValidation} from "./validations/Validations.js";
import {UserController, PostController} from './controllers/index.js'
import {checkAuth, handleValidationError} from "./utils/index.js";
const url = "mongodb+srv://admin:wwwwww@cluster0.xbum50o.mongodb.net/blog?retryWrites=true&w=majority"

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => console.log('DB is OK')).catch((err) => console.log('DB is error', err))

const storage = multer.diskStorage({
    destination: (_, __, clb) => {
        if (!fs.existsSync('uploads')){
            fs.mkdirSync('uploads')
        }
        // destination bu (funksiya) file qayoda save bolishi clb bu callback , clb ni ichidegi null bu xch qanaqa oshibkasin dgani , uploads esa uploads dgan papkaga saxranit bosin dgani
        clb(null, 'uploads');
    },
    filename: (_, file, clb) => {
        if (file !== undefined && file.originalname) {
            clb(null, file.originalname);
        }
    }
})

const upload = multer({storage})
const app = express();

app.use(cors())
app.use(express.json());
app.use('/uploads', express.static('uploads'));
// single('image') dgani bu biza image dgan file kutvomiz dgani
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
        success: true,
    })
})

app.get('/', (req, res) => {
   res.send('Hello world');
});

app.post('/auth/login', loginValidation, handleValidationError, UserController.login);
app.post('/auth/signup', signUpValidation, handleValidationError,UserController.signUp);
app.get('/auth/me', checkAuth,  UserController.getMe);

app.get('/posts', PostController.getAllPosts);
app.get('/posts/:id', PostController.getOnePost);
app.post('/posts', checkAuth, postCreateValidation, handleValidationError, PostController.createPosts);
app.delete('/posts/:id', checkAuth, PostController.removePost);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationError, PostController.updatePost);
app.get('/tags', PostController.getLastTags)

app.listen('4444', (err) => {
    if (err){
        return console.log('Server is error', err)
    }
})

