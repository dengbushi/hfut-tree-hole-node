import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as _ from 'lodash'
import { Holes, HolesDocument } from '../../schema/treehole/holes.schema'
import { TreeholeMode, TreeholeModeDocument, treeholeModeDefaultData } from '../../schema/treehole/treeholeMode.schema'
import { createResponse } from '../../shared/utils/create'

@Injectable()
export class ModeService {
  @InjectModel(Holes.name)
  private readonly holesModel: Model<HolesDocument>

  constructor(
    @InjectModel(TreeholeMode.name)
    private readonly modeModel: Model<TreeholeModeDocument>,
  ) {
    this.initModeData()
  }

  async initModeData() {
    const modes = await this.modeModel.find()

    if (_.isEmpty(modes)) {
      await new this.modeModel({
        modes: treeholeModeDefaultData,
      }).save()
    }
  }

  async getModes() {
    const modes = await this.modeModel.findOne({}, { _id: 0, __v: 0 })

    if (_.isEmpty(modes)) {
      throw new NotFoundException('未查询到树洞浏览模式')
    }

    return createResponse('获取树洞模式成功', modes)
  }
}
