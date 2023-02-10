import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { TreeholeMode } from '@/schema/treehole/treeholeMode.schema'
import { createClassValidator } from '@/shared/utils/create'

@ValidatorConstraint({ async: true })
@Injectable()
export class IsModeExist implements ValidatorConstraintInterface {
  constructor(
    @InjectModel(TreeholeMode.name)
    private readonly treeholeModeModel: Model<TreeholeMode>
  ) {}

  async validate(mode: any, args: ValidationArguments) {
    const res = (await this.treeholeModeModel.findOne()).modes

    return !!res.map((item) => item.value).includes(mode)
  }
}

export const IsTreeholeMode = createClassValidator(IsModeExist)
