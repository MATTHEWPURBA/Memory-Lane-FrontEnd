import React, { useState } from 'react';
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
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useAuth } from '@/store/AuthContext';
import { theme } from '@/constants/theme';
import { LoginRequest } from '@/types';
import { useNavigation } from '@react-navigation/native';
import Logger from '@/utils/logger';

const LoginScreen: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginRequest>>({});

  const { login } = useAuth();
  const themeColors = useTheme();
  const navigation = useNavigation();

  const containerStyle = Platform.select({
    web: {
      ...styles.container,
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
    },
    default: {
      ...styles.container,
      backgroundColor: theme.colors.primary,
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginRequest> = {};

    if (!formData.username && !formData.email) {
      newErrors.username = 'Username or email is required';
    }

    if (!formData.password) {
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
    try {
      await login(formData);
    } catch (error) {
      setErrors({});
      setError(error.message);
      Logger.logError(error, { context: 'Login' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <SafeAreaView style={containerStyle}>
      <LinearGradient
        colors={theme.colors.gradient.primary}
        style={styles.background}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Icon
                  name="map-marker"
                  size={60}
                  color="#FFFFFF"
                />
              </View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to continue your journey
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Username/Email Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Username or Email"
                  value={formData.username || formData.email || ''}
                  onChangeText={(value) => {
                    if (value.includes('@')) {
                      handleInputChange('email', value);
                      handleInputChange('username', '');
                    } else {
                      handleInputChange('username', value);
                      handleInputChange('email', '');
                    }
                  }}
                  mode="outlined"
                  style={styles.input}
                  contentStyle={styles.inputContent}
                  outlineStyle={styles.inputOutline}
                  left={<TextInput.Icon icon="account" />}
                  error={!!errors.username}
                  disabled={isLoading}
                />
                <HelperText type="error" visible={!!errors.username}>
                  {errors.username}
                </HelperText>
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  mode="outlined"
                  style={styles.input}
                  contentStyle={styles.inputContent}
                  outlineStyle={styles.inputOutline}
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                  secureTextEntry={!showPassword}
                  error={!!errors.password}
                  disabled={isLoading}
                />
                <HelperText type="error" visible={!!errors.password}>
                  {errors.password}
                </HelperText>
              </View>

              {/* Forgot Password */}
              <Button
                mode="text"
                onPress={() => {
                  // Navigate to forgot password
                }}
                style={styles.forgotPassword}
                labelStyle={styles.forgotPasswordText}
                disabled={isLoading}
              >
                Forgot Password?
              </Button>

              {/* Login Button */}
              <Button
                mode="contained"
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                style={styles.loginButton}
                contentStyle={styles.loginButtonContent}
                labelStyle={styles.loginButtonLabel}
              >
                Sign In
              </Button>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login Buttons */}
              <View style={styles.socialButtons}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    // Google login
                  }}
                  style={styles.socialButton}
                  contentStyle={styles.socialButtonContent}
                  disabled={isLoading}
                >
                  <Icon name="google" size={20} color={themeColors.colors.primary} />
                  <Text style={styles.socialButtonText}>Google</Text>
                </Button>

                <Button
                  mode="outlined"
                  onPress={() => {
                    // Apple login
                  }}
                  style={styles.socialButton}
                  contentStyle={styles.socialButtonContent}
                  disabled={isLoading}
                >
                  <Icon name="apple" size={20} color={themeColors.colors.primary} />
                  <Text style={styles.socialButtonText}>Apple</Text>
                </Button>
              </View>

              {/* Sign Up Link */}
              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <Button
                  mode="text"
                  onPress={() => {
                    navigation.navigate('Register');
                  }}
                  labelStyle={styles.signUpLink}
                  disabled={isLoading}
                >
                  Sign Up
                </Button>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
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
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...theme.shadows.medium,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    ...theme.shadows.large,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  inputContent: {
    paddingVertical: 8,
  },
  inputOutline: {
    borderRadius: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  loginButton: {
    borderRadius: 12,
    marginBottom: 24,
    ...theme.shadows.medium,
  },
  loginButtonContent: {
    paddingVertical: 8,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
  },
  dividerText: {
    marginHorizontal: 16,
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 12,
    borderColor: theme.colors.outlineVariant,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  socialButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
  },
  signUpLink: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen; 