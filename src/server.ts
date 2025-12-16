import express from 'express';
import { ENV } from './config/env';

const app = express();

// const __dirname = path.resolve();
console.log("WHAT?")
app.get("/api/health", (req, res) => {
    res.status(200).json({message: "API is working."})
})

// if(ENV.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, "../Admin/dist")))

//     app.get("/{*any}", (req, res) => {
//         res.sendFile(path.join(__dirname, "../Admin", "dist", "index.html"))
//     })
// }

app.listen(ENV.PORT, () => console.log("API Server is running on PORT:", ENV.PORT))