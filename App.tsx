import React from 'react';
import { StatusBar } from 'expo-status-bar';
import FormScreen from './src/screens/FormScreen';

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <FormScreen />
    </>
  );
}
