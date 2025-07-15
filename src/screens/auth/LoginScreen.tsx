import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  HelperText,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/store/AuthContext';
import { theme } from '@/constants/theme';
import { LoginRequest } from '@/types';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  const themeColors = useTheme();
  
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<LoginRequest>>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const containerStyle = Platform.select({
    ios: { flex: 1 },
    android: { flex: 1 },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginRequest> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username or email is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setGeneralError('');

    try {
      await login(formData);
    } catch (error: any) {
      setGeneralError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  return (
    <SafeAreaView style={containerStyle}>
      <View
        style={[
          styles.background,
          { backgroundColor: theme.colors.gradient?.primary?.[0] || theme.colors.primary }
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              {/* App Logo/Title */}
              <View style={styles.header}>
                <Text style={styles.iconText}>🗺️</Text>
                <Text style={[styles.title, { color: theme.colors.onPrimary }]}>
                  Memory Lane
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.onPrimary }]}>
                  Welcome back
                </Text>
              </View>

              {/* Login Form */}
              <View style={styles.form}>
                {/* Username/Email Input */}
                <TextInput
                  mode="outlined"
                  label="Username or Email"
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  error={!!errors.username}
                  style={styles.input}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {errors.username && (
                  <HelperText type="error" visible={true}>
                    {errors.username}
                  </HelperText>
                )}

                {/* Password Input */}
                <TextInput
                  mode="outlined"
                  label="Password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  error={!!errors.password}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                />
                <Button
                  mode="text"
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.togglePasswordButton}
                  textColor={theme.colors.onPrimary}
                >
                  {showPassword ? 'Hide Password' : 'Show Password'}
                </Button>
                {errors.password && (
                  <HelperText type="error" visible={true}>
                    {errors.password}
                  </HelperText>
                )}

                {/* General Error */}
                {generalError ? (
                  <HelperText type="error" visible={true}>
                    {generalError}
                  </HelperText>
                ) : null}

                {/* Login Button */}
                <Button
                  mode="contained"
                  onPress={handleLogin}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.loginButton}
                  contentStyle={styles.buttonContent}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>

                {/* Forgot Password */}
                <Button
                  mode="text"
                  onPress={() => navigation.navigate('ForgotPassword' as never)}
                  style={styles.forgotButton}
                  textColor={theme.colors.onPrimary}
                >
                  Forgot Password?
                </Button>
              </View>

              {/* Sign Up Link */}
              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: theme.colors.onPrimary }]}>
                  Don't have an account?{' '}
                </Text>
                <Button
                  mode="text"
                  onPress={() => navigation.navigate('Register' as never)}
                  textColor={theme.colors.onPrimary}
                  labelStyle={styles.signUpText}
                >
                  Sign Up
                </Button>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconText: {
    fontSize: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.8,
  },
  form: {
    marginBottom: 30,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  loginButton: {
    marginTop: 20,
    marginBottom: 10,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  forgotButton: {
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
  },
  signUpText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  togglePasswordButton: {
    marginTop: -10, // Adjust as needed to position it correctly
    alignSelf: 'flex-end',
  },
});

export default LoginScreen;