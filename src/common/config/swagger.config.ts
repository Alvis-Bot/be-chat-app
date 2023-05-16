import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";

export class SwaggerConfig {
  public static readonly init = (app: INestApplication) : void => {
    const options :Omit<OpenAPIObject, "paths"> = new DocumentBuilder()
      .setTitle("Web BO API")
      .setDescription("Web BO API description")
      .setVersion("1.0")
      .addBearerAuth(
        { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        "Authorization",
      )
      .addSecurityRequirements("Authorization")
      .build();
    const document : OpenAPIObject = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }
}