import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISource {
  name: string;
  url: string;
  stance: 'CORROBORATING' | 'NEUTRAL' | 'CONFLICTING' | 'REFUTING';
  reliability?: number;
  rawSnippet?: string;
}

export type NewsCategory = 
  | 'Business' 
  | 'Politics' 
  | 'Sports' 
  | 'Weather' 
  | 'Entertainment' 
  | 'Health'
  | 'General';

export type NewsRegion = 'National' | 'International';

export type MediaType = 'IMAGE' | 'VIDEO_LOOP' | 'LOTTIE_ANIMATION';

export interface IArticleComment {
  userId: string;
  userName: string;
  userRole?: string;
  text: string;
  evidenceUrl?: string;
  createdAt: Date;
}

export interface IArticle extends Document {
  title: string;
  summary: string;
  bullets: string[];
  content: string;
  category: NewsCategory;
  region: NewsRegion;
  state?: string;
  city?: string;
  location: {
    regionType: 'INTERNATIONAL' | 'NATIONAL' | 'STATE' | 'CITY';
    state?: string;
    city?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  sources: ISource[];
  trustScore: number;
  upvotes: number;     // Green Thumb (Verified / Sahi News)
  downvotes: number;   // Red Thumb (Misleading / Fake News Flag)
  greenVoters: string[]; // User IDs who voted Green
  redVoters: string[];   // User IDs who voted Red
  isVerified: boolean; // Verified badge status
  comments: IArticleComment[];
  discrepancyAlert?: {
    hasConflict: boolean;
    details: string;
    conflictingSources?: Array<{ source: string; claim: string }>;
  };
  contentHash: string;
  status: 'DRAFT' | 'PUBLISHED' | 'UNDER_REVIEW' | 'DEBUNKED';
  views: number;
  isPinned: boolean;
  author: string;
  imageUrl?: string;
  mediaType?: MediaType;
  mediaUrl?: string;
  strapiId?: string;
  civicAction?: {
    isCivic: boolean;
    authorityName: string;
    contactEmail: string;
    department: string;
    grievanceTemplate: string;
    poll: {
      question: string;
      upvotes: number;
      downvotes: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const SourceSchema = new Schema<ISource>({
  name: { type: String, required: true },
  url: { type: String, required: true },
  stance: { 
    type: String, 
    enum: ['CORROBORATING', 'NEUTRAL', 'CONFLICTING', 'REFUTING'], 
    default: 'CORROBORATING' 
  },
  reliability: { type: Number, default: 85 },
  rawSnippet: { type: String }
});

const CommentSchema = new Schema<IArticleComment>({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userRole: { type: String, default: 'READER' },
  text: { type: String, required: true },
  evidenceUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    bullets: [{ type: String, default: [] }],
    content: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['Business', 'Politics', 'Sports', 'Weather', 'Entertainment', 'Health', 'General'],
      required: true, 
      default: 'Politics' 
    },
    region: {
      type: String,
      enum: ['National', 'International'],
      required: true,
      default: 'National'
    },
    state: { type: String, default: '' },
    city: { type: String, default: '' },
    location: {
      regionType: {
        type: String,
        enum: ['INTERNATIONAL', 'NATIONAL', 'STATE', 'CITY'],
        default: 'NATIONAL'
      },
      state: { type: String, default: '' },
      city: { type: String, default: '' },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number }
      }
    },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    greenVoters: [{ type: String }],
    redVoters: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    comments: [CommentSchema],
    sources: [SourceSchema],
    trustScore: { type: Number, required: true, min: 0, max: 100, default: 75 },
    discrepancyAlert: {
      hasConflict: { type: Boolean, default: false },
      details: { type: String, default: '' },
      conflictingSources: [
        {
          source: String,
          claim: String
        }
      ]
    },
    contentHash: { type: String, required: true },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'UNDER_REVIEW', 'DEBUNKED'],
      default: 'PUBLISHED'
    },
    views: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
    author: { type: String, default: 'TruthPulse Editorial Desk' },
    imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200' },
    mediaType: {
      type: String,
      enum: ['IMAGE', 'VIDEO_LOOP', 'LOTTIE_ANIMATION'],
      default: 'IMAGE'
    },
    mediaUrl: { type: String },
    strapiId: { type: String, index: true, sparse: true },
    civicAction: {
      isCivic: { type: Boolean, default: false },
      authorityName: { type: String, default: '' },
      contactEmail: { type: String, default: '' },
      department: { type: String, default: '' },
      grievanceTemplate: { type: String, default: '' },
      poll: {
        question: { type: String, default: 'Is this issue affecting your area?' },
        upvotes: { type: Number, default: 0 },
        downvotes: { type: Number, default: 0 }
      }
    }
  },
  {
    timestamps: true
  }
);

export const Article: Model<IArticle> = mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);
export default Article;
