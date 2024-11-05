'use client'
import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import React, { useState, createContext, useEffect, useContext } from "react";


const AuthConext = React.createContext()

export function useAuth(){
    return useContext(AuthConext)
}

export function AuthProvider({children}){
    const [currentUser, setCurrentUser] = useState(null)
    const [userDataObject, setUserDataObject] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    function signUp(email, password){
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password){
       return signInWithEmailAndPassword(auth, email, password)
    }

    function logout(){
        setCurrentUser(null)
        setUserDataObject(null)
        signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async user => {
            try {
                setIsLoading(true)
                setCurrentUser(user)
                if(!user){
                    console.log("No user")
                    return
                }

                //if user exists, get user data
                console.log("Fetch user data");
                const docRef = doc(db, "users", user.uid)
                const docSnap = await getDoc(docRef)
                let firebase = {}
                if(docSnap.exists()){
                    console.log("Document data:", docSnap.data());
                    firebase = docSnap.data()
                }
                setUserDataObject(firebase)
            } catch (error) {
                console.log(error.message)
            }finally{
                setIsLoading(false)
            }
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        userDataObject,
        signUp,
        login,
        logout,
        setUserDataObject,
        isLoading
    }

    return <AuthConext.Provider value={value}>{children}</AuthConext.Provider>
}