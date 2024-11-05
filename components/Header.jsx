import { Fugaz_One } from 'next/font/google'
import Link from 'next/link'
import React from 'react'
import Logout from './Logout'

const fugaz = Fugaz_One({ subsets: ['latin'], weight: '400' })

export default function Header() {
  return (
    <header className='p-4 sm:p-8 flex items-center justify-between gap-4'>
      <Link href={'/'}>
        <h1 className={`textGradient text-base sm:text-lg ${fugaz.className}`}>Broodle</h1>
      </Link>
      <Logout />
    </header>
  )
}
