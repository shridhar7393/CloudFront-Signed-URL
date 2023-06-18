const express = require('express');
require('dotenv').config();
const AWS = require("aws-sdk");

const app = express();
const port = 3000;

app.get('/getImage', (req, res) => {
  const signedUrlParams = {
    url: `${process.env.CLOUDFRONT_DOMAIN}/${process.env.S3_OBJECT_KEY}`,
    expires: Math.floor(Date.now() / 1000) + 300, // set expire time for 5 mins.
  };

  new AWS.CloudFront.Signer(process.env.CLOUDFRONT_KEY_PAIR_ID, process.env.CLOUDFRONT_PK.replace(/\\n/g, '\n'))
    .getSignedUrl(signedUrlParams, (err, url) => {
      if (err) {
        console.error('Error generating signed URL:', err);
        res.status(500).send('Error generating signed URL');
      } else {
        console.log('Signed URL:', url);
        res.send('Signed URL generated. Check console for the SignedURL');
      }
    });
});

app.listen(port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});
