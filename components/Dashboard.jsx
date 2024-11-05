'use client'
import React, { useContext, useEffect, useState } from 'react'
import Main from './Main'
import Calendar from './Calendar'
import { useAuth } from '@/context/authContext'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import Loading from './Loading'
import Login from './Login'

export default function Dashboard() {
  const {currentUser, userDataObject, setUserDataObject, isLoading} = useAuth()
  const [data, setData] = useState({})
  const now = new Date()

  function countValues(){

  }

  async function handleSetMood(mood) {
    const day = now.getDate()
    const month = now.getMonth()
    const year = now.getFullYear()

    try {
      const newData = { ...userDataObject }
      if (!newData?.[year]) {
        newData[year] = {}
      }
      if (!newData?.[year]?.[month]) {
        newData[year][month] = {}
      }

      newData[year][month][day] = mood
      console.log('newData: ', newData)
      console.log('mood',mood)
      // update the current state
      setData(newData)
      // update the global state
      setUserDataObject(newData)
      // update firebase
      const docRef = doc(db, 'users', currentUser.uid)
      const res = await setDoc(docRef, {
        [year]: {
          [month]: {
            [day]: mood
          }
        }
      }, { merge: true })
    } catch (err) {
      console.log('Failed to set data: ', err.message)
    }
  }

  useEffect(()=>{
    if(!currentUser || !userDataObject){
      return
    }

    setData(userDataObject)
  },[currentUser, userDataObject])

  if (isLoading) {
    return <Loading />
  }

  if (!currentUser) {
    return <Login />
  }

  const statuses = {
    num_day: 14,
    time_remaining: '13:14:26',
    date: (new Date()).toDateString() 
  }
  const moods = {
    'cry': '😭',
    'sad': '😢',
    'existing': '😐',
    'good': '😊',
    'happy': '😍'
  }
  return (
    <div className='flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16'>
      <div className='grid grid-cols-3 bg-indigo-50 text-indigo-500 p-4 gap-4 rounded-lg'>
        {Object.keys(statuses).map((status, statusIndex) => {
          return (
            <div key={statusIndex} className=' flex flex-col gap-1 sm:gap-2'>
              <p className='font-medium capitalize text-xs sm:text-sm truncate'>{status.replaceAll('_', ' ')}</p>
              <p className='text-base sm:text-lg truncate fugaz'>{statuses[status]}{status === 'num_days' ? ' 🔥' : ''}</p>
            </div>
          )
        })}
      </div>
      <h4 className='text-5xl sm:text-6xl md:text-7xl text-center fugaz'>
        How do you <span className='textGradient'>feel</span> today?
      </h4>
      <div className='flex items-stretch flex-wrap gap-4'>
        {Object.keys(moods).map((mood, moodIndex) => {
          return (
            <button onClick={() => {
              const currentMoodValue = moodIndex + 1
              handleSetMood(currentMoodValue)
            }} className={'p-4 px-5 rounded-2xl purpleShadow duration-200 bg-indigo-50 hover:bg-indigo-100 text-center flex flex-col items-center gap-2 flex-1 '} key={moodIndex}>
              <p className='text-4xl sm:text-5xl md:text-6xl'>{moods[mood]}</p>
              <p className='text-indigo-500 text-xs sm:text-sm md:text-base fugaz'>{mood}</p>
            </button>
          )
        })}
      </div>
      <Calendar completeData={data} handleSetMood={handleSetMood} />
    </div>
  )
}
