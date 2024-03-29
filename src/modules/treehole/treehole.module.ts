import { CacheModule, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RoleModule } from '../role/role.module'
import { RoleService } from '../role/role.service'
import { UserService } from '../user/user.service'
import { CaslAbilityFactory } from '../casl/casl.factory'
import { TreeholeController } from './treehole.controller'
import { TreeholeService } from './treehole.service'
import { ModeService } from './mode.service'
import { ValidateHoleId } from './dto/utils'
import { ValidateCommentId } from './dto/comment.dto'
import { IsModeExist } from './dto/mode.dto'
import { UserDaoService } from '@/dao/user/user.service'
import {
  HoleDetail,
  HoleDetailSchema,
} from '@/schema/treehole/holeDetail.schema'
import { Users, UsersSchema } from '@/schema/user/user.schema'
import { TreeholeDaoService } from '@/dao/treehole/treehole-dao.service'
import { Holes, HolesSchema } from '@/schema/treehole/holes.schema'
import {
  TreeholeMode,
  TreeholeModeSchema,
} from '@/schema/treehole/treeholeMode.schema'
import { HolesCount, HolesCountSchema } from '@/schema/treehole/count.schema'
import { TreeholeModel } from '@/modules/treehole/treehole.model'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TreeholeMode.name, schema: TreeholeModeSchema },
      { name: Holes.name, schema: HolesSchema },
      { name: Users.name, schema: UsersSchema },
      { name: HoleDetail.name, schema: HoleDetailSchema },
      { name: HolesCount.name, schema: HolesCountSchema },
    ]),
    CacheModule.register(),
    RoleModule,
  ],
  controllers: [TreeholeController],
  providers: [
    TreeholeService,
    IsModeExist,
    ValidateHoleId,
    ValidateCommentId,
    TreeholeDaoService,
    ModeService,
    CaslAbilityFactory,
    RoleService,
    UserService,
    UserDaoService,
    TreeholeModel,
  ],
})
export class TreeholeModule {}
