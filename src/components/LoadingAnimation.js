// src/components/LoadingAnimation.jsx
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingAnimation = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1E90FF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default LoadingAnimation;
