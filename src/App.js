import React from 'react';
import { useQuery } from '@apollo/react-hooks';

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
  return <div>User is not logged in</div>;
};

export default App;