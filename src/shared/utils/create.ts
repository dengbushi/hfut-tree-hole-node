import Mongoose from 'mongoose'
import { ValidationOptions, registerDecorator } from 'class-validator'
import { IsModeExist } from '../../modules/treehole/dto/mode.dto'

export const createResponse = <T extends object>(msg: string, data: T = {} as T, code = 200) => {
  return {
    data,
    msg,
    code,
  }
}

export const createMongoId = (id: string) => new Mongoose.Types.ObjectId(id as string)

export const createClassValidator = (cls: { new (...args: any[]): any }) => {
  return (validationOptions?: ValidationOptions) => {
    return function(object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName,
        options: validationOptions,
        constraints: [],
        validator: cls,
      })
    }
  }
}
