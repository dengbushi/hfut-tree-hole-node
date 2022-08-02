import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability'
import { Injectable } from '@nestjs/common'
import { Users as User } from '../../schema/user/user.schema'

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Comment = 'comment',
  Update = 'update',
  Delete = 'delete',
}
type Subjects = InferSubjects<typeof User> | 'all'

export type AppAbility = Ability<[Action, Subjects]>

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
      >(Ability as AbilityClass<AppAbility>)

    if (user.role === 'notch') {
      can(Action.Manage, 'all')
    }

    if (user.role === 'steve') {
      can(Action.Read, 'all')
    }

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: item =>
        item.constructor as ExtractSubjectType<Subjects>,
    })
  }
}
