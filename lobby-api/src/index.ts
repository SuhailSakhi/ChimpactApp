import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import lobbyRoutes from "./routes/lobbyRoutes.js";  // Let op .js extensie bij import vanwege ES Modules

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Simpele root route om te checken of server draait
app.get("/", (req, res) => {
    res.send("Welkom bij de Lobby API!");
});

// Je lobby routes onder /lobbies
app.use("/lobbies", lobbyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
