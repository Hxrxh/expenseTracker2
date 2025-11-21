const AWS = require("aws-sdk");

async function uploadtoS3(data, filename) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.AWS_ACCESS_KEY_ID;
  const IAM_USER_SECRET = process.env.AWS_SECRET_ACCESS_KEY;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log("Something went wrong", err);
        reject(err);
      } else {
        console.log("Success", s3response.Location);
        resolve(s3response.Location);
      }
    });
  });
}

module.exports = uploadtoS3;
