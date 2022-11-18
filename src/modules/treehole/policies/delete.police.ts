import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Action } from '@/common/enums/action.enum'
import { Holes } from '@/schema/treehole/holes.schema'
import { PoliceHandlerCallback } from '@/common/decorators/CheckPolicies.decorator'

export const DeleteHolePolicyHandler: PoliceHandlerCallback = async(
  ability,
  req,
  guard,
) => {
  const hole = await guard.treeholeDaoService.findById(req.body.id)

  if (!hole) {
    throw new NotFoundException('没有找到这个树洞哎ε=(´ο｀*)))')
  }

  const res = ability.can(Action.Delete, new Holes(hole))

  if (!res) {
    throw new BadRequestException('你不能删除别人的树洞哦~')
  }

  return res
}
