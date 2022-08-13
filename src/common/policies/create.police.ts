import { Injectable } from '@nestjs/common'
import { AppAbility } from '../../modules/casl/casl.factory'
import { IPolicyHandler } from '../decorators/CheckPolicies.decorator'
import { Action } from '../enums/action.enum'

@Injectable()
class PolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility, payload) {
    return ability.can(Action.Read, payload)
  }
}

export const CreateHolePolicyHandler = new PolicyHandler()
