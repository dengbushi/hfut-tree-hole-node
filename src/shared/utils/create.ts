import Mongoose from 'mongoose'

export const createResponse = <T extends object>(msg: string, data: T = {} as T, code = 200) => {
  return {
    data,
    msg,
    code,
  }
}

export const createMongoId = (id: string) => new Mongoose.Types.ObjectId(id as string)
