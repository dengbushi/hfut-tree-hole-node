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
import { HoleDetail, HoleDetailSchema } from '../../schema/treehole/holeDetail.schema'
import { TreeholeController } from './treehole.controller'
import { TreeholeService } from './treehole.service'
import { ModeService } from './mode.service'
import { IsModeExist, ValidateHoleId, ValidateId } from './dto/utils'
import { CreateHolePolicyHandler } from './policies/create.police'
import { DeleteHolePolicyHandler } from './policies/delete.police'
import { UpdateHolePolicyHandler } from './policies/update.police'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TreeholeMode.name, schema: TreeholeModeSchema },
      { name: Holes.name, schema: HolesSchema },
      { name: Users.name, schema: UsersSchema },
      { name: HoleDetail.name, schema: HoleDetailSchema },
    ]),
    RoleModule,
  ],
  controllers: [TreeholeController],
  providers: [
    TreeholeService,
    IsModeExist,
    ValidateId,
    ValidateHoleId,
    TreeholeDaoService,
    ModeService,
    CaslAbilityFactory,
    RoleService,
    UserService,
    CreateHolePolicyHandler,
    DeleteHolePolicyHandler,
    UpdateHolePolicyHandler,
  ],
})
export class TreeholeModule {}
