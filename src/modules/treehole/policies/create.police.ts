import { ForbiddenException } from '@nestjs/common'
import { PoliceHandlerCallback } from '@/common/decorators/CheckPolicies.decorator'
import { Action } from '@/common/enums/action.enum'
import { Holes } from '@/schema/treehole/holes.schema'

export const CreateHolePolicyHandler: PoliceHandlerCallback = async(
  ability,
  req,
  guard,
) => {
  const hole = await guard.treeholeDaoService.findById(req.body.id)

  const canCreated = ability.can(Action.Create, new Holes(hole))

  if (!canCreated) {
    throw new ForbiddenException('你不能创建树洞哦~')
  }

  return canCreated
}
