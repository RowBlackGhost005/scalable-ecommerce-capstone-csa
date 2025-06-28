const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const { S3_BUCKET } = process.env;

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { fileName, fileType } = body;

    if (!fileName || !fileType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing fileName or fileType' }),
      };
    }

    const key = `uploads/${Date.now()}_${fileName}`;

    const params = {
      Bucket: S3_BUCKET,
      Key: key,
      Expires: 60 * 5, // 5 minutes
      ContentType: fileType,
    };

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadURL,
        key,
      }),
    };
  } catch (err) {
    console.error('Error generating pre-signed URL:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate upload URL' }),
    };
  }
};