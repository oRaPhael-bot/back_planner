const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = 3333;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rota para criar uma nova viagem
app.post("/trips", async (req, res) => {
  const {
    destination,
    starts_at,
    ends_at,
    emails_to_invite,
    owner_name,
    owner_email,
  } = req.body;

  // Validações básicas
  if (!destination || !starts_at || !ends_at || !owner_name || !owner_email) {
    return res.status(400).json({ message: "Dados inválidos" });
  }

  try {
    const trip = await console.log(
      prisma.trip.create({
        data: {
          destination,
          starts_at: new Date(starts_at),
          ends_at: new Date(ends_at),
          emails_to_invite: JSON.stringify(emails_to_invite),
          owner_name,
          owner_email,
        },
      })
    );

    res.status(201).json(trip);
  } catch (error) {
    console.error("Erro ao criar a viagem:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

app.get("/trips/:id", async (req, res) => {
  const { id } = req.params;

  // Validação do ID
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const trip = await prisma.trip.findUnique({
      where: { id: parseInt(id) },
      include: { Participant: true }, // Inclui os participantes associados
    });

    if (!trip) {
      return res.status(404).json({ message: "Viagem não encontrada" });
    }

    res.json(trip);
  } catch (error) {
    console.error("Erro ao buscar a viagem:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// Rota para buscar os participantes de uma viagem
app.get("/trips/:id/participants", async (req, res) => {
  const { id } = req.params;

  // Validação do ID
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  try {
    const participants = await prisma.participant.findMany({
      where: { tripId: id },
    });

    if (participants.length === 0) {
      return res
        .status(404)
        .json({ message: "Nenhum participante encontrado para esta viagem" });
    }

    res.json(participants);
  } catch (error) {
    console.error("Erro ao buscar os participantes:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

app.post("/trips/:id/participants", async (req, res) => {
  const { id } = req.params;
  const { participants } = req.body;

  if (!Array.isArray(participants) || participants.length === 0) {
    return res.status(400).json({ message: "Participantes inválidos" });
  }

  try {
    const trip = await prisma.trip.findUnique({
      where: { id: parseInt(id) },
    });

    if (!trip) {
      return res.status(404).json({ message: "Viagem não encontrada" });
    }

    const newParticipants = participants.map((participant) => ({
      name: participant.name,
      email: participant.email,
      is_confirmed: participant.is_confirmed || false,
      tripId: parseInt(id),
    }));

    await prisma.participant.createMany({
      data: newParticipants,
    });

    res.status(201).json({ message: "Participantes adicionados com sucesso" });
  } catch (error) {
    console.error("Erro ao adicionar participantes:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

// app.get("/trips/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const trip = await prisma.trip.findUnique({
//       where: { id: parseInt(id) },
//     });

//     if (!trip) {
//       return res.status(404).json({ message: "Viagem não encontrada" });
//     }

//     res.json(trip);
//   } catch (error) {
//     console.error("Erro ao buscar a viagem:", error);
//     res.status(500).json({ message: "Erro interno do servidor" });
//   }
// });

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
