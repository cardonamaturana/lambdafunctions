var AWS = require('aws-sdk');
var s3 = new AWS.S3({
  signatureVersion: 'v4',
});

exports.handler = (event, context, callback) => {
  // Nombre del bucket de S3
  const bucketName = 'retobucket96010711301';

  // Nombre único para el objeto (puedes generarlo dinámicamente o pasarlo como parámetro)
    const objectKey = event.queryStringParameters && event.queryStringParameters.fileName
      ? event.queryStringParameters.fileName
      : 'fileNameDefault';

  // Generar una URL prefirmada para subir un objeto a S3
  const url = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: objectKey,
    Expires: 600,  // Tiempo de expiración de la URL en segundos (ajusta según sea necesario)
  });

  // Devolver la URL prefirmada generada
  callback(null, url);
};
