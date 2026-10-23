import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdminUser extends Document {
  name: string;
  email: string;
  role: 'ROOKIE' | 'CONTRIBUTOR' | 'CHIEF_EDITOR';
  truthCredits: number;
  accuracyRate: number;
  strikes: number;
  isSuspended: boolean;
  history: Array<{
    action: string;
    creditChange: number;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ['ROOKIE', 'CONTRIBUTOR', 'CHIEF_EDITOR'],
      default: 'ROOKIE'
    },
    truthCredits: { type: Number, default: 100 },
    accuracyRate: { type: Number, default: 94 },
    strikes: { type: Number, default: 0 },
    isSuspended: { type: Boolean, default: false },
    history: [
      {
        action: { type: String, required: true },
        creditChange: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const AdminUser: Model<IAdminUser> =
  mongoose.models.AdminUser || mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);

export default AdminUser;
