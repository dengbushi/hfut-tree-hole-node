import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability'
import { Inject, Injectable } from '@nestjs/common'
import { Action } from '../../common/enums/action.enum'
import { IUser } from '../../env'
import { Holes } from '../../schema/treehole/holes.schema'
import { RoleService } from '../role/role.service'

type Subjects = InferSubjects<typeof Holes> | 'all'

export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
  @Inject()
  private readonly roleService: RoleService

  async createForUser(user: IUser) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
      >(Ability as AbilityClass<AppAbility>)

    if (await this.roleService.isAdmin(user.studentId)) {
      can(Action.Manage, 'all') // read-write access to everything
    } else {
      can(Action.Read, 'all') // read-only access to everything
    }

    can(Action.Read, Holes)
    can(Action.Create, Holes)
    can(Action.Update, Holes, { userId: user.studentId })
    can(Action.Delete, Holes, { userId: user.studentId })

    const isBanned = await this.roleService.isBanned(user.studentId)

    if (isBanned) {
      cannot(Action.Create, Holes)
      cannot(Action.Update, Holes)
      cannot(Action.Delete, Holes)
    }

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: item =>
        item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}
