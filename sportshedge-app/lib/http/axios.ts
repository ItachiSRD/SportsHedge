import axios from 'axios';
import auth from '@react-native-firebase/auth';
import { AXIOS_BASE_URL } from '@env';

const axiosClient = axios.create({
  baseURL: AXIOS_BASE_URL, // Replace with your API base URL
});

axiosClient.interceptors.request.use(async (config) => {
  // Get the Firebase user (make sure the user is signed in)
  console.log("we here in axios.ts")
  const user = auth().currentUser;
  
  if (user) {
    // Get the Firebase ID token
    const idToken = await user.getIdToken();
    // console.log('idtoken', idToken);
  
    // Add the ID token to the request headers
    config.headers.authorization = `Bearer ${idToken}`;
  }
  console.log("we here in axios.ts finak")
  
  return config;
});
  
export default axiosClient;