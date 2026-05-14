import { Country } from '../types';

export function formatPrice(amount: number, currency = 'FCFA'): string {
  return `${amount.toLocaleString('fr-FR')} ${currency}`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  const diffW = Math.floor(diffD / 7);

  if (diffMin < 1) return 'À l\'instant';
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffH < 24) return `Il y a ${diffH}h`;
  if (diffD < 7) return `Il y a ${diffD} jour${diffD > 1 ? 's' : ''}`;
  if (diffW < 4) return `Il y a ${diffW} semaine${diffW > 1 ? 's' : ''}`;
  return formatDate(date);
}

export function formatPhoneNumber(phone: string, country: Country): string {
  const digits = phone.replace(/\D/g, '');
  switch (country) {
    case 'Cameroun':
      return digits.startsWith('237') ? `+${digits}` : `+237 ${digits}`;
    case "Côte d'Ivoire":
      return digits.startsWith('225') ? `+${digits}` : `+225 ${digits}`;
    case 'Sénégal':
      return digits.startsWith('221') ? `+${digits}` : `+221 ${digits}`;
    case 'Congo':
      return digits.startsWith('242') ? `+${digits}` : `+242 ${digits}`;
    default:
      return phone;
  }
}

export function formatExperience(years: number): string {
  if (years < 1) return 'Moins d\'un an';
  if (years === 1) return '1 an d\'expérience';
  return `${years} ans d'expérience`;
}

export function formatReviewCount(count: number): string {
  if (count === 0) return 'Aucun avis';
  if (count === 1) return '1 avis';
  if (count < 1000) return `${count} avis`;
  return `${(count / 1000).toFixed(1)}k avis`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function buildAvatarUrl(name: string, bg = '1B6B3A', color = 'fff'): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=${color}&size=200&bold=true`;
}
