import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

import api from '../config/api';

function LoginScreen({ navigation }) {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (mobile.length !== 10) {
      Alert.alert('Invalid mobile number', 'Please enter a 10-digit number.');
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
        'Error',
        error.response?.data?.message || 'Unable to send OTP.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to PlumbMart</Text>

      <Text style={styles.subtitle}>Enter your mobile number to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Mobile number"
        keyboardType="phone-pad"
        maxLength={10}
        value={mobile}
        onChangeText={setMobile}
      />

      <Button
        title={loading ? 'Sending...' : 'Send OTP'}
        onPress={handleSendOtp}
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
    fontSize: 16,
    marginBottom: 16,
  },
});

export default LoginScreen;
