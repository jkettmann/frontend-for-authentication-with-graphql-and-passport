import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import LoginWithFacebook from './LoginWithFacebook';
import SignupWithCredentials from './SignupWithCredentials';
import LoginWithCredentials from './LoginWithCredentials';

import { CURRENT_USER_QUERY } from './queries';

const App = () => {
  const { loading, error, data } = useQuery(CURRENT_USER_QUERY);

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  const isLoggedIn = !!data.currentUser;

  if (isLoggedIn) {
    const {
      id,
      firstName,
      lastName,
      email,
    } = data.currentUser;

    return (
      <>
        {id}
        <br />
        {firstName} {lastName}
        <br />
        {email}
      </>
    );
  }

  // SIGNUP AND LOGIN GO HERE
  return (
    <>
      <LoginWithFacebook />
      <SignupWithCredentials />
      <LoginWithCredentials />
    </>
  );
};

export default App;