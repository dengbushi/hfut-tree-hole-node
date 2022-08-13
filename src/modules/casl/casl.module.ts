import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RoleService } from '../role/role.service'
import { Users, UsersSchema } from '../../schema/user/user.schema'
import { UserService } from '../user/user.service'
import { CaslAbilityFactory } from './casl.factory'

@Module({
  imports: [MongooseModule.forFeature([
    { name: Users.name, schema: UsersSchema },
  ])],
  providers: [CaslAbilityFactory, RoleService, UserService],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
