import { CanActivate, ExecutionContext, Inject, Injectable, NotFoundException, UseGuards } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { CHECK_POLICIES_KEY, PolicyHandler } from '../decorators/CheckPolicies.decorator'
import { AppAbility, CaslAbilityFactory } from '../../modules/casl/casl.factory'
import { TreeholeDaoService } from '../../dao/treehole/treehole-dao.service'
import { Holes } from '../../schema/treehole/holes.schema'

@Injectable()
export class PoliciesGuard implements CanActivate {
  @Inject()
  private readonly treeholeDaoService: TreeholeDaoService

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

    const { user, body } = context.switchToHttp().getRequest() as Request
    const ability = await this.caslAbilityFactory.createForUser(user)

    let payload

    if (body.id) {
      const holeId = body.id as string
      const hole = await this.treeholeDaoService.findById(holeId)

      if (!hole) {
        throw new NotFoundException('树洞不存在哎ε=(´ο｀*)))')
      }

      payload = new Holes({ userId: hole.userId })
    } else {
      payload = new Holes({ userId: user.studentId })
    }

    return policyHandlers.every(handler =>
      this.execPolicyHandler(handler, ability, payload),
    )
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility, payload: any) {
    if (typeof handler === 'function') {
      return handler(ability, payload)
    }

    return handler.handle(ability, payload)
  }
}

export const Police = () => UseGuards(PoliciesGuard)
