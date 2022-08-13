import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TreeholeMode, TreeholeModeSchema } from '../../schema/treehole/treeholeMode.schema'
import { Holes, HolesSchema } from '../../schema/treehole/holes.schema'
import { TreeholeDaoService } from '../../dao/treehole/treehole-dao.service'
import { RoleModule } from '../role/role.module'
import { RoleService } from '../role/role.service'
import { Users, UsersSchema } from '../../schema/user/user.schema'
import { UserService } from '../user/user.service'
import { CaslAbilityFactory } from '../casl/casl.factory'
import { TreeholeController } from './treehole.controller'
import { TreeholeService } from './treehole.service'
import { ModeService } from './mode.service'
import { IsModeExist, ValidateId } from './dto/utils'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TreeholeMode.name, schema: TreeholeModeSchema },
      { name: Holes.name, schema: HolesSchema },
      { name: Users.name, schema: UsersSchema },
    ]),
    RoleModule,
  ],
  controllers: [TreeholeController],
  providers: [
    TreeholeService,
    IsModeExist,
    ValidateId,
    TreeholeDaoService,
    ModeService,
    CaslAbilityFactory,
    RoleService,
    UserService,
  ],
})
export class TreeholeModule {}
