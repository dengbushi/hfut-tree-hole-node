import { SetMetadata } from '@nestjs/common'
import { Request } from 'express'
import { AppAbility } from '../../modules/casl/casl.factory'

export interface IPolicyHandler {
  handle: (ability: AppAbility, req: Request) => boolean | Promise<boolean>
}

type PolicyHandlerCallback = IPolicyHandler['handle']

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback

export const CHECK_POLICIES_KEY = 'check_policy'
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers)
