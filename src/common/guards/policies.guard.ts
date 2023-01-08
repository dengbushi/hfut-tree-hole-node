import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UseGuards,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  CHECK_POLICIES_KEY,
  PoliceHandler,
} from '@/common/decorators/CheckPolicies.decorator'
import { AppAbility, CaslAbilityFactory } from '@/modules/casl/casl.factory'
import { TreeholeDaoService } from '@/dao/treehole/treehole-dao.service'
import { Holes, HolesDocument } from '@/schema/treehole/holes.schema'

export interface PoliciesModel {
  holes: Model<HolesDocument>
}

@Injectable()
export class PoliciesGuard implements CanActivate {
  @Inject()
  public readonly treeholeDaoService: TreeholeDaoService

  @InjectModel(Holes.name)
  public readonly holesModel: Model<HolesDocument>

  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PoliceHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler()
      ) || []

    const req = context.switchToHttp().getRequest() as Request
    const ability = await this.caslAbilityFactory.createForUser(req.user)

    return policyHandlers.every(async (handler) => {
      // eslint-disable-next-line no-useless-catch
      try {
        return await this.execPolicyHandler(handler, ability, req, this)
      } catch (err) {
        return false
      }
    })
  }

  private async execPolicyHandler(
    handler: PoliceHandler,
    ability: AppAbility,
    req: Request,
    models: PoliciesGuard
  ) {
    let fn

    if (typeof handler === 'function') {
      fn = handler
    } else {
      fn = handler.handle
    }

    return fn(ability, req, models)
  }
}

export const Police = () => UseGuards(PoliciesGuard)
