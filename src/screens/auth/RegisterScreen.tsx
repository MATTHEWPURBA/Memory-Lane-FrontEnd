import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  useTheme,
  HelperText,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/store/AuthContext';
import apiService from '@/services/api';
import { RegisterRequest } from '@/types';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  bio: string;
}

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  displayName?: string;
}

const RegisterScreen: React.FC = () => {
  const theme = useTheme();
  const { register } = useAuth();
  const navigation = useNavigation();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    bio: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  
  // Debounce refs
  const emailDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const usernameDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Validation functions
  const validateUsername = (username: string): string | undefined => {
    if (!username.trim()) {
      return 'Username is required';
    }
    if (username.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (username.length > 30) {
      return 'Username must be less than 30 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }
    return undefined;
  };

  const validateConfirmPassword = (confirmPassword: string): string | undefined => {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    if (confirmPassword !== formData.password) {
      return 'Passwords do not match';
    }
    return undefined;
  };

  const validateDisplayName = (displayName: string): string | undefined => {
    if (displayName.length > 50) {
      return 'Display name must be less than 50 characters';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    newErrors.username = validateUsername(formData.username);
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword);
    newErrors.displayName = validateDisplayName(formData.displayName);

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== undefined);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Clear previous debounce timers
    if (field === 'username' && usernameDebounceRef.current) {
      clearTimeout(usernameDebounceRef.current);
    }
    if (field === 'email' && emailDebounceRef.current) {
      clearTimeout(emailDebounceRef.current);
    }

    // Debounced availability checks
    if (field === 'username' && value.length >= 3) {
      usernameDebounceRef.current = setTimeout(() => {
        checkUsernameAvailability(value);
      }, 500); // 500ms delay
    }
    if (field === 'email' && value.includes('@')) {
      emailDebounceRef.current = setTimeout(() => {
        checkEmailAvailability(value);
      }, 800); // 800ms delay for email (longer since email validation is more complex)
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) return;
    
    setIsCheckingUsername(true);
    try {
      const response = await apiService.checkUsernameAvailability(username);
      setUsernameAvailable(response.available);
    } catch (error) {
      console.error('Username check failed:', error);
      setUsernameAvailable(null);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const checkEmailAvailability = async (email: string) => {
    if (!email.includes('@')) return;
    
    // Additional validation to prevent incomplete emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return; // Don't check incomplete emails
    }
    
    setIsCheckingEmail(true);
    try {
      const response = await apiService.checkEmailAvailability(email);
      setEmailAvailable(response.available);
    } catch (error) {
      console.error('Email check failed:', error);
      setEmailAvailable(null);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Cleanup function to clear debounce timers
  const cleanupDebounceTimers = useCallback(() => {
    if (emailDebounceRef.current) {
      clearTimeout(emailDebounceRef.current);
    }
    if (usernameDebounceRef.current) {
      clearTimeout(usernameDebounceRef.current);
    }
  }, []);

  // Cleanup on component unmount
  React.useEffect(() => {
    return cleanupDebounceTimers;
  }, [cleanupDebounceTimers]);

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const registerData: RegisterRequest = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        display_name: formData.displayName.trim() || undefined,
        bio: formData.bio.trim() || undefined,
      };

      await register(registerData);
      
      // Success message will be handled by AuthContext
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.message) {
        if (error.message.includes('Username Taken')) {
          setErrors(prev => ({ ...prev, username: 'Username is already taken' }));
          return;
        }
        if (error.message.includes('Email Taken')) {
          setErrors(prev => ({ ...prev, email: 'Email is already registered' }));
          return;
        }
        if (error.message.includes('Validation Error')) {
          errorMessage = error.message;
        }
      }
      
      Alert.alert('Registration Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with Back Button */}
          <View style={styles.headerContainer}>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Login' as never)}
              icon="arrow-left"
              textColor={theme.colors.primary}
              style={styles.backButton}
            >
              Back
            </Button>
          </View>

          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>
              Create Account
            </Text>
            <Text style={styles.subtitle}>
              Join Memory Lane and start sharing your moments
            </Text>
          </View>

          <View style={styles.form}>
            {/* Username */}
            <TextInput
              label="Username"
              value={formData.username}
              onChangeText={(text) => handleInputChange('username', text)}
              mode="outlined"
              style={styles.input}
              error={!!errors.username}
              disabled={isLoading}
              autoCapitalize="none"
              autoCorrect={false}
              left={<TextInput.Icon icon="account" />}
              right={
                isCheckingUsername ? (
                  <TextInput.Icon icon="loading" />
                ) : usernameAvailable !== null ? (
                  <TextInput.Icon 
                    icon={usernameAvailable ? "check-circle" : "close-circle"}
                    color={usernameAvailable ? "green" : "red"}
                  />
                ) : null
              }
            />
            {errors.username && (
              <HelperText type="error" visible={!!errors.username}>
                {errors.username}
              </HelperText>
            )}
            {!errors.username && usernameAvailable !== null && (
              <HelperText 
                type={usernameAvailable ? "info" : "error"} 
                visible={true}
              >
                {usernameAvailable ? "Username is available" : "Username is already taken"}
              </HelperText>
            )}

            {/* Email */}
            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              mode="outlined"
              style={styles.input}
              error={!!errors.email}
              disabled={isLoading}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              left={<TextInput.Icon icon="email" />}
              right={
                isCheckingEmail ? (
                  <TextInput.Icon icon="loading" />
                ) : emailAvailable !== null ? (
                  <TextInput.Icon 
                    icon={emailAvailable ? "check-circle" : "close-circle"}
                    color={emailAvailable ? "green" : "red"}
                  />
                ) : null
              }
            />
            {errors.email && (
              <HelperText type="error" visible={!!errors.email}>
                {errors.email}
              </HelperText>
            )}
            {!errors.email && emailAvailable !== null && (
              <HelperText 
                type={emailAvailable ? "info" : "error"} 
                visible={true}
              >
                {emailAvailable ? "Email is available" : "Email is already registered"}
              </HelperText>
            )}

            {/* Password */}
            <TextInput
              label="Password"
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              mode="outlined"
              style={styles.input}
              error={!!errors.password}
              disabled={isLoading}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            {errors.password && (
              <HelperText type="error" visible={!!errors.password}>
                {errors.password}
              </HelperText>
            )}

            {/* Confirm Password */}
            <TextInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
              mode="outlined"
              style={styles.input}
              error={!!errors.confirmPassword}
              disabled={isLoading}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              left={<TextInput.Icon icon="lock-check" />}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? "eye-off" : "eye"}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />
            {errors.confirmPassword && (
              <HelperText type="error" visible={!!errors.confirmPassword}>
                {errors.confirmPassword}
              </HelperText>
            )}

            {/* Display Name */}
            <TextInput
              label="Display Name (Optional)"
              value={formData.displayName}
              onChangeText={(text) => handleInputChange('displayName', text)}
              mode="outlined"
              style={styles.input}
              error={!!errors.displayName}
              disabled={isLoading}
              left={<TextInput.Icon icon="account-circle" />}
            />
            {errors.displayName && (
              <HelperText type="error" visible={!!errors.displayName}>
                {errors.displayName}
              </HelperText>
            )}

            {/* Bio */}
            <TextInput
              label="Bio (Optional)"
              value={formData.bio}
              onChangeText={(text) => handleInputChange('bio', text)}
              mode="outlined"
              style={styles.input}
              disabled={isLoading}
              multiline
              numberOfLines={3}
              left={<TextInput.Icon icon="information" />}
            />

            <Divider style={styles.divider} />

            {/* Register Button */}
            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.registerButton}
              disabled={isLoading}
              loading={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {/* Terms and Privacy */}
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text style={styles.link}>Terms of Service</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>

            {/* Back to Login */}
            <View style={styles.loginLink}>
              <Text style={styles.loginText}>
                Already have an account?{' '}
              </Text>
              <Button
                mode="text"
                onPress={() => navigation.navigate('Login' as never)}
                textColor={theme.colors.primary}
                labelStyle={styles.loginButtonText}
              >
                Sign In
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  input: {
    marginBottom: 8,
  },
  divider: {
    marginVertical: 24,
  },
  registerButton: {
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginButtonText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
});

export default RegisterScreen; 