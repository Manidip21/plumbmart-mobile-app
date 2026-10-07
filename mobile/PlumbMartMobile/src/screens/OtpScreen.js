import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
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

import { getToken, saveAuthData } from '../utils/authStorage';
import api from '../config/api';
import { setAuthData } from '../store/authSlice';

function OtpScreen({ route }) {
  const { mobile } = route.params;
  const dispatch = useDispatch();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/api/auth/verify-otp', {
        mobile,
        otp,
      });

      console.log('VERIFY OTP RESPONSE:', response.data);

      await saveAuthData(response.data.token, response.data.user);

      dispatch(
        setAuthData({
          token: response.data.token,
          user: response.data.user,
        }),
      );

      const savedToken = await getToken();

      console.log('SAVED TOKEN:', savedToken);

      Alert.alert(
        'Login Successful',
        response.data.message || 'You are now logged in.',
      );
    } catch (error) {
      console.log('VERIFY OTP ERROR:', error.response?.data || error.message);

      Alert.alert(
        'Verification Failed',
        error.response?.data?.message || 'Invalid or expired OTP.',
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
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>✓</Text>
        </View>

        <Text style={styles.title}>Verify Your Number</Text>

        <Text style={styles.subtitle}>Enter the 6-digit OTP sent to</Text>

        <Text style={styles.mobileNumber}>+91 {mobile}</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>One-Time Password</Text>

          <TextInput
            style={styles.input}
            placeholder="000000"
            placeholderTextColor="#c4c9d1"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={text => setOtp(text.replace(/[^0-9]/g, ''))}
            editable={!loading}
            autoFocus
          />

          <Text style={styles.helperText}>
            Enter the OTP to securely continue to your account.
          </Text>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleVerifyOtp}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={styles.buttonText}>Verifying...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.demoText}>Demo OTP: 123456</Text>
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

  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#dbeafe',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  iconText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#2563eb',
  },

  title: {
    fontSize: 27,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
  },

  mobileNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 30,
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
    marginBottom: 10,
  },

  input: {
    height: 58,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: 8,
  },

  helperText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 10,
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

  demoText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 22,
  },
});

export default OtpScreen;
