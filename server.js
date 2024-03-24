const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Функция для загрузки данных из файла
function loadViewsData() {
    try {
        const data = fs.readFileSync('views.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error loading views data:", err);
        return {};
    }
}

// Функция для сохранения данных в файл
function saveViewsData(views) {
    try {
        fs.writeFileSync('views.json', JSON.stringify(views, null, 2), 'utf8');
    } catch (err) {
        console.error("Error saving views data:", err);
    }
}

// Загрузка данных при запуске сервера
let viewsData = loadViewsData();

// Промежуточная функция для увеличения счетчика просмотров
function countViews(req, res, next) {
    const url = req.url;
    if (viewsData[url]) {
        viewsData[url]++;
    } else {
        viewsData[url] = 1;
    }
    saveViewsData(viewsData);
    next();
}

// Промежуточная функция для обработки запросов к корневому маршруту
app.get('/', countViews, (req, res) => {
    res.send(`Welcome to the homepage! Views: ${viewsData['/']}`);
});

// Промежуточная функция для обработки запросов к маршруту "/about"
app.get('/about', countViews, (req, res) => {
    res.send(`About us page! Views: ${viewsData['/about']}`);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
