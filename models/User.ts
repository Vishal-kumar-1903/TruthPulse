import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVotedArticle {
  articleId: Schema.Types.ObjectId;
  voteType: 'GREEN' | 'RED';
  votedAt: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'READER' | 'CONTRIBUTOR' | 'CHIEF_EDITOR' | 'ADMIN';
  votedArticles: IVotedArticle[];
  truthCredits: number;
  bookmarks: Schema.Types.ObjectId[];
  notifications: Array<{
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
  }>;
  strikes: number;
  accuracyRate: number;
  createdAt: Date;
  updatedAt: Date;
}

const VotedArticleSchema = new Schema<IVotedArticle>({
  articleId: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
  voteType: { type: String, enum: ['GREEN', 'RED'], required: true },
  votedAt: { type: Date, default: Date.now }
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { 
      type: String, 
      enum: ['READER', 'CONTRIBUTOR', 'CHIEF_EDITOR', 'ADMIN'], 
      default: 'READER' 
    },
    votedArticles: [VotedArticleSchema],
    truthCredits: { type: Number, default: 50 },
    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
    notifications: [
      {
        title: { type: String, required: true },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    strikes: { type: Number, default: 0 },
    accuracyRate: { type: Number, default: 95 }
  },
  {
    timestamps: true
  }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
