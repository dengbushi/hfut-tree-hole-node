import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TreeholeDaoService } from './treehole/treehole-dao.service'
import { UserDaoService } from './user/user.service'
import { TreeholeMode, TreeholeModeSchema } from '@/schema/treehole/treeholeMode.schema'
import { Holes, HolesSchema } from '@/schema/treehole/holes.schema'
import { Users, UsersSchema } from '@/schema/user/user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TreeholeMode.name, schema: TreeholeModeSchema },
      { name: Holes.name, schema: HolesSchema },
      { name: Users.name, schema: UsersSchema },
    ]),
  ],
  providers: [
    TreeholeDaoService,
    UserDaoService,
  ],
})
export class DaoModule {}
