const openai = require("./openai");

app.post("/chat", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Bericht ontbreekt" });
    }

    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
        });

        const reply = completion.data.choices[0].message.content;
        res.json({ response: reply });
    } catch (err) {
        console.error("OpenAI fout:", err.message);
        res.status(500).json({ error: "OpenAI API mislukt" });
    }
});
