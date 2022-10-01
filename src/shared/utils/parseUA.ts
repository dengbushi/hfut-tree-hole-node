import { Request } from 'express'
import { isString } from 'class-validator'
import UAParser from 'ua-parser-js'

export const parseUA = (payload: Request['headers'] | string) => new UAParser(isString(payload) ? payload : payload['user-agent'])
