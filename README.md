# AI Diet Coach - Personalized Meal Planning App

A full-stack AI-powered diet planner that creates personalized 4-week shredding meal plans based on your health profile, measurements, and available foods.

## 🚀 Features

- **Health Report Upload**: Upload PDF, Markdown, or text files containing your health information
- **Body Measurements**: Input current measurements and fitness goals
- **Food Availability**: Specify foods available in your location
- **AI Meal Planning**: Uses OpenAI GPT-4o to generate personalized 4-week meal plans
- **Meal Tracking**: Track completed meals with progress visualization
- **Progress Dashboard**: View charts and statistics of your progress
- **Firebase Integration**: Secure data storage and authentication
- **Responsive Design**: Beautiful UI that works on all devices

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Firebase Functions (Node.js)
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth (Google Sign-in)
- **AI**: OpenAI GPT-4o API
- **Charts**: Recharts
- **File Upload**: react-dropzone
- **PDF Processing**: PDF.js

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **Firebase CLI** (`npm install -g firebase-tools`)
3. **Firebase Project** with the following enabled:
   - Authentication (Google provider)
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
2. Enable Authentication with Google provider
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

1. **Sign In**: Use Google authentication to sign in
2. **Upload Health Report** (optional): Upload your medical reports or health assessments
3. **Enter Measurements**: Input your current body measurements and goals
4. **Add Available Foods**: Specify foods easily available in your location
5. **Generate Plan**: Click "Generate My Diet Plan" to create your personalized meal plan
6. **Track Progress**: Use the dashboard to track completed meals and view progress
7. **Refresh Plan**: After 4 weeks, upload new measurements and generate a fresh plan

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