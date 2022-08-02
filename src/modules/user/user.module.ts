import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Users, UsersSchema } from '../../schema/user/user.schema'
import { Holes, HolesSchema } from '../../schema/treehole/holes.schema'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Users.name, schema: UsersSchema },
      { name: Holes.name, schema: HolesSchema },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
