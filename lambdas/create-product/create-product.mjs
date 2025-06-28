const mysql = require('mysql2/promise');

const {
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  S3_BUCKET,
} = process.env;

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { name, description, price, imageKey } = body;

    if (!name || !price || !imageKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const imageUrl = `https://${S3_BUCKET}.s3.amazonaws.com/${imageKey}`;

    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
    });

    const query = `
      INSERT INTO Products (name, description, price, image_url)
      VALUES (?, ?, ?, ?)
    `;

    await connection.execute(query, [name, description || '', price, imageUrl]);
    await connection.end();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Product created successfully' }),
    };
  } catch (err) {
    console.error('Error inserting product:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};