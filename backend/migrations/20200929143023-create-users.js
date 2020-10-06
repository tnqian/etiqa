'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('user', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name            : Sequelize.STRING(50),
			username        : Sequelize.STRING(50),
			email           : Sequelize.STRING(50),
			phone_number    : Sequelize.STRING(50),
			skillsets       : Sequelize.TEXT,
			hobby           : Sequelize.TEXT,
			status          : Sequelize.STRING(50),
			created_at      : Sequelize.DATE,
			updated_at      : Sequelize.DATE,
			deleted_at      : Sequelize.DATE
		}, { charset : "utf8" })
		.then(() => queryInterface.addIndex('user', ['status','deleted_at']))
		.then(() => queryInterface.addIndex('user', ['username']))
		.then(() => queryInterface.addIndex('user', ['created_at']))
		.then(() => queryInterface.addIndex('user', ['deleted_at']))
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('user');
	}
};


