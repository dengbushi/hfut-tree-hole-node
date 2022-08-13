import { CanActivate, ExecutionContext, Inject, Injectable, UseGuards } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CHECK_POLICIES_KEY, PolicyHandler } from '../decorators/CheckPolicies.decorator'
import { AppAbility, CaslAbilityFactory } from '../../modules/casl/casl.factory'
import { TreeholeDaoService } from '../../dao/treehole/treehole-dao.service'
import { Holes, HolesDocument } from '../../schema/treehole/holes.schema'

@Injectable()
export class PoliciesGuard implements CanActivate {
  @Inject()
  private readonly treeholeDaoService: TreeholeDaoService

  @InjectModel(Holes.name)
  private readonly holesModel: Model<HolesDocument>

  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers
      = this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || []

    const req = context.switchToHttp().getRequest() as Request
    const ability = await this.caslAbilityFactory.createForUser(req.user)

    return policyHandlers.every(async(handler) => {
      return await this.execPolicyHandler(handler, ability, req)
    })
  }

  private async execPolicyHandler(handler: PolicyHandler, ability: AppAbility, req: Request) {
    if (typeof handler === 'function') {
      return handler(ability, req)
    }

    return handler.handle(ability, req)
  }
}

export const Police = () => UseGuards(PoliciesGuard)
