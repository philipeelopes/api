import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

app.use(express.json())

// CORS – permite apenas seu front
app.use(cors({
  origin: 'https://philipeelopes.github.io'
}))

// Porta dinâmica (Render) ou local
const PORT = process.env.PORT || 5000

// Rota de teste
app.get('/', (req, res) => {
  res.send('API de usuários rodando 🚀')
})

// CRIAR USUÁRIO
app.post('/usuarios', async (req, res) => {
  try {
    const { name, email, age } = req.body

    const user = await prisma.user.create({
      data: {
        name,
        email,
        age: Number(age)
      }
    })

    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' })
  }
})

// LISTAR USUÁRIOS
app.get('/usuarios', async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' })
  }
})

// ATUALIZAR USUÁRIO
app.put('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, age } = req.body

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        age: Number(age)
      }
    })

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' })
  }
})

// DELETAR USUÁRIO
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params

    await prisma.user.delete({
      where: { id }
    })

    res.status(200).json({ message: 'Usuário deletado com sucesso' })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário' })
  }
})

// Encerramento seguro do Prisma
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
