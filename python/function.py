import json

import logging
import boto3
from botocore.exceptions import ClientError


def create_presigned_post(bucket_name, object_name, expiration=3600):
    """Generate a presigned URL S3 POST request to upload a file

    :param bucket_name: string
    :param object_name: string
    :param expiration: Time in seconds for the presigned URL to remain valid
    :return: Dictionary with the following keys:
        url: URL to post to
        fields: Dictionary of form fields and values to submit with the POST
    :return: None if error.
    """

    # Generate a presigned S3 POST URL
    s3_client = boto3.client('s3')
    try:
        response = s3_client.generate_presigned_post(bucket_name,
                                                     object_name,
                                                     ExpiresIn=expiration)
    except ClientError as e:
        logging.error(e)
        return None

    # The response contains the presigned URL and required fields
    return response




def lambda_handler(event, context):
    # TODO implement
    object_name=event['queryStringParameters']['file_name']
    print(object_name)
    bucket_name="bucketassetsfile"
    response=create_presigned_post(bucket_name, object_name, expiration=3600)
    print(response)
    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }