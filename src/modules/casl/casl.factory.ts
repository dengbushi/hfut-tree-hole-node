import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability'
import { Inject, Injectable } from '@nestjs/common'
import { RoleService } from '../role/role.service'
import { Action } from '@/common/enums/action.enum'
import { IUser } from '@/env'
import { Comment, Holes } from '@/schema/treehole/holes.schema'

type Subjects = InferSubjects<typeof Holes | typeof Comment> | 'all'

export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
  @Inject()
  private readonly roleService: RoleService

  async createForUser(user: IUser) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
      >(Ability as AbilityClass<AppAbility>)

    const isAdmin = await this.roleService.isAdmin(user.studentId)
    const isBanned = await this.roleService.isBanned(user.studentId)

    if (isAdmin) {
      can(Action.Manage, 'all')
    } else {
      can(Action.Read, 'all')
    }

    can(Action.Read, Holes)
    can(Action.Create, Holes)
    can(Action.Update, Holes, { userId: user.studentId })
    can(Action.Delete, Holes, { userId: user.studentId })

    can(Action.Delete, Comment, { userId: user.studentId })
    can(Action.Create, Comment)

    if (isBanned) {
      cannot(Action.Manage, 'all')
    }

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: item =>
        item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}
