export type Country = 'Cameroun' | "Côte d'Ivoire" | 'Sénégal' | 'Congo';

export type City = {
  name: string;
  country: Country;
};

export type ServiceCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
};

export type Provider = {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  rating: number;
  reviewCount: number;
  city: string;
  country: Country;
  price: number;
  priceUnit: string;
  phone: string;
  whatsapp: string;
  bio: string;
  photos: string[];
  avatar: string;
  verified: boolean;
  available: boolean;
  experience: number;
  skills: string[];
  createdAt: Date;
};

export type Review = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  providerId: string;
  rating: number;
  comment: string;
  createdAt: Date;
};

export type BookingRequest = {
  id: string;
  userId: string;
  providerId: string;
  providerName: string;
  service: string;
  date: string;
  time: string;
  address: string;
  city: string;
  description: string;
  status: 'en_attente' | 'confirme' | 'annule' | 'termine';
  createdAt: Date;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: Country;
  avatar?: string;
  role: 'client' | 'prestataire';
  createdAt: Date;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
  ProviderListing: { categoryId: string; categoryName: string };
  ProviderProfile: { providerId: string };
  BookingRequest: { provider: Provider };
};
