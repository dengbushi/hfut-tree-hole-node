import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as _ from 'lodash'
import { isEmpty } from 'lodash'
import { TreeholeMode, TreeholeModeDocument, treeholeModeDefaultData } from '../../schema/treeholeMode.schema'
import { createResponse } from '../../shared/utils/create'
import { TreeholeDetailDto, TreeholeListDto } from './dto/treehole.dto'

@Injectable()
export class TreeholeService {
  constructor(
    @InjectModel(TreeholeMode.name)
    private readonly treeholeModel: Model<TreeholeModeDocument>,
  ) {
    this.initModeData()
  }

  async initModeData() {
    const modes = await this.treeholeModel.find()

    if (_.isEmpty(modes)) {
      await new this.treeholeModel({
        modes: treeholeModeDefaultData,
      }).save()
    }
  }

  async getModes() {
    const modes = await this.treeholeModel.findOne({}, { _id: 0, __v: 0 })

    if (isEmpty(modes)) {
      throw new NotFoundException('未查询到树洞浏览模式')
    }

    return createResponse('获取树洞模式成功', modes)
  }

  async getList(dto: TreeholeListDto) {
    return createResponse('获取树洞列表成功', [
      {
        desc: 'Hello World!',
        id: '1',
        createTime: '22/07/01',
        comments: 464,
        stars: 361,
        imgs: [],
      },
      {
        desc: '如果这个洞在开学前能刷到zombiezach，那dz开学请所有人吃火锅',
        id: '22as32',
        createTime: '22/06/25',
        comments: 464,
        stars: 361,
        imgs: ['https://www.steamxo.com/wp-content/uploads/2019/11/O77IpL211919_851218.jpg'],
      },
      {
        desc: '学习相关'
          + '#38100选课相关合集\n'
          + '#23772 #14643#6182马原课程测评\n'
          + '#4940#16596\n'
          + '#16285任选/文素/\n'
          + '文核测评\n'
          + '#12075文核推荐\n'
          + '#29430 R&W推荐\n'
          + '#4962二外\n'
          + '#36084英语课\n'
          + '#40172数学课\n'
          + '#16977#509讲课好的老师\n'
          + '#5030#512上一个\n'
          + '的镜像\n',
        id: '78asf9',
        createTime: '22/06/15',
        commentsNum: 464,
        stars: 361,
        imgs: [],
      },

    ])
  }

  async getDetail(dto: TreeholeDetailDto) {
    return createResponse('获取树洞详情成功', {
      desc: 'Hello World!',
      id: '1',
      createTime: '22/07/01',
      commentsNum: 464,
      stars: 361,
      comments: [
        { avatar: '', isHost: true, content: 'Hello World!', createTime: '22/07/01 18:06:53', username: 'Alice' },
        { avatar: '', isHost: false, content: '打卡', createTime: '22/07/01 18:09:54', username: 'Alice' },
      ],
      imgs: [],
    })
  }
}
