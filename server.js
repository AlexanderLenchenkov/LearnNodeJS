const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const postRoutes = require('./routes/post-routes');
const contactRoutes = require('./routes/contact-routes');
const createPath = require('./helpers/create-path');

const app = express();

// для использования шаблонизатора
app.set('view engine', 'ejs');

// константы
const PORT = 3000;
const DB_URL = 'mongodb://localhost:27017/node-blog';

// подключение к БД
mongoose
	.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(res => console.log('Connected to DB'))
	.catch(error => console.log(error));

app.listen(PORT, error => {
	error ? console.log(error) : console.log(`listening port ${PORT}`);
});

// выводит информацию о запросе в консоль
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.urlencoded({ extended: false }));
// для подключения статического файла, который изначально запрещён
app.use(express.static('styles'));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
	const title = 'Home';
	res.render(createPath('index'), { title });
});
app.use(postRoutes);
app.use(contactRoutes);

// Если ни один из энд поинтов не подошел, вызывается ошибка
app.use((req, res) => {
	const title = 'Error Page';
	res.status(404).render(createPath('error'), { title });
});
