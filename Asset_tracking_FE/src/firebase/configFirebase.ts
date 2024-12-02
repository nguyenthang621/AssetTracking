// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  // apiKey: 'AIzaSyCOXkRWhou-hqZ1Pa0xjBZGprlH0RvIJVo',
  // authDomain: 'imagedatn.firebaseapp.com',
  // projectId: 'imagedatn',
  // storageBucket: 'imagedatn.appspot.com',
  // messagingSenderId: '29216437251',
  // appId: '1:29216437251:web:9866c46596fe80ff268a36',
  // measurementId: 'G-9679R9FBQZ'

  apiKey: 'AIzaSyBJjAuwhQk-Jczhv8Cp2-plViNu6sh81UE',
  authDomain: 'assettracking-8b5f5.firebaseapp.com',
  projectId: 'assettracking-8b5f5',
  storageBucket: 'assettracking-8b5f5.appspot.com',
  messagingSenderId: '1004183583902',
  appId: '1:1004183583902:web:e368b77ef967e177de8f8f',
  measurementId: 'G-1JFZ6K02Z2'
}
// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
