export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

export function isValidDate(dateStr: string): boolean {
  // accepts DD/MM/YYYY
  const parts = dateStr.split('/');
  if (parts.length !== 3) return false;
  const [dd, mm, yyyy] = parts.map(Number);
  if (!dd || !mm || !yyyy) return false;
  const date = new Date(yyyy, mm - 1, dd);
  return (
    date.getFullYear() === yyyy &&
    date.getMonth() === mm - 1 &&
    date.getDate() === dd &&
    date >= new Date()
  );
}

export function validateBookingForm(fields: {
  date: string;
  time: string;
  address: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!fields.date) errors.date = 'Veuillez indiquer une date';
  else if (!isValidDate(fields.date)) errors.date = 'Date invalide ou passée (JJ/MM/AAAA)';
  if (!fields.time) errors.time = 'Veuillez choisir un horaire';
  if (!fields.address.trim()) errors.address = 'Veuillez indiquer votre adresse';
  return errors;
}

export function validateAuthForm(fields: {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  confirmPassword?: string;
  mode: 'login' | 'signup';
}): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!fields.email) errors.email = 'Email requis';
  else if (!isValidEmail(fields.email)) errors.email = 'Email invalide';
  if (!fields.password) errors.password = 'Mot de passe requis';
  else if (fields.password.length < 6) errors.password = 'Minimum 6 caractères';
  if (fields.mode === 'signup') {
    if (!fields.name?.trim()) errors.name = 'Nom complet requis';
    if (!fields.phone) errors.phone = 'Numéro de téléphone requis';
    else if (!isValidPhone(fields.phone)) errors.phone = 'Numéro invalide';
    if (fields.password !== fields.confirmPassword)
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }
  return errors;
}
