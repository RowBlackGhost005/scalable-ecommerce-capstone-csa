const mysql = require('mysql2/promise');
const AWS = require('aws-sdk');

const {
  DB_HOST,
  DB_USER,
  DB_PASS,
  DB_NAME,
  S3_BUCKET,
} = process.env;

const s3 = new AWS.S3();

exports.handler = async (event) => {
  let connection;

  try {
    const productId = event.pathParameters?.id;
    if (!productId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Product ID is required' }),
      };
    }

    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
    });

    // Step 1: Get image key from DB
    const [rows] = await connection.execute(
      'SELECT image_url FROM Products WHERE id = ?',
      [productId]
    );

    if (rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Product not found' }),
      };
    }

    const imageUrl = rows[0].image_url;
    const imageKey = imageUrl.split(`/${S3_BUCKET}/`)[1] || imageUrl.split('.amazonaws.com/')[1];

    // Step 2: Delete product from DB
    await connection.execute('DELETE FROM Products WHERE id = ?', [productId]);

    // Step 3: Delete image from S3
    if (imageKey) {
      await s3
        .deleteObject({
          Bucket: S3_BUCKET,
          Key: imageKey,
        })
        .promise();
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Product and image deleted successfully' }),
    };
  } catch (err) {
    console.error('Error deleting product:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete product' }),
    };
  } finally {
    if (connection) await connection.end();
  }
};