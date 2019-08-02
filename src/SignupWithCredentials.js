import React from 'react';
import { useMutation } from '@apollo/react-hooks';

import { CURRENT_USER_QUERY } from './queries';
import { SIGNUP_MUTATION } from './mutations';

const user = {
  firstName: 'Jen',
  lastName: 'Barber',
  email: 'jen@barber.com',
  password: 'qwerty'
};

const SignupWithCredentials = () => {
  const [signup] = useMutation(
    SIGNUP_MUTATION,
    {
      update: (cache, { data: { signup }}) => cache.writeQuery({
        query: CURRENT_USER_QUERY,
        data: { currentUser: signup.user },
      }),
    }
  )

  return (
    <button onClick={() => signup({ variables: user })}>
      Signup as Jen Barber
    </button>
  );
};

export default SignupWithCredentials;
