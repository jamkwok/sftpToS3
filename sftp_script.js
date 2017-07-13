'use strict';
const fs = require('fs');
const root = require('./lib');
const path = require('path');
const aws = require('aws-sdk');
var s3 = new aws.S3();
var ses = new aws.SES({region: 'us-east-1'});
const sftpService = root.SFTPService;
//Configure
const sftpFilePath = '/upload/someFile.txt';
const bucket = 'someBucket';
const s3destinationDir = 'someDir/';
const emailRecipient = 'james.z.kwok@gmail.com'
const sftp = new sftpService({ host: '127.0.0.1', port: '2222', username: 'foo', password: 'pass'});
//get SFTP object stream and upload stream to s3
sftp.getObjectStream(sftpFilePath).then((readStream) => {
  //path.basename extracts filename from path
  var params = {Bucket: bucket, Key: s3destinationDir + path.basename(sftpFilePath), Body: readStream};
  //Upload to S3
  s3.upload(params, (err, data) => {
    if(data) {
      var message = 'Success: file ' + path.basename(sftpFilePath) + ' uploaded to s3 bucket ' + bucket;
    } else {
      var message = 'Failed: file ' + path.basename(sftpFilePath) + ' uploaded to s3 bucket ' + bucket;
    }
    //Send out email
    ses.sendEmail( {
      Source: emailRecipient,
      Destination: { ToAddresses: [ emailRecipient ] },
      Message: {
        Subject: {
          Data: 's3Upload'
        },
        Body: {
           Text: {
               Data: message,
           }
        }
      }
    },(err, data) => {
    if(err) throw err
        console.log('Email sent:');
        console.log(data);
        //Close app
        process.exit();
    });
    console.log('done');
  });
}).catch((err) => {
  console.log(err, 'catch error');
});
