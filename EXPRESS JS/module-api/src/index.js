import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());


const postRouter = express.Router();

const PORT = process.env.PORT
const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
});
// console.log(connection);

postRouter.get('/', async (req, res) => {
    try {
        const [data] = await connection.query('SELECT * FROM posts')
        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Success get all content',
            data
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            statusCode: 500,
            message: `${error}`,
        })
    }
})

postRouter.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const [data] = await connection.query('SELECT * FROM posts')
        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Success get content with id = ' + id,
            data: data[id - 1]
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            statusCode: 500,
            message: `${error}`,
        })
    }
})

postRouter.post('/', async (req, res) => {
    const { content } = req.body

    if (!content) {
        return res.status(400).json({
            status: false,
            statusCode: 400,
            message: 'Missing some required fields',
        })
    }

    try {
        const sql = `INSERT INTO posts (content) VALUES (?)`
        const VALUES = [content]

        const [data] = await connection.execute(sql, VALUES)
        return res.status(200).json({
            status: true,
            statusCode: 201,
            message: 'Success create new content',
            data
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            statusCode: 500,
            message: `${error}`,
        })
    }
})

postRouter.patch('/:id', async (req, res) => {
    const { id } = req.params
    
    const { content } = req.body

    try {
        const sql = 'UPDATE posts SET content = ? WHERE id = ?'
        const VALUES = [content, id]

        const [data] = await connection.execute(sql, VALUES)
        return res.status(201).json({
            status: true,
            statusCode: 201,
            message: 'Success update content with id = ' + id,
            data
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            statusCode: 500,
            message: `${error}`,
        })
    }
})

postRouter.put('/:id', async (req, res) => {
    const { id } = req.params

    const { content } = req.body

    if (!content) {
        return res.status(400).json({
            status: false,
            statusCode: 400,
            message: 'Missing some required fields',
        })
    }

    try {
        const sql = 'UPDATE posts SET content = ? WHERE id = ?'
        const VALUES = [content, id]

        const [data] = await connection.execute(sql, VALUES)
        return res.status(201).json({
            status: true,
            statusCode: 201,
            message: 'Success update content with id = ' + id,
            data
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            statusCode: 500,
            message: `${error}`,
        })
    }
})

postRouter.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const sql = 'DELETE FROM posts WHERE id = ?'
        const VALUES = [id]

        const [data] = await connection.execute(sql, VALUES)
        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Success delete content with id = ' + id,
            data
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            statusCode: 500,
            message: `${error}`,
        })
    }
})

app.use('/posts', postRouter)

app.listen(PORT, () => {
    console.log(`Server listenig on http://localhost:${PORT}`)
})
