import express, { Router, Request, Response } from "express";
import pool from "../db.js"; // default import

const router: Router = express.Router();

router.get("/:code", async (req: Request, res: Response): Promise<void> => {
    const code = req.params.code;

    try {
        const result = await pool.query(
            "SELECT * FROM lobbies WHERE code = $1",
            [code]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Lobby not found" });
            return;
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("DB error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;
