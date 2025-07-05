# Memory Lane - React Native App

A beautiful and modern React Native application for capturing and discovering location-based memories. Built with TypeScript, React Navigation, and Material Design components.

## 🌟 Features

### Core Features
- **Location-Based Memories**: Capture memories tied to specific locations
- **Multi-Media Support**: Photos, audio, video, and text memories
- **Real-Time Discovery**: Find memories near your current location
- **Social Features**: Like, comment, and share memories
- **Privacy Controls**: Public, friends, and private memory settings
- **Beautiful UI**: Modern Material Design with smooth animations

### Technical Features
- **TypeScript**: Full type safety throughout the app
- **State Management**: Context API with reducers for clean state management
- **Navigation**: React Navigation with stack and tab navigators
- **Maps Integration**: React Native Maps for location visualization
- **Media Handling**: Camera, audio recording, and file upload capabilities
- **Authentication**: JWT-based authentication with refresh tokens
- **Offline Support**: AsyncStorage for local data persistence
- **Push Notifications**: Real-time updates and notifications

## 🏗️ Architecture

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   ├── map/           # Map-related screens
│   ├── feed/          # Memory feed screens
│   ├── create/        # Memory creation screens
│   ├── discover/      # Discovery screens
│   └── profile/       # Profile screens
├── navigation/         # Navigation configuration
├── services/          # API and external services
├── store/             # Context providers and state management
├── utils/             # Utility functions and helpers
├── types/             # TypeScript type definitions
├── constants/         # App constants and configuration
├── hooks/             # Custom React hooks
└── assets/            # Images, icons, and other assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Flutter SDK (if using Flutter)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Memory-Lane-FrontEnd
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install iOS dependencies** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Configure environment**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

5. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

6. **Run on device/emulator**
   ```bash
   # Android
   npm run android
   
   # iOS
   npm run ios
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
API_BASE_URL=http://localhost:5000/api
API_TIMEOUT=30000

# Google Maps (Android)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Social Login
GOOGLE_CLIENT_ID=your_google_client_id
FACEBOOK_APP_ID=your_facebook_app_id

# Push Notifications
FIREBASE_SERVER_KEY=your_firebase_server_key

# Analytics
ANALYTICS_KEY=your_analytics_key
```

### Backend Configuration

The app is designed to work with the Flask backend. Make sure your backend is running and accessible at the configured API URL.

## 📱 Screenshots

### Authentication
- Beautiful login screen with gradient background
- Social login integration (Google, Apple)
- Registration with validation
- Password reset functionality

### Map View
- Interactive map showing nearby memories
- Memory markers with custom icons
- Real-time location tracking
- Memory clustering for better UX

### Memory Creation
- Multi-step memory creation flow
- Camera integration for photos
- Audio recording capabilities
- Location picker with map integration
- Privacy settings and tags

### Feed & Discovery
- Infinite scroll memory feed
- Search and filter functionality
- Memory categories and moods
- Social interactions (like, comment, share)

## 🛠️ Development

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety

### Available Scripts

```bash
# Development
npm start          # Start Metro bundler
npm run android    # Run on Android
npm run ios        # Run on iOS

# Testing
npm test           # Run tests
npm run test:watch # Run tests in watch mode

# Code Quality
npm run lint       # Run ESLint
npm run lint:fix   # Fix ESLint issues
npm run type-check # Run TypeScript type checking

# Building
npm run build:android  # Build Android APK
npm run build:ios      # Build iOS app
```

### Project Structure

```
Memory-Lane-FrontEnd/
├── android/                 # Android-specific files
├── ios/                    # iOS-specific files
├── src/                    # Source code
│   ├── components/         # Reusable components
│   ├── screens/           # Screen components
│   ├── navigation/        # Navigation setup
│   ├── services/          # API services
│   ├── store/             # State management
│   ├── utils/             # Utilities
│   ├── types/             # TypeScript types
│   ├── constants/         # Constants
│   ├── hooks/             # Custom hooks
│   └── assets/            # Assets
├── __tests__/             # Test files
├── .env.example           # Environment template
├── .eslintrc.js           # ESLint configuration
├── .prettierrc            # Prettier configuration
├── babel.config.js        # Babel configuration
├── metro.config.js        # Metro configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🔌 API Integration

The app communicates with the Flask backend through RESTful APIs:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Token refresh

### Memory Endpoints
- `GET /api/memories/nearby` - Get nearby memories
- `POST /api/memories` - Create new memory
- `GET /api/memories/{id}` - Get memory details
- `PUT /api/memories/{id}` - Update memory
- `DELETE /api/memories/{id}` - Delete memory

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/avatar` - Upload avatar

## 🎨 UI/UX Design

### Design System

The app uses a comprehensive design system with:

- **Color Palette**: Primary, secondary, and semantic colors
- **Typography**: Consistent font sizes and weights
- **Spacing**: Standardized spacing scale
- **Shadows**: Material Design elevation system
- **Icons**: Material Community Icons

### Components

- **MemoryCard**: Displays memory information
- **MapView**: Interactive map component
- **MediaPicker**: Photo/video selection
- **AudioRecorder**: Audio recording interface
- **LocationPicker**: Location selection
- **PrivacySelector**: Privacy level selection

## 🔒 Security

### Authentication
- JWT-based authentication
- Automatic token refresh
- Secure token storage
- Biometric authentication support

### Data Protection
- Encrypted storage for sensitive data
- Secure API communication
- Input validation and sanitization
- Privacy controls for user data

## 📊 Performance

### Optimization Techniques
- **Lazy Loading**: Components and screens loaded on demand
- **Image Optimization**: Compressed images and thumbnails
- **Caching**: Local storage for offline access
- **Memory Management**: Proper cleanup and garbage collection

### Monitoring
- Performance monitoring with React Native Performance
- Error tracking and crash reporting
- Analytics for user behavior

## 🧪 Testing

### Test Structure
```
__tests__/
├── components/     # Component tests
├── screens/        # Screen tests
├── services/       # Service tests
├── utils/          # Utility tests
└── integration/    # Integration tests
```

### Running Tests
```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Generate coverage report
```

## 🚀 Deployment

### Android
1. Generate signed APK
2. Upload to Google Play Console
3. Configure app signing
4. Release to production

### iOS
1. Archive the app in Xcode
2. Upload to App Store Connect
3. Configure app metadata
4. Submit for review

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React Native team for the amazing framework
- React Navigation for navigation solutions
- React Native Paper for Material Design components
- The open-source community for various libraries

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Memory Lane** - Where every location tells a story. 📍✨