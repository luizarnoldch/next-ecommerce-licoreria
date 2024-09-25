import CompanyLogo from '@/assets/CompanyLogo'
import Link from 'next/link'
import React from 'react'

type Props = {}

const Logo = (props: Props) => {
  return (
    <Link href={'/'} className="flex justify-center items-center my-auto w-24">
      <CompanyLogo className="w-24" />
    </Link>
  )
}

export default Logo
