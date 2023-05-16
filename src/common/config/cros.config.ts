import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { NestApplication } from "@nestjs/core";
import { INestApplication } from "@nestjs/common";

export class CrosConfig {

  private static _instance: CorsOptions;

  constructor() {
    CrosConfig._instance = {
      origin: true,
      credentials : true,
      // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204
    };
  }
  public static readonly init = (app: INestApplication) : void => {
    app.enableCors(CrosConfig._instance);
  }

}