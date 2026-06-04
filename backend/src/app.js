//Importar express
import express from 'express';
import cors from 'cors'; 



import cookieParser from 'cookie-parser';

//Ejecutar express
const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'https://localhost:5174'], 
    credentials: true
}));

app.use(cookieParser());

//Acepta JSON 
app.use(express.json());


export default app;