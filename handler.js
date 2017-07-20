'use strict';


var AWS = require('aws-sdk');
var YAML = require('yamljs');

// get reference to S3 client
var s3 = new AWS.S3();

module.exports.getinfo = (event, context, callback) => {
  var srcBucket = 'qa2us-auto-scaling-metadata';
  if(event.pathParameters && event.pathParameters.env) {
    srcBucket = event.pathParameters.env + '-auto-scaling-metadata';
  }
  var srcKey = 'metadata.yml';
  s3.getObject({
    Bucket: srcBucket,
    Key: srcKey
  }, function(err, data) {
    if (err) {
        console.log(err, err.stack);
        callback(err);
    } else {
        var nativeObject = YAML.parse(data.Body.toString('ascii'));
        var objArray = [];
        for( var k in nativeObject) {
          if(nativeObject.hasOwnProperty(k)) {
            var split = k.split("/");
            var instance = split[0];
            var container = split[1];
            objArray.push({
              "instance":instance,
              "container":container,
              "tag":nativeObject[k].tag,
              "cache":nativeObject[k].cache!=="disable",
            });
          }
        }

        const response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
          },
          body: JSON.stringify(objArray),
          // body: JSON.stringify(event),
        };

        callback(null, response);
    }
});


  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
