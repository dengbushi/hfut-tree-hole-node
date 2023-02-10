import Mongoose from 'mongoose'

interface Base {
  _id: string
  content: string
  stars: number
  imgs: any[]
  createTime: string
  user: User
  comments_user: CommentsUser[]
  starUserIds: number[]
  isStar: boolean
}

export interface ITreeholeDetailPipeLineStage extends Base {
  comments: Comment[]
  isYourHole: boolean
}

export interface ITreeholeListPipeLineStage extends Base {
  comments: {
    data: Comment[]
    length: number
  }
}

interface Comment {
  _id: Mongoose.Types.ObjectId
  parentId?: Mongoose.Types.ObjectId
  userId: number
  user?: { username?: string }
  content: string
  createTime: string
  isYourComment: boolean
  replyTo?: null | Mongoose.Types.ObjectId
  replies?: (Omit<Comment, 'replies' | 'userId' | '_id'> & {
    members?: Comment['user'][]
  })[]
}

interface User {
  username: string
  studentId: number
  role?: string
}

interface CommentsUser {
  _id: string
  studentId: number
  username: string
  password: string
  holeIds: any[]
  role: string
  __v: number
}
