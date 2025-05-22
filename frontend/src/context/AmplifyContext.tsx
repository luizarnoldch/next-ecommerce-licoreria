'use client';

import config from '@/amplifyconfiguration.json';
import { Amplify } from 'aws-amplify';
import { CookieStorage } from 'aws-amplify/utils';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

Amplify.configure(config, {
  ssr: true
});

cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage());

export default function AmplifyContext({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}