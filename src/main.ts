import { INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'
import { useContainer } from 'class-validator'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'

function setupGlobalHandler(app: INestApplication) {
  // filters
  app.useGlobalFilters(new HttpExceptionFilter())

  // interceptors

  // pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(helmet.xssFilter())

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })

  setupGlobalHandler(app)

  await app.listen(8000)
}
bootstrap()
