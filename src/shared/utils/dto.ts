import { ValidationOptions, registerDecorator } from 'class-validator'

export function Validate<T = any>(validate: (val: T) => boolean, validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLongerThan',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: T) {
          return validate(value)
        },
      },
    })
  }
}
