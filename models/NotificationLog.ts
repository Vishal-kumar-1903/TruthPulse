import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotificationLog extends Document {
  title: string;
  body: string;
  metroHub: string;
  category: string;
  articleId?: string;
  reelId?: string;
  targetUrl: string;
  isScheduled: boolean;
  scheduledFor?: Date;
  status: 'SENT' | 'SCHEDULED' | 'PENDING';
  subscribersTargeted: number;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationLogSchema = new Schema<INotificationLog>(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    metroHub: { type: String, default: 'all', trim: true, index: true },
    category: { type: String, default: 'General' },
    articleId: { type: String },
    reelId: { type: String },
    targetUrl: { type: String, default: '/' },
    isScheduled: { type: Boolean, default: false },
    scheduledFor: { type: Date },
    status: {
      type: String,
      enum: ['SENT', 'SCHEDULED', 'PENDING'],
      default: 'SENT',
      index: true
    },
    subscribersTargeted: { type: Number, default: 0 },
    sentAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

export const NotificationLog: Model<INotificationLog> =
  mongoose.models.NotificationLog ||
  mongoose.model<INotificationLog>('NotificationLog', NotificationLogSchema);

export default NotificationLog;
