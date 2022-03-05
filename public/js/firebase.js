const firebaseConfig = {
	apiKey: 'AIzaSyBPJrwvIC9NUcBOpva81LPvhTRTQ_YaqHY',
	authDomain: 'blog-project-fc401.firebaseapp.com',
	databaseURL: 'https://blog-project-fc401-default-rtdb.asia-southeast1.firebasedatabase.app',
	projectId: 'blog-project-fc401',
	storageBucket: 'blog-project-fc401.appspot.com',
	messagingSenderId: '886755584846',
	appId: '1:886755584846:web:da11851b065c8f8f768c1f',
}

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig)
const db = app.firestore()
const auth = app.auth()
const storage = app.storage()
