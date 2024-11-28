// import { initializeApp } from "firebase/app";
// import { createContext, useContext, useState, useEffect } from "react";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   GoogleAuthProvider,
//   signInWithPopup,
//   onAuthStateChanged,
// } from "firebase/auth";
// import { addDoc, getFirestore, collection, getDocs } from "firebase/firestore";
// // import { emit } from "process";
// // import { getDownloadURL } from "firebase";
// const FirebaseContext = createContext(null);
// const firebaseConfig = {
//   apiKey: "AIzaSyASZYIwVpfkeiA8SEb1YINb5CWX0lL_Mrw",
//   authDomain: "bookify-e4679.firebaseapp.com",
//   projectId: "bookify-e4679",
//   storageBucket: "bookify-e4679.firebasestorage.app",
//   messagingSenderId: "360071228099",
//   appId: "1:360071228099:web:4f6e9503a07a37f8235076",
// };
// export const useFirebase = () => useContext(FirebaseContext);
// const firebaseApp = initializeApp(firebaseConfig);
// const firebaseAuth = getAuth(firebaseApp);
// const firestore = getFirestore(firebaseApp);
// const googleProvider = new GoogleAuthProvider();
// export const FirebaseProvider = (props) => {
//   const [user, setUser] = useState(null);
//   useEffect(() => {
//     onAuthStateChanged(firebaseAuth, (user) => {
//       if (user) setUser(user);
//       else setUser(null);
//     });
//   }, []);
//   const signupUserWithEmailAndPassword = (email, password) =>
//     createUserWithEmailAndPassword(firebaseAuth, email, password);
//   const signinUserWithEmailAndPassword = (email, password) =>
//     signInWithEmailAndPassword(firebaseAuth, email, password);

//   const signinWithGoogle = () => signInWithPopup(firebaseAuth, googleProvider);
//   console.log(user);
//   const handleCreateNewListing = async (name, isbn, price) => {
//     await addDoc(collection(firestore, "books"), {
//       name,
//       isbn,
//       price,
//       userID: user.uid,
//       useEmail: user.displayName,
//       photoURL: user.photoURL,
//     });
//   };
//   const listAllBook = () => {
//     return getDocs(collection(firestore, "books"));
//   };
//   const isLoggedIn = user ? true : false;
//   return (
//     <FirebaseContext.Provider
//       value={{
//         signinWithGoogle,
//         signupUserWithEmailAndPassword,
//         signinUserWithEmailAndPassword,
//         isLoggedIn,
//         handleCreateNewListing,
//         listAllBook,
//       }}
//     >
//       {props.children}
//     </FirebaseContext.Provider>
//   );
// };

import { initializeApp } from "firebase/app";
import { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import {
  addDoc,
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

const FirebaseContext = createContext(null);

const firebaseConfig = {
  apiKey: "AIzaSyASZYIwVpfkeiA8SEb1YINb5CWX0lL_Mrw",
  authDomain: "bookify-e4679.firebaseapp.com",
  projectId: "bookify-e4679",
  storageBucket: "bookify-e4679.firebasestorage.app",
  messagingSenderId: "360071228099",
  appId: "1:360071228099:web:4f6e9503a07a37f8235076",
};

export const useFirebase = () => useContext(FirebaseContext);

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();

export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) setUser(user);
      else setUser(null);
    });
  }, []);

  // Authentication methods
  const signupUserWithEmailAndPassword = (email, password) =>
    createUserWithEmailAndPassword(firebaseAuth, email, password);
  const signinUserWithEmailAndPassword = (email, password) =>
    signInWithEmailAndPassword(firebaseAuth, email, password);
  const signinWithGoogle = () => signInWithPopup(firebaseAuth, googleProvider);

  // Task management methods
  const createTask = async (title, description) => {
    if (!user) throw new Error("User is not authenticated!");
    await addDoc(collection(firestore, "tasks"), {
      title,
      description,
      userID: user.uid,
      createdAt: new Date(),
    });
  };

  const fetchTasks = async () => {
    if (!user) throw new Error("User is not authenticated!");
    const tasksSnapshot = await getDocs(collection(firestore, "tasks"));
    return tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const updateTask = async (taskId, updatedFields) => {
    await updateDoc(doc(firestore, "tasks", taskId), updatedFields);
  };

  const deleteTask = async (taskId) => {
    await deleteDoc(doc(firestore, "tasks", taskId));
  };

  const isLoggedIn = !!user;

  return (
    <FirebaseContext.Provider
      value={{
        signupUserWithEmailAndPassword,
        signinUserWithEmailAndPassword,
        signinWithGoogle,
        createTask,
        fetchTasks,
        updateTask,
        deleteTask,
        isLoggedIn,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
