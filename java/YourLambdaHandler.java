import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;

import java.util.Map;

public class YourLambdaHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent event, Context context) {
        // Nombre del bucket de S3
        String bucketName = "retobucket96010711301";

        // Nombre único para el objeto (puedes generarlo dinámicamente o pasarlo como parámetro)
        String objectKey = (event.getQueryStringParameters() != null && event.getQueryStringParameters().containsKey("fileName"))
                ? event.getQueryStringParameters().get("fileName")
                : "fileNameDefault";

        // Generar una URL prefirmada para subir un objeto a S3
        AmazonS3 s3 = AmazonS3ClientBuilder.defaultClient();
        String url = s3.generatePresignedUrl(bucketName, objectKey, 600).toString();

        // Crear una respuesta para la API Gateway
        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
        response.setStatusCode(200);
        response.setBody("{\"url\":\"" + url + "\"}");

        return response;
    }
}
