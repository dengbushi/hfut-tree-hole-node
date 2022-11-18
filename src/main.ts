import { INestApplication, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import helmet from 'helmet'
import { useContainer } from 'class-validator'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Model } from 'mongoose'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { HolesCountDocument } from '@/schema/treehole/count.schema'

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

  const config = new DocumentBuilder()
    .setTitle('HFUHole')
    .setDescription('合工大树洞API')
    .setVersion('1.0')
    .addTag('cats')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'token',
    )
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  app.use(helmet.xssFilter())
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
}

async function initDatabase(app: INestApplication) {
  const holesCountModel = app.get<Model<HolesCountDocument>>('HolesCountModel')

  if (await holesCountModel.countDocuments().exec() === 0) {
    (await holesCountModel.create({
      count: 0,
      removedList: [],
    })).save()
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  setupGlobalHandler(app)
  await initDatabase(app)

  await app.listen(8000)
}
bootstrap()
