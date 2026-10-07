import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import api from '../config/api';

function LoginScreen({ navigation }) {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (mobile.length !== 10) {
      Alert.alert(
        'Invalid mobile number',
        'Please enter a valid 10-digit mobile number.',
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/api/auth/send-otp', {
        mobile,
      });

      console.log('SEND OTP RESPONSE:', response.data);

      navigation.navigate('Otp', {
        mobile,
      });
    } catch (error) {
      console.log('SEND OTP ERROR:', error.response?.data || error.message);

      Alert.alert(
        'Unable to send OTP',
        error.response?.data?.message || 'Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>P</Text>
        </View>

        <Text style={styles.title}>Welcome to PlumbMart</Text>

        <Text style={styles.subtitle}>
          Your trusted marketplace for plumbing products
        </Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Mobile Number</Text>

          <View style={styles.phoneInputContainer}>
            <Text style={styles.countryCode}>+91</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter mobile number"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              maxLength={10}
              value={mobile}
              onChangeText={text => setMobile(text.replace(/[^0-9]/g, ''))}
              editable={!loading}
            />
          </View>

          <Text style={styles.helperText}>
            We'll send a one-time password to verify your number.
          </Text>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSendOtp}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={styles.buttonText}>Sending OTP...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>Secure OTP-based authentication</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  logoContainer: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  logoText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 12,
    marginBottom: 36,
  },

  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },

  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    paddingLeft: 14,
    paddingRight: 10,
  },

  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#111827',
    paddingHorizontal: 8,
  },

  helperText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6b7280',
    marginTop: 8,
    marginBottom: 20,
  },

  button: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 24,
  },
});

export default LoginScreen;
