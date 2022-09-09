import { CacheModule, Module } from '@nestjs/common'
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
import { UserDaoService } from '../../dao/user/user.service'
import { TreeholeController } from './treehole.controller'
import { TreeholeService } from './treehole.service'
import { ModeService } from './mode.service'
import { ValidateHoleId, ValidateId } from './dto/utils'
import { ValidateCommentId } from './dto/comment.dto'
import { IsModeExist } from './dto/mode.dto'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TreeholeMode.name, schema: TreeholeModeSchema },
      { name: Holes.name, schema: HolesSchema },
      { name: Users.name, schema: UsersSchema },
      { name: HoleDetail.name, schema: HoleDetailSchema },
    ]),
    CacheModule.register(),
    RoleModule,
  ],
  controllers: [TreeholeController],
  providers: [
    TreeholeService,
    IsModeExist,
    ValidateId,
    ValidateHoleId,
    ValidateCommentId,
    TreeholeDaoService,
    ModeService,
    CaslAbilityFactory,
    RoleService,
    UserService,
    UserDaoService,
  ],
})
export class TreeholeModule {}
