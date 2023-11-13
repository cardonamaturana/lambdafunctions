import pandas as pd
import boto3
import json
from io import BytesIO

def lambda_handler(event, context):

    # Obtener información del objeto eventData
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    file_key = event['Records'][0]['s3']['object']['key']

    # Crear cliente de S3
    s3_client = boto3.client('s3')
    print("contenido del evento: " , json.dumps(event))
    # Descargar el archivo desde S3
    response = s3_client.get_object(Bucket=bucket_name, Key=file_key)
    file_content = response['Body'].read()

    # Verificar el tipo de archivo basado en la extensión
    file_extension = file_key.split('.')[-1].lower()

    if file_extension == 'csv':
        # Leer el archivo CSV usando pandas
        df = pd.read_csv(BytesIO(file_content))
    elif file_extension in ['xls', 'xlsx']:
        # Leer el archivo Excel usando pandas
        df = pd.read_excel(BytesIO(file_content))
    else:
        return {
            'statusCode': 400,
            'body': f'Tipo de archivo no soportado: {file_extension}'
        }

    # Convertir el DataFrame a formato JSON
    json_data = df.to_json(orient='records')
    # Imprimir el resultado (puedes hacer otras operaciones con los datos)
    print("JSONDATA",json_data)

    # Aquí puedes realizar otras operaciones o almacenar los datos en otro lugar

    return {
        'statusCode': 200,
        'body': 'Procesamiento completado.'
    }
