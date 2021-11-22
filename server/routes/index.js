const userRoutes = require('./usersRoute');

const constructorMethod = (app) => {
	// Landing page '/' route
	app.use('/', userRoutes);

	app.use('*', (req, res) => {
		res.sendStatus(404);
	});
};

module.exports = constructorMethod;
