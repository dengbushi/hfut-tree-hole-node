import { InternalServerErrorException } from '@nestjs/common'

export const handleDBError = async <T>(
  handler: () => T,
  msg: string,
  error = InternalServerErrorException,
): Promise<T> => {
  try {
    return await handler()
  } catch (err) {
    throw new error(msg)
  }
}
