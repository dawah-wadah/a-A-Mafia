import Rebase from 're-base';
var firebase = require('firebase');

const app = firebase.initializeApp({
  apiKey: "AIzaSyAQNTztslAbIFaZ306nO1zAxBz90B-47tc",
  authDomain: "mafia-f786c.firebaseapp.com",
  databaseURL: "https://mafia-f786c.firebaseio.com",
  storageBucket: "",
  messagingSenderId: "872061463737"
});

const base = Rebase.createClass(app.database());

export default base;
