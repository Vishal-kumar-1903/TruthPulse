import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotificationSubscription extends Document {
  endpoint?: string;
  p256dh?: string;
  auth?: string;
  metroHub: string; // e.g. 'delhi-ncr', 'mumbai-mmr', 'all', or state/city
  categories: string[];
  userAgent?: string;
  active: boolean;
  lastNotifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSubscriptionSchema = new Schema<INotificationSubscription>(
  {
    endpoint: { type: String, trim: true },
    p256dh: { type: String },
    auth: { type: String },
    metroHub: { type: String, default: 'all', trim: true, index: true },
    categories: [{ type: String, default: 'BREAKING' }],
    userAgent: { type: String },
    active: { type: Boolean, default: true, index: true },
    lastNotifiedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

export const NotificationSubscription: Model<INotificationSubscription> =
  mongoose.models.NotificationSubscription ||
  mongoose.model<INotificationSubscription>('NotificationSubscription', NotificationSubscriptionSchema);

export default NotificationSubscription;
