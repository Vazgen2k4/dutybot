require('dotenv').config();

const {
    initializeApp
} = require('firebase/app');


const {
    getFirestore,
    doc,
    setDoc,
    getDoc,
} = require('firebase/firestore');

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
    async setUserCoins({
        userId,
        credits = 0,
    }) {
        const path = `users/${userId}`;
        const userDoc = doc(db, path);
        await setDoc(userDoc, {
            coins: credits
        });
    },

    async getUserCoins({
        userId
    }) {
        const path = `users/${userId}`;
        const userDoc = doc(db, path);
        const user = await getDoc(userDoc);
        const coins = user.get('coins');
        return coins;
    }
}