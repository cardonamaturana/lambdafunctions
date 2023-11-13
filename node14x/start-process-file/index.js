const AWS = require('aws-sdk');
const stepfunctions = new AWS.StepFunctions();

exports.handler = async (event, context) => {
  try {
    // Información que deseas pasar a la Step Function
    const eventData = {
      bucket: event.Records[0].s3.bucket.name,
      key: event.Records[0].s3.object.key,
    };
    console.log("event.json", JSON.stringify(event, null, 2));
    console.log("evenData", JSON.stringify(eventData, null, 2));


    // Configuración para iniciar la ejecución de la Step Function de manera asíncrona
    const params = {
      stateMachineArn: 'ARN_DE_TU_STEP_FUNCTION', // Reemplaza con el ARN real de tu Step Function
      input: JSON.stringify(event),
    };

    // Inicia la ejecución de la Step Function
    const result = await stepfunctions.startExecution(params).promise();
    console.log('Step Function execution started:', result);

    // Resto de tu lógica y manejo de errores
  }
  catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error in Lambda function.' }) };
  }
};
