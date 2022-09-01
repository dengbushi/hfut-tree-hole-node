import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Users, UsersSchema } from '../../schema/user/user.schema'
import { UserService } from '../user/user.service'
import { Holes, HolesSchema } from '../../schema/treehole/holes.schema'
import { UserDaoService } from '../../dao/user/user.service'
import { RoleService } from './role.service'
import { RolesGuard } from './guard/role.guard'
import { RoleController } from './role.controller'

@Module({
  imports: [MongooseModule.forFeature([
    { name: Users.name, schema: UsersSchema },
    { name: Holes.name, schema: HolesSchema },
  ])],
  providers: [RoleService, RolesGuard, UserService, UserDaoService],
  exports: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
