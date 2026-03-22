const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do MySQL
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'ifrs_cardapio'
};

let pool = mysql.createPool(dbConfig);

// Função para gerar dados de teste na primeira vez
async function autoSeedCurrentWeek() {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM menus');
    if (rows[0].count === 0) {
        console.log("A gerar cardápios de teste...");
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));

        const baseAlmoco = JSON.stringify(["Arroz branco", "Feijão", "Salada mista", "Fruta"]);
        const baseJantar = JSON.stringify(["Arroz integral", "Lentilha", "Salada verde", "Sobremesa"]);

        for (let i = 0; i < 5; i++) {
            const currentDay = new Date(startOfWeek);
            currentDay.setDate(startOfWeek.getDate() + i);
            const dateStr = currentDay.toISOString().split('T')[0];

            await pool.query(`INSERT INTO menus (date, meal_type, items) VALUES (?, ?, ?)`,
                [dateStr, 'Almoço', JSON.stringify([i % 2 === 0 ? "Bife" : "Frango", ...JSON.parse(baseAlmoco)])]);
            await pool.query(`INSERT INTO menus (date, meal_type, items) VALUES (?, ?, ?)`,
                [dateStr, 'Jantar', JSON.stringify([i % 2 === 0 ? "Massa" : "Sopa", ...JSON.parse(baseJantar)])]);
        }
    }
}
autoSeedCurrentWeek();

// ======================= ROTAS =======================

app.post('/api/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        const [users] = await pool.query('SELECT id, login, type, name FROM users WHERE login = ? AND password = ?', [login, password]);
        if (users.length > 0) res.json({ success: true, user: users[0] });
        else res.status(401).json({ success: false, message: 'Inválido' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/menus', async (req, res) => {
    try {
        const [menus] = await pool.query('SELECT id, DATE_FORMAT(date, "%Y-%m-%d") as date, meal_type, items FROM menus ORDER BY date, meal_type');
        res.json(menus.map(m => ({ ...m, items: typeof m.items === 'string' ? JSON.parse(m.items) : m.items })));
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// NOVA ROTA: Atualizar Cardápio (Apenas itens por agora)
app.put('/api/menus/:id', async (req, res) => {
    try {
        const { items } = req.body;
        // Transforma o array de volta em JSON para o MySQL
        await pool.query('UPDATE menus SET items = ? WHERE id = ?', [JSON.stringify(items), req.params.id]);
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/favorites', async (req, res) => {
    try {
        await pool.query('INSERT IGNORE INTO favorites (user_id, menu_id) VALUES (?, ?)', [req.body.user_id, req.body.menu_id]);
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.delete('/api/favorites/:user_id/:menu_id', async (req, res) => {
    try {
        await pool.query('DELETE FROM favorites WHERE user_id = ? AND menu_id = ?', [req.params.user_id, req.params.menu_id]);
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/favorites/:user_id', async (req, res) => {
    try {
        const [favorites] = await pool.query('SELECT menu_id FROM favorites WHERE user_id = ?', [req.params.user_id]);
        res.json(favorites.map(f => f.menu_id));
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.listen(3000, () => console.log('API na porta 3000'));