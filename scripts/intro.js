import { db } from './firebase.js';

console.log(db);
setTimeout(() => {
    window.location.href = "/pages/home.html";  // Redirect to home.html after 2 seconds
  }, 2000);