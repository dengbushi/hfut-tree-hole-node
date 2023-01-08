import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from './file.service'
import { FileGuard } from '@/common/guards/file.guard'
import { Roles } from '@/common/decorators/roles.decorator'

@Controller('file')
@Roles()
export class FileController {
  @Inject()
  private readonly fileService: FileService

  @Post('upload')
  @UseGuards(FileGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image',
        })
        .addMaxSizeValidator({
          maxSize: 2 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
    )
    file: Express.Multer.File
  ) {
    return {
      file: file.buffer,
    }
  }

  @Get('/sts')
  generateSecretKey() {}
}
