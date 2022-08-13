import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Request } from 'express'
import { AppAbility } from '../../casl/casl.factory'
import { IPolicyHandler } from '../../../common/decorators/CheckPolicies.decorator'
import { Action } from '../../../common/enums/action.enum'
import { TreeholeDaoService } from '../../../dao/treehole/treehole-dao.service'
import { Holes } from '../../../schema/treehole/holes.schema'

@Injectable()
export class DeleteHolePolicyHandler implements IPolicyHandler {
  @Inject()
  private readonly treeholeDaoService: TreeholeDaoService

  async handle(ability: AppAbility, req: Request) {
    const hole = await this.treeholeDaoService.findById(req.body.id)

    if (!hole) {
      throw new NotFoundException('没有找到这个树洞哎ε=(´ο｀*)))')
    }

    const res = ability.can(Action.Delete, new Holes(hole))

    if (!res) {
      throw new BadRequestException('你不能随意删除其他人的树洞哦~')
    }

    return res
  }
}
