import { BadRequestException, Injectable } from '@nestjs/common'
import { AppAbility } from '../../casl/casl.factory'
import { IPolicyHandler } from '../../../common/decorators/CheckPolicies.decorator'
import { Action } from '../../../common/enums/action.enum'

@Injectable()
export class UpdateHolePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility, payload) {
    const res = ability.can(Action.Update, payload)

    if (!res) {
      throw new BadRequestException('你不能随意修改其他人的树洞哦~')
    }

    return res
  }
}
