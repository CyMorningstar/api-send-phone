
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = '8508784654: AAGEjVr9txUd425QZvLQxHaKgEP4_P8RVkE';
const CHAT_ID = '1280916980';

export default async function handler(req, res) {
    // --- Настройка CORS ---
    // Определите URL вашего сайта на GitHub Pages.
    // Он обычно выглядит так: 'https://ваш-юзернейм.github.io/название-вашего-фронтенд-репозитория/'
    // Если вы используете кастомный домен для GitHub Pages, используйте его.
    const githubPagesUrl = 'https://github.com/CyMorningstar/-.git'; // <<<---- ЗАМЕНИТЕ ЭТО!

    res.setHeader('Access-Control-Allow-Origin', githubPagesUrl); // Разрешаем запросы ТОЛЬКО с вашего GitHub Pages сайта
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); // Разрешаем POST запросы и OPTIONS (для preflight)
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Разрешаем отправлять JSON

    // Обработка OPTIONS запроса (preflight request), который браузер посылает перед POST
    if (req.method === 'OPTIONS') {
        return res.status(204).end(); // Отвечаем 204 No Content, если это OPTIONS запрос
    }
    // --- Конец настройки CORS ---

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ success: false, message: 'Номер телефона не предоставлен' });
    }

    if (!BOT_TOKEN || !CHAT_ID) {
         console.error('BOT_TOKEN или CHAT_ID не настроены!');
         return res.status(500).json({ success: false, message: 'Ошибка конфигурации сервера' });
    }

    try {
        const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        console.log(`Sending to Telegram: ${telegramUrl} with chat_id: ${CHAT_ID} and text: 🎉 Новый номер гостя: ${phone}`);

        await axios.post(telegramUrl, {
            chat_id: CHAT_ID,
            text: `🎉 Новый номер гостя: ${phone}`
        });

        res.status(200).json({ success: true, message: 'Уведомление отправлено' });
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: 'Ошибка при отправке уведомления' });
    }
}