import express from 'express'
import cors from 'cors'
import { ACCESS_TOKEN, PORT } from './config'

import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

app.use(cors({
    origin: '*',
    allowedHeaders: '*'
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

type Note = {
    title: string,
    content: string
}

app.use((req, res, next) => {
    // token = undefined
    const token = req.header('x-access-token')

    if (!token || token != ACCESS_TOKEN) {
        return res
            .status(400)
            .send("Access denied")
    }
    next()
})

app.get('/', (req, res) => {
    res.send("Salom aleykum, Hush kelib siz API ga")
})

app.post('/notes', async (req, res) => {
    const body: Note = req.body
    
    const result = await prisma.notes.create({
        data: {
            title: body.title,
            content: body.content
        }
    })

    res.json(result)
})

app.get('/notes', async (req, res) => {
    
    const result = await prisma.notes.findMany()
    res.json(result)
})

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT)
})