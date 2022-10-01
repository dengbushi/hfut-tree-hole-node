import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RoleService } from '../role/role.service'
import { UserService } from '../user/user.service'
import { CaslAbilityFactory } from './casl.factory'
import { Users, UsersSchema } from '@/schema/user/user.schema'
import { Holes, HolesSchema } from '@/schema/treehole/holes.schema'
import { UserDaoService } from '@/dao/user/user.service'

@Module({
  imports: [MongooseModule.forFeature([
    { name: Users.name, schema: UsersSchema },
    { name: Holes.name, schema: HolesSchema },
  ])],
  providers: [CaslAbilityFactory, RoleService, UserService, UserDaoService],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
