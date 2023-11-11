exports.handler = async (event, context) => {
  try {
    // Extraer información del evento de S3
    const s3Event = event.Records[0].s3;
    const bucket = s3Event.bucket.name;
    const key = s3Event.object.key;

    // Mostrar información en los logs
    console.log('Nombre del bucket:', bucket);
    console.log('Nombre del archivo:', key);

    return { statusCode: 200, body: 'Evento de S3 procesado correctamente.' };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error en la función Lambda.' }) };
  }
};
