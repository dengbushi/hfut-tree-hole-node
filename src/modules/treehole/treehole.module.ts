import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TreeholeMode, TreeholeModeSchema } from '../../schema/treehole/treeholeMode.schema'
import { Holes, HolesSchema } from '../../schema/treehole/holes.schema'
import { TreeholeDaoService } from '../../dao/treehole-dao.service'
import { TreeholeController } from './treehole.controller'
import { TreeholeService } from './treehole.service'
import { IsModeExist } from './dto/treehole.dto'
import { ModeService } from './mode.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TreeholeMode.name, schema: TreeholeModeSchema },
      { name: Holes.name, schema: HolesSchema },
    ]),
  ],
  controllers: [TreeholeController],
  providers: [TreeholeService, IsModeExist, TreeholeDaoService, ModeService],
})
export class TreeholeModule {}
