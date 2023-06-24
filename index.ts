require("dotenv").config(); 
import express, {Request , Response} from "express";
import jwt from 'jsonwebtoken'
const app = express();  
import libraryRouter from './routes/libarayRoutes'
import registerRouter from './routes/registerRoutes'
import userRouter from './routes/userRouter'
import createError from "./error/createerror";
// const libraryRoutes=require("./routes/libraryRoutes");
// const registerRouter=require("./routes/registerRoutes");
// const userRouter=require("./routes/userRouter")

app.get('/', (req : Request, res : Response) => {
    res.send('Welcome to Library!');
})

app.use(express.json());

app.use("/register",registerRouter);

app.use("/",  (req : Request,res,next) => {
    const token = req.headers.accesstoken
    if(!token){
      return res.status(400).send({msessage:"Token not found"})
    }
    return jwt.verify(token as string,process.env.SECRET_KEY as string,(err,decoded) => {
        if(err){
          return next (createError({statusCode:401,message:"InvalidToken"}));
        }
        (req as any).User=decoded;
      return next();
      });
      
    })

app.use("/users",userRouter);    

app.use('/library',libraryRouter);    

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{                                                              
    console.log(`App is running on port ${PORT}`);
})


// routes call page