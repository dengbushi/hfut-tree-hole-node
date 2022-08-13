import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Request } from 'express'
import { AppAbility } from '../../casl/casl.factory'
import { IPolicyHandler } from '../../../common/decorators/CheckPolicies.decorator'
import { Action } from '../../../common/enums/action.enum'
import { Holes } from '../../../schema/treehole/holes.schema'
import { PoliciesModel } from '../../../common/guards/policies.guard'

export class DeleteHolePolicyHandler implements IPolicyHandler {
  async handle(
    ability: AppAbility,
    req: Request,
    models: PoliciesModel,
  ) {
    const hole = await models.holes.findById(req.body.id)

    if (!hole) {
      throw new NotFoundException('没有找到这个树洞哎ε=(´ο｀*)))')
    }

    const res = ability.can(Action.Delete, new Holes(hole))

    if (!res) {
      throw new BadRequestException('你不能删除别人的树洞哦~')
    }

    return res
  }
}
