import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TreeholeMode, TreeholeModeSchema } from '../../schema/treehole/treeholeMode.schema'
import { Holes, HolesSchema } from '../../schema/treehole/holes.schema'
import { TreeholeDaoService } from '../../dao/treehole/treehole-dao.service'
import { TreeholeController } from './treehole.controller'
import { TreeholeService } from './treehole.service'
import { ModeService } from './mode.service'
import { IsModeExist, ValidateId } from './dto/utils'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TreeholeMode.name, schema: TreeholeModeSchema },
      { name: Holes.name, schema: HolesSchema },
    ]),
  ],
  controllers: [TreeholeController],
  providers: [
    TreeholeService,
    IsModeExist,
    ValidateId,
    TreeholeDaoService,
    ModeService,
  ],
})
export class TreeholeModule {}
