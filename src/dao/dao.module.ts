import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TreeholeMode, TreeholeModeSchema } from '../schema/treehole/treeholeMode.schema'
import { Holes, HolesSchema } from '../schema/treehole/holes.schema'
import { TreeholeDaoService } from './treehole/treehole-dao.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TreeholeMode.name, schema: TreeholeModeSchema },
      { name: Holes.name, schema: HolesSchema },
    ]),
  ],
  providers: [TreeholeDaoService],
})
export class DaoModule {}
