import { Profile } from './profile';

export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  cost: number;
  profile: Profile;
}
