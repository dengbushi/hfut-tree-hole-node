import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { FileService } from './file.service'
import { FileController } from './file.controller'

@Module({
  imports: [
    MulterModule.register({
      dest: '/uploads',
    }),
  ],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
