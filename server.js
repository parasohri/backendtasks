import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './db/connect.js';
import router from './routes/User.routes.js';
import teamRouter from './routes/Team.routes.js';
import taskrouter from './routes/Task.routes.js';
import ACTIVITYLOGrouter from './routes/Activitylog.routes.js';
const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(cookieParser());
connectDB();

app.use('/api/users',router); 
app.use('/api/teams',teamRouter);
app.use('/api',taskrouter);
app.use('/api/ac',ACTIVITYLOGrouter);
const PORT=process.env.PORT || 5000;
app.get('/',(req,res)=>{
    res.send('Server is running');
});
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});