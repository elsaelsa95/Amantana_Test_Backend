'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Treatments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstTreatment: {
        allowNull:true,
        type: Sequelize.DATE
      },
      lastTreatment: {
        allowNull:true,
        type: Sequelize.DATE
      },
      fertilizer: {
        allowNull:true,
        type: Sequelize.STRING
      },
      note: {
        allowNull:true,
        type: Sequelize.TEXT
      },
      UserId: {
        allowNull:false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      PlantId: {
        allowNull:false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Plants',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Treatments');
  }
};