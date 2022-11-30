import { ForbiddenException } from '@nestjs/common'
import { PoliceHandlerCallback } from '@/common/decorators/CheckPolicies.decorator'
import { Action } from '@/common/enums/action.enum'
import { Holes } from '@/schema/treehole/holes.schema'

export const UpdateHolePolicyHandler: PoliceHandlerCallback = async(
  ability,
  req,
  guard,
) => {
  const hole = await guard.treeholeDaoService.findById(req.body.id)

  const canUpdated = ability.can(Action.Update, new Holes(hole))

  if (!canUpdated) {
    throw new ForbiddenException('你不能修改别人的树洞哦~')
  }

  return canUpdated
}
