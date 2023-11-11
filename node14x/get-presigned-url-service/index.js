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

  // Obtener el correo electrónico del solicitante de la consulta (si está disponible)
  const requesterEmail = event.queryStringParameters && event.queryStringParameters.email;

  // Validar la presencia y el formato correcto del correo electrónico
  if (!requesterEmail || !isValidEmail(requesterEmail)) {
    const errorMessage = 'El correo electrónico es obligatorio y debe tener un formato válido.';
    callback(null, { statusCode: 400, body: JSON.stringify({ error: errorMessage }) });
    return;
  }

  // Validar la extensión del archivo permitida (.xlsx, .xls, .csv)
  const allowedExtensions = ['.xlsx', '.xls', '.csv'];
  const fileExtension = objectKey.split('.').pop().toLowerCase();

  if (!allowedExtensions.includes(`.${fileExtension}`)) {
    const errorMessage = `La extensión del archivo no es válida. Solo se permiten archivos ${allowedExtensions.join(', ')}.`;
    callback(null, { statusCode: 400, body: JSON.stringify({ error: errorMessage }) });
    return;
  }

  // Generar una URL prefirmada para subir un objeto a S3
  const url = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: objectKey,
    Expires: 180,  // Tiempo de expiración de la URL en segundos (ajusta según sea necesario),
    Metadata: {
      email: requesterEmail,
    },
  });

  // Devolver la URL prefirmada generada
  callback(null, url);
};

// Función para validar el formato del correo electrónico
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
