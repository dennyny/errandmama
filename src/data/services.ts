import { ServiceTier } from '../types';

export const serviceTiers: ServiceTier[] = [
  {
    id: 'sharp-sharp',
    name: 'Sharp Sharp Service',
    price: 50000,
    timeline: 'Completed within 2 days',
    description: 'Urgent errands that need immediate attention',
    examples: [
      'Emergency shopping',
      'Document pickup/delivery',
      'Urgent appointments',
      'Same-day deliveries'
    ],
    icon: 'zap'
  },
  {
    id: 'market-runs',
    name: 'Market Runs Service',
    price: 30000,
    timeline: 'Completed within 3-7 days',
    description: 'Regular shopping and market errands',
    examples: [
      'Grocery shopping',
      'Market runs',
      'Bulk purchases',
      'Gift shopping'
    ],
    icon: 'shopping-basket'
  },
  {
    id: 'others',
    name: 'Others Service',
    price: 20000,
    timeline: 'Completed within 7+ days',
    description: 'General errands and tasks',
    examples: [
      'Research tasks',
      'Non-urgent deliveries',
      'Appointment bookings',
      'General assistance'
    ],
    icon: 'list-checks'
  }
];