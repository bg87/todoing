import firebase from 'firebase'
import 'firebase/firestore'

const firebaseConfig = firebase.initializeApp({
	apiKey: "AIzaSyAV4rLIJI6hSb1SAgJ02El-X6MrHilPyLQ",
	authDomain: "todoing-react.firebaseapp.com",
	databaseURL: "https://todoing-react.firebaseio.com",
	projectId: "todoing-react",
	storageBucket: "",
	messagingSenderId: "409909044184",
	appId: "1:409909044184:web:8e584ee110685c39"
})

export { firebaseConfig as firebase }