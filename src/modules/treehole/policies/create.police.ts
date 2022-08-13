import { Injectable } from '@nestjs/common'
import { AppAbility } from '../../casl/casl.factory'
import { IPolicyHandler } from '../../../common/decorators/CheckPolicies.decorator'
import { Action } from '../../../common/enums/action.enum'

@Injectable()
export class CreateHolePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility, payload) {
    return ability.can(Action.Read, payload)
  }
}
