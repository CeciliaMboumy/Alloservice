export type Country = 'Cameroun' | "Côte d'Ivoire" | 'Sénégal' | 'Congo';

export type City = { name: string; country: Country };

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

export type BookingStatus = 'en_attente' | 'confirme' | 'annule' | 'termine';

export type Booking = {
  id: string;
  providerName: string;
  service: string;
  date: string;
  time: string;
  status: BookingStatus;
  price: string;
};
