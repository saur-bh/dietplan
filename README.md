# Genetic Diet Coach – Personalized Nutrition & Fitness App

A full-stack genetic and LLM-powered diet planner that creates personalized meal plans based on your genetic report, measurements, food preferences, and available foods. The system leverages LLMs (like GPT-4o) to interpret genetic data, user-uploaded reports, typed or spoken preferences, and geo-location to generate actionable, science-backed nutrition and fitness guidance.

## 🚀 Features

- **Genetic Report Upload**: Upload your DNA/genetic report (PDF, Markdown, or text). If text extraction fails, the PDF is sent directly to the LLM for analysis.
- **Flexible Input**: Type or speak your food preferences, eating habits, and goals. The LLM prompt incorporates all user-provided context, including geo-location.
- **Food Database**: Add foods you have access to; all food items are saved in Firestore and visible for future planning.
- **Profile & Measurements**: Enter and update your body measurements and personal profile; all data is stored in Firestore for history and future use.
- **Photo Upload**: Upload your photo (for progress or analysis); images are stored in Firebase Storage and included in the LLM prompt for diet generation.
- **Personalized Meal Planning**: LLM generates meal plans using your genetic data, preferences, available foods, and location.
- **Meal Tracking & Dashboard**: Track meals, visualize progress, and see all your data in one place.
- **Secure Cloud Storage**: All sensitive data is securely stored in Firebase (Firestore & Storage).
- **Responsive Design**: Works beautifully on all devices.

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Firebase Functions (Node.js)
- **Database**: Firebase Firestore (stores user profile, measurements, food items, preferences)
- **Storage**: Firebase Storage (stores user-uploaded photos and reports)
- **Authentication**: Firebase Auth (Email/Password & Phone OTP)
- **AI/LLM**: OpenAI GPT-4o API (for prompt-based meal plan generation)
- **Charts**: Recharts
- **File Upload**: react-dropzone, voice-to-text for spoken input
- **PDF Processing**: PDF.js (with fallback to LLM for unextractable PDFs)

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **Firebase CLI** (`npm install -g firebase-tools`)
3. **Firebase Project** with the following enabled:
   - Authentication (Email/Password and Phone)
   - Firestore Database
   - Firebase Storage
   - Firebase Functions
   - Firebase Hosting
4. **OpenAI API Key**

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install Firebase Functions dependencies
cd functions
npm install
cd ..
```

### 2. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Email/Password and Phone (SMS) providers
3. Create Firestore database in test mode
4. Enable Firebase Storage
5. Get your Firebase config from Project Settings

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# OpenAI API Configuration
VITE_OPENAI_API_KEY=your_openai_api_key
```

### 4. Firebase Functions Configuration

Set the OpenAI API key for Firebase Functions:

```bash
firebase functions:config:set openai.key="your_openai_api_key"
```

### 5. Deploy Firebase Configuration

```bash
# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Deploy Firestore rules and indexes
firebase deploy --only firestore:rules,firestore:indexes

# Deploy Storage rules
firebase deploy --only storage

# Build and deploy Functions
cd functions
npm run build
cd ..
firebase deploy --only functions
```

### 6. Run Locally

```bash
# Start development server
npm run dev

# Optional: Run Firebase emulators for local testing
firebase emulators:start
```

## 🚀 Deployment

### Deploy to Firebase Hosting

```bash
# Build the project
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Deploy to Vercel (Alternative)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

## 🎯 How to Use


### Typical User Flow

1. **Sign In**: Use your email/password or phone number (OTP) to sign in
2. **Upload Genetic/Health Report**: Upload your DNA/health report (PDF, Markdown, or text). If text can't be extracted, the PDF is sent to the LLM.
3. **Enter/Update Measurements & Profile**: Input your body measurements, preferences, and goals (typed or spoken). All data is saved in Firestore.
4. **Add Food Items**: Add foods you have access to; all items are saved and visible for future planning.
5. **Upload Photo**: Upload a photo for progress tracking or analysis (stored in Firebase Storage and sent to LLM if needed).
6. **Generate Plan**: The LLM receives your genetic data, measurements, food list, preferences, photo, and geo-location to create a personalized meal plan.
7. **Track & Visualize**: Track meals, view all available foods, see your measurement history, and visualize progress in the dashboard.

## 📊 API Usage

The app uses OpenAI's GPT-4o model to generate meal plans. The AI considers:

- Your health report (if provided)
- Body measurements and goals
- Available foods in your location
- Nutritional requirements for fat loss
- European food availability

## 🔒 Security Features

- Firebase Authentication for secure user access
- Firestore security rules to protect user data
- Client-side API key management
- Secure file upload to Firebase Storage

## 🐛 Troubleshooting

### Common Issues

1. **OpenAI API Errors**: Check your API key and billing status
2. **Firebase Errors**: Ensure all Firebase services are enabled
3. **PDF Upload Issues**: Large files may timeout - try smaller files
4. **Authentication Issues**: Check Firebase Auth configuration

### Debugging

- Check browser console for client-side errors
- Check Firebase Functions logs: `firebase functions:log`
- Use Firebase emulators for local testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

For support, create an issue in the GitHub repository or contact the development team.