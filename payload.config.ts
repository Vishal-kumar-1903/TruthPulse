/**
 * TruthPulse Payload CMS v3 Configuration
 * Native MongoDB Database Adapter Integration
 * https://payloadcms.com/docs/configuration/overview
 */

export interface PayloadCollectionConfig {
  slug: string;
  admin: {
    useAsTitle: string;
    defaultColumns?: string[];
  };
  fields: Array<{
    name: string;
    type: 'text' | 'textarea' | 'richText' | 'select' | 'number' | 'array' | 'upload' | 'relationship' | 'date';
    required?: boolean;
    options?: string[];
  }>;
}

export const ArticlesCollection: PayloadCollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'scheduledPublishAt', 'trustScore', 'createdAt']
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'content', type: 'richText' },
    { name: 'bullets', type: 'array' },
    { 
      name: 'category', 
      type: 'select', 
      options: ['Politics', 'Business', 'Sports', 'Weather', 'Entertainment', 'Health'],
      required: true 
    },
    { 
      name: 'contentType', 
      type: 'select', 
      options: ['NEWS', 'ARTICLE', 'REEL'],
      required: true 
    },
    { name: 'author', type: 'text' },
    { name: 'trustScore', type: 'number' },
    { 
      name: 'status', 
      type: 'select', 
      options: ['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'],
      required: true 
    },
    { name: 'scheduledPublishAt', type: 'date' },
    { name: 'isScheduled', type: 'select', options: ['true', 'false'] },
    { name: 'imageUrl', type: 'text' },
    { name: 'mediaUrl', type: 'text' }
  ]
};

export const ReelsCollection: PayloadCollectionConfig = {
  slug: 'reels',
  admin: {
    useAsTitle: 'headline',
    defaultColumns: ['headline', 'badge', 'status', 'scheduledPublishAt', 'location', 'trustScore', 'createdAt']
  },
  fields: [
    { name: 'headline', type: 'text', required: true },
    { name: 'snippet', type: 'textarea', required: true },
    { 
      name: 'badge', 
      type: 'select', 
      options: ['BREAKING', 'ALERT', 'FACT-CHECK'],
      required: true 
    },
    { 
      name: 'status', 
      type: 'select', 
      options: ['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'],
      required: true 
    },
    { name: 'scheduledPublishAt', type: 'date' },
    { name: 'isScheduled', type: 'select', options: ['true', 'false'] },
    { name: 'location', type: 'text' },
    { name: 'category', type: 'select', options: ['Politics', 'Business', 'Sports', 'Weather', 'Entertainment', 'Health'] },
    { name: 'mediaUrl', type: 'text' },
    { name: 'imageUrl', type: 'text' },
    { name: 'trustScore', type: 'number' }
  ]
};

export const UsersCollection: PayloadCollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'truthCredits']
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'text', required: true },
    { name: 'role', type: 'select', options: ['ADMIN', 'CHIEF_EDITOR', 'EDITOR', 'CITIZEN'] },
    { name: 'truthCredits', type: 'number' }
  ]
};

export const payloadConfig = {
  databaseUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/truthpulse',
  databaseAdapter: '@payloadcms/db-mongodb',
  collections: [ArticlesCollection, ReelsCollection, UsersCollection],
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- TruthPulse CMS',
      favicon: '/favicon.ico'
    }
  }
};

export default payloadConfig;
