import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Users, UsersSchema } from '../../schema/user/user.schema'
import { UserService } from '../user/user.service'
import { RoleService } from './role.service'
import { RolesGuard } from './guard/role.guard'
import { RoleController } from './role.controller';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Users.name, schema: UsersSchema },
  ])],
  providers: [RoleService, RolesGuard, UserService],
  exports: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
