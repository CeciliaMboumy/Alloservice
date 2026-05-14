# AlloService — Structure Firebase Firestore

## Collections

### `users/{userId}`
```json
{
  "id": "string (UID Firebase Auth)",
  "name": "string",
  "email": "string",
  "phone": "string",
  "city": "string",
  "country": "Cameroun | Côte d'Ivoire | Sénégal | Congo",
  "avatar": "string (URL Storage)",
  "role": "client | prestataire",
  "createdAt": "Timestamp"
}
```

### `providers/{providerId}`
```json
{
  "id": "string",
  "userId": "string (ref users)",
  "name": "string",
  "category": "string",
  "categoryId": "string",
  "rating": "number",
  "reviewCount": "number",
  "city": "string",
  "country": "string",
  "price": "number",
  "priceUnit": "string",
  "phone": "string",
  "whatsapp": "string",
  "bio": "string",
  "photos": ["string (URL Storage)"],
  "avatar": "string (URL Storage)",
  "verified": "boolean",
  "available": "boolean",
  "experience": "number",
  "skills": ["string"],
  "createdAt": "Timestamp"
}
```

### `bookings/{bookingId}`
```json
{
  "id": "string",
  "userId": "string (ref users)",
  "providerId": "string (ref providers)",
  "providerName": "string",
  "service": "string",
  "date": "string",
  "time": "string",
  "address": "string",
  "city": "string",
  "description": "string",
  "status": "en_attente | confirme | annule | termine",
  "createdAt": "Timestamp"
}
```

### `reviews/{reviewId}`
```json
{
  "id": "string",
  "userId": "string (ref users)",
  "userName": "string",
  "userAvatar": "string (URL Storage)",
  "providerId": "string (ref providers)",
  "bookingId": "string (ref bookings)",
  "rating": "number (1-5)",
  "comment": "string",
  "createdAt": "Timestamp"
}
```

## Firebase Auth
- Email/Password authentication
- Profile display name set on signup

## Firebase Storage Buckets
- `avatars/{userId}` — user profile photos
- `providers/{providerId}/photos/` — provider work photos

## Firestore Security Rules (à configurer)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /providers/{providerId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /bookings/{bookingId} {
      allow read: if request.auth != null &&
        (request.auth.uid == resource.data.userId ||
         request.auth.uid == resource.data.providerId);
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
  }
}
```
