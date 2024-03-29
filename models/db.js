const { db } = require("./firebase");
const {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  deleteDoc,
  addDoc,
  serverTimestamp,
  where,
  getDocs,
} = require("firebase/firestore");

// Fetches the data from Firestore with specified Collection Name and DocID
async function fetchDataSnap(collectionName, docID) {
  const data = doc(db, collectionName, docID);

  const docSnap = await getDoc(data);
  return docSnap;
}

// Checks if the data is present in the Collection
async function checkData(collectionName, docId) {
  const isDatapresent = await fetchDataSnap(collectionName, docId);
  if (isDatapresent.exists()) {
    return true;
  } else {
    return false;
  }
}

// Saves the data in the firestore
async function saveData(collectionName, docId, data) {
  const isDataSaved = setDoc(doc(db, collectionName, docId), data)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
  return isDataSaved;
}

// Updates the data in Firestore Collection
async function updateData(collectionName, docId, data) {
  // Returns true if data updated successfully else false
  const dataUpdated = await updateDoc(doc(db, collectionName, docId), data)
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });

  return dataUpdated;
}

// Carries out saving out daily Data of the Dashboard
async function saveDailyData(dataObj) {
  try {
    const { infectedNum, deceasedNum, activeNum, recoveredNum, date } = dataObj;

    // Date to be in this format while saving
    // date: new Date(Date.now()).toDateString())

    const isDatapresent = await checkData("dailyCovidData", date);

    // Shows that data is already present in DB
    if (isDatapresent) {
      return !isDatapresent;
    } else {
      const dataToSave = {
        infectedNum,
        deceasedNum,
        activeNum,
        recoveredNum,
      };

      const isDataSaved = await saveData("dailyCovidData", date, dataToSave);

      return isDataSaved;
    }
  } catch (e) {
    console.error(e.message);
  }
}

const saveUser = async (user) => {
  const isUserSaved = await saveData("users", user.uid, {
    id: user.uid,
    name: user.displayName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    isAdmin: false,
  });

  return isUserSaved;
};

// Get daily Covid Data
async function getDailyCovidData() {
  try {
    const date = new Date(Date.now()).toDateString();
    const covidData = await fetchDataSnap("dailyCovidData", date);

    return covidData.data();
  } catch (error) {
    console.error(error);
  }
}

// Books out appointment of users with their respective userID
async function bookAppointment(formData, userId) {
  try {
    // Appointments are fixed with userId as their DocID in 'appointments' collection
    const {
      fullName,
      gender,
      phoneNum,
      email,
      date,
      healthCenter,
      age,
      address,
    } = formData;

    // Checks if the appointment is already booked by specified user

    const dataToSave = {
      fullName,
      gender,
      age,
      phoneNum,
      address,
      date,
      email,
      healthCenter,
      userId,
      created_at: serverTimestamp(),
      isApproved: false,
      isDeclined: false,
    };
    // console.log(dataToSave);

    const isDataSaved = await addDoc(
      collection(db, "appointments"),
      dataToSave
    );
    return isDataSaved;
  } catch (error) {
    console.error(error.message);
  }
}

// Updating the Daily Covid Data by Admin (Health Center Staff)
async function updateDailyData(dataToUpdate) {
  try {
    const prevDataSnap = await fetchDataSnap(
      "dailyCovidData",
      dataToUpdate.date
    );
    const prevData = prevDataSnap.data();

    // Object which stores the data to be updated in firestore collection
    const dataToSave = {};

    // Checks if the value:
    // 1. Is not NULL
    // 2. Data to be updated is not previously present value
    for (let key in dataToUpdate) {
      if (
        key != "date" &&
        dataToUpdate[key] != null &&
        dataToUpdate[key] > prevData[key]
      ) {
        dataToSave[key] = dataToUpdate[key];
      }
    }

    const dataUpdated = await updateData(
      "dailyCovidData",
      dataToUpdate.date,
      dataToSave
    );
    return dataUpdated;
  } catch (error) {
    console.error(error.message);
  }
}

async function receiveUserAppointments(user) {
  try {
    const q = query(
      collection(db, "appointments"),
      where("userId", "==", user),
      orderBy("date", "desc"),
      limit(5)
    );

    const appointments = [];
    const dataSnap = await getDocs(q);
    dataSnap.forEach((appointment) => {
      appointments.push(appointment.data());
    });

    return appointments;
  } catch (error) {
    console.error(error);
  }
}

async function receiveAppointments(
  userId,
  healthCenter,
  onlyApproved = false,
  onlyDeclined = false
) {
  try {
    let q;
    console.log(healthCenter);
    if (!healthCenter) {
      q = query(
        collection(db, "appointments"),
        where("userId", "==", userId),
        orderBy("date", "desc")
      );
    } else {
      if (onlyApproved) {
        q = query(
          collection(db, "appointments"),
          where("healthCenter", "==", healthCenter),
          where("isApproved", "==", true),
          orderBy("date", "desc")
        );
      } else if (onlyDeclined) {
        q = query(
          collection(db, "appointments"),
          where("healthCenter", "==", healthCenter),
          where("isDeclined", "==", true),
          orderBy("date", "desc")
        );
      } else {
        q = query(
          collection(db, "appointments"),
          where("healthCenter", "==", healthCenter),
          orderBy("date", "desc")
        );
      }
    }

    const appointments = [];
    const dataSnap = await getDocs(q);
    dataSnap.forEach((appointment) => {
      let a = appointment.data();
      a.id = appointment.id;
      appointments.push(a);
    });

    return appointments;
  } catch (error) {
    console.error(error);
  }
}

async function cancelAppointment(appointmentId) {
  try {
    const appointmentDeleted = deleteDoc(doc(db, "appointments", appointmentId))
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });

    return appointmentDeleted;
  } catch (error) {}
}

// Function to perform retrieval of documents from the collection
async function getDocCollection(collectionName, limitNum = 5) {
  try {
    const q = query(collection(db, collectionName), limit(limitNum));
    const dataArr = [];
    const dataSnap = await getDocs(q);
    dataSnap.forEach((doc) => {
      dataArr.push(doc);
    });

    return dataArr;
  } catch (error) {
    console.error(error);
  }
}

// Returns the regions for Dashboard map
function getRegionData() {
  try {
    const regions = getDocCollection("regions", 20);
    return regions;
  } catch {
    return null;
  }
}

// Returns the healthCentres info
function getHealthCentreInfo() {
  try {
    const healthCentres = getDocCollection("healthCentres", 20);
    return healthCentres;
  } catch {
    return null;
  }
}

module.exports = {
  saveUser,
  getHealthCentreInfo,
  getRegionData,
  cancelAppointment,
  receiveUserAppointments,
  updateDailyData,
  bookAppointment,
  getDailyCovidData,
  saveDailyData,
  receiveAppointments,
};
