// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import * as fbAuth from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAPbZdRS4Gu3nW6GmUgpqGm3hnoFES5puE',
  authDomain: 'sports-hedge.firebaseapp.com',
  projectId: 'sports-hedge',
  storageBucket: 'sports-hedge.appspot.com',
  messagingSenderId: '9098787389',
  appId: '1:9098787389:web:c2f84f94815d705a360854',
  measurementId: 'G-23ZB99DSL8'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  persistence: (fbAuth as any).getReactNativePersistence(ReactNativeAsyncStorage)
});

export { firebaseConfig, auth };