import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TreeholeMode, TreeholeModeSchema } from '../../schema/treeholeMode.schema'
import { TreeholeController } from './treehole.controller'
import { TreeholeService } from './treehole.service'
import { IsModeExist } from './dto/treehole.dto'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TreeholeMode.name, schema: TreeholeModeSchema },
    ]),
  ],
  controllers: [TreeholeController],
  providers: [TreeholeService, IsModeExist],
})
export class TreeholeModule {}
