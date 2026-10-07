import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>

      <Text style={styles.subtitle}>Enter the OTP sent to {mobile}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit OTP"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />

      <Button
        title={loading ? 'Verifying...' : 'Verify OTP'}
        onPress={handleVerifyOtp}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 16,
  },
});

export default OtpScreen;
