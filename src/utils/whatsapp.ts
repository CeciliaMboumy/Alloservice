import { Linking, Alert } from 'react-native';

export function buildWhatsAppUrl(phone: string, message?: string): string {
  const number = phone.replace(/\D/g, '').replace(/^0/, '');
  const encodedMsg = message ? encodeURIComponent(message) : '';
  return `whatsapp://send?phone=${number}${encodedMsg ? `&text=${encodedMsg}` : ''}`;
}

export async function openWhatsApp(phone: string, providerName: string): Promise<void> {
  const message = `Bonjour ${providerName}, j'ai trouvé votre profil sur AlloService et je souhaite faire appel à vos services. Pouvez-vous me donner plus d'informations ?`;
  const url = buildWhatsAppUrl(phone, message);

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        'WhatsApp non disponible',
        'Veuillez installer WhatsApp pour contacter ce prestataire directement.',
        [{ text: 'OK' }],
      );
    }
  } catch {
    Alert.alert('Erreur', 'Impossible d\'ouvrir WhatsApp. Vérifiez votre installation.');
  }
}

export async function callPhone(phone: string): Promise<void> {
  const url = `tel:${phone.replace(/\s/g, '')}`;
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Erreur', 'Impossible de passer cet appel.');
  }
}
