import { BadRequestException, Injectable } from '@nestjs/common'
import { AppAbility } from '../../modules/casl/casl.factory'
import { IPolicyHandler } from '../decorators/CheckPolicies.decorator'
import { Action } from '../enums/action.enum'

@Injectable()
class PolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility, payload) {
    const res = ability.can(Action.Update, payload)

    if (!res) {
      throw new BadRequestException('你不能随意修改其他人的树洞哦~')
    }

    return res
  }
}

export const UpdateHolePolicyHandler = new PolicyHandler()
