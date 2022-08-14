const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const { auth } = require("../models/firebase");

const registerUser = async (email, password) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userCredentials.user != null) {
      return {
        user: userCredentials.user,
        success: true,
        error: null,
      };
    }
  } catch (e) {
    return {
      user: null,
      success: false,
      error: e,
    };
  }
};

const signInUser = async (email, password) => {
  try {
    const userAuth = await signInWithEmailAndPassword(auth, email, password);

    if (userAuth.user != null) {
      return userAuth.user;
    }
  } catch (e) {
    return { errorCode: e.code, message: e.message };
  }
};

module.exports = {
  signInUser,
  registerUser,
};
