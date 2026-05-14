# AlloService 🌍

**AlloService** est une application mobile React Native / Expo qui connecte les habitants d'Afrique francophone (Cameroun, Côte d'Ivoire, Sénégal, Congo) avec des prestataires de services locaux.

---

## Services disponibles

| Catégorie | Description |
|-----------|-------------|
| 🧹 Ménage | Nettoyage et entretien de domicile |
| 🔧 Plomberie | Réparation et installation |
| ⚡ Électricité | Travaux électriques et dépannage |
| 💇 Coiffure | Tressage, coiffure, soins capillaires |
| 💄 Maquillage | Maquillage professionnel |
| 🚗 Chauffeur | Transport privé |
| 🔨 Bricolage | Petits travaux et réparations |
| 🏠 Aide à domicile | Aide aux personnes et garde d'enfants |

---

## Stack technique

- **React Native** + **Expo** (~51)
- **Firebase** (Auth + Firestore + Storage)
- **React Navigation** (Stack + Bottom Tabs)
- **Expo Linear Gradient**
- **@expo/vector-icons** (Ionicons)

---

## Écrans implémentés

1. **Onboarding** — 4 slides animées de présentation
2. **Auth** — Connexion / Inscription avec sélection du rôle (client / prestataire)
3. **Accueil** — Catégories de services, prestataires vedettes, bannière promo, sélection de ville
4. **Liste prestataires** — Filtres, tri, recherche
5. **Profil prestataire** — Photos, note, tarif, localisation, bouton WhatsApp, avis
6. **Réservation** — Sélection date/heure, adresse, description, récapitulatif
7. **Dashboard client** — Réservations, statuts, compte
8. **Dashboard prestataire** — Demandes, gains, profil

---

## Installation

```bash
# Cloner le projet
git clone <repo>
cd alloservice

# Installer les dépendances
npm install

# Copier la configuration Firebase
cp .env.example .env
# Remplir les valeurs Firebase dans .env

# Démarrer
npx expo start
```

---

## Configuration Firebase

1. Créer un projet sur [Firebase Console](https://console.firebase.google.com)
2. Activer **Authentication** → Email/Password
3. Créer une base **Firestore** en mode production
4. Activer **Storage**
5. Copier les clés dans `.env`

Voir `src/config/firebaseSchema.md` pour la structure complète des collections.

---

## Structure du projet

```
src/
├── config/          # Firebase config + schéma
├── constants/       # Thème, couleurs, données mock
├── context/         # AuthContext
├── navigation/      # Stack + Tab navigators
├── screens/
│   ├── Auth/
│   ├── Booking/
│   ├── Dashboard/
│   ├── Home/
│   ├── Onboarding/
│   └── Providers/
├── components/
│   ├── cards/       # ProviderCard, ServiceCategoryCard
│   └── common/      # Button, Input, Badge, StarRating, Header
└── types/           # TypeScript types
```

---

## Pays cibles

🇨🇲 Cameroun · 🇨🇮 Côte d'Ivoire · 🇸🇳 Sénégal · 🇨🇬 Congo