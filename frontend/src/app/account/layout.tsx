"use client"

import { Authenticator } from '@aws-amplify/ui-react';

type CognitoPrivateLayoutProps = {
  children: React.ReactNode
}

const CognitoPrivateLayout = ({ children }: CognitoPrivateLayoutProps) => {
  return (
    <div className='mx-auto container flex justify-center items-center h-screen'>
      <Authenticator>
        {children}
      </Authenticator>
    </div>
  )
}

export default CognitoPrivateLayout