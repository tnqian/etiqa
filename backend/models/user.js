'use strict';
module.exports = function (sequelize, DataTypes) {
	var model = sequelize.define('user', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
			name            : DataTypes.STRING(50),
			username        : DataTypes.STRING(50),
			email           : DataTypes.STRING(50),
			phone_number    : DataTypes.STRING(50),
			skillsets       : DataTypes.TEXT,
			hobby           : DataTypes.TEXT,
			status          : DataTypes.STRING(50),
			created_at      : DataTypes.DATE,
			updated_at      : DataTypes.DATE,
			deleted_at      : DataTypes.DATE
	}, {
		tableName: 'user'
	});

	return model;
}