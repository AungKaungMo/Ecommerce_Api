import express from 'express';
import { ENV } from './config/env';
import { connectDB } from './config/db';
import { clerkMiddleware } from '@clerk/express'
import { functions, inngest } from './config/inngest';
import { serve } from 'inngest/express';
import adminRoutes from './routes/admin.route';

const app = express();

app.use(express.json())
app.use(clerkMiddleware())
// const __dirname = path.resolve();

app.use('/api/inngest', serve({ client: inngest, functions }))
app.use("/api/admin", adminRoutes)

app.get("/api/health", (req, res) => {
    res.status(200).json({message: "API is working."})
})

// if(ENV.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, "../Admin/dist")))

//     app.get("/{*any}", (req, res) => {
//         res.sendFile(path.join(__dirname, "../Admin", "dist", "index.html"))
//     })
// }

const startServer = async() => {
    await connectDB();
    app.listen(ENV.PORT, () => {
        console.log("API Server is running on PORT:", ENV.PORT)
    })
}

startServer()