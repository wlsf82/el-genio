const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const User = require('../models/User');

async function resetRootUser() {
  try {
    const username = process.env.ROOT_USER;
    const password = process.env.ROOT_PASSWORD;

    if (!username || !password) {
      console.error('ROOT_USER or ROOT_PASSWORD environment variables are missing');
      process.exit(1);
    }

    await sequelize.authenticate();

    // Delete existing root user if exists
    await User.destroy({ where: { username } });

    // Create new root user with provided credentials
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash });

    console.log(`Root user ${username} recreated successfully`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to reset root user:', error);
    process.exit(1);
  }
}

resetRootUser();
