import { SetMetadata } from '@nestjs/common'
import { Request } from 'express'
import { AppAbility } from '@/modules/casl/casl.factory'
import { PoliciesGuard } from '@/common/guards/policies.guard'

export type PoliceHandlerCallback = (ability: AppAbility, request: Request, guard: PoliciesGuard) => boolean | Promise<boolean>

export interface IPolicyHandler {
  handle: PoliceHandlerCallback
}

export type PoliceHandler = IPolicyHandler | PoliceHandlerCallback

export const CHECK_POLICIES_KEY = 'check_policy'
export const CheckPolicies = (...handlers: PoliceHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers)
