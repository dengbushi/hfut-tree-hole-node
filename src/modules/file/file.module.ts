import * as fs from 'fs'
import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import * as multer from 'multer'
import { format } from 'date-fns'
import { MongooseModule } from '@nestjs/mongoose'
import { UserService } from '../user/user.service'
import { RoleService } from '../role/role.service'
import { FileService } from './file.service'
import { FileController } from './file.controller'
import { UserDaoService } from '@/dao/user/user.service'
import { Holes, HolesSchema } from '@/schema/treehole/holes.schema'
import { Users, UsersSchema } from '@/schema/user/user.schema'
import { FileGuard } from '@/common/guards/file.guard'
import * as process from 'process'

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const date = new Date()
    const folderName =
      process.cwd() + `/tmp/HFUTHole/${format(date, 'yyyy/MM/dd')}`

    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName, { recursive: true })
    }
    cb(null, folderName)
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${file.fieldname}-${uniqueSuffix}`)
  },
})

@Module({
  imports: [
    MulterModule.register({
      storage,
    }),
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
      { name: Holes.name, schema: HolesSchema },
    ]),
  ],
  providers: [FileService, FileGuard, UserService, UserDaoService, RoleService],
  controllers: [FileController],
})
export class FileModule {}
