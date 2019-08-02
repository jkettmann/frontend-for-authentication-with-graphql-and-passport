import React from 'react';
import { useMutation } from '@apollo/react-hooks';

import { CURRENT_USER_QUERY } from './queries';
import { LOGIN_MUTATION } from './mutations';

const user = {
  email: 'maurice@moss.com',
  password: 'abcdefg',
};

const LoginWithCredentials = () => {
  const [login] = useMutation(
    LOGIN_MUTATION,
    {
      update: (cache, { data: { login }}) => cache.writeQuery({
        query: CURRENT_USER_QUERY,
        data: { currentUser: login.user },
      }),
    }
  )

  return (
    <button onClick={() => login({ variables: user })}>
      Login as Maurice Moss
    </button>
  );
};

export default LoginWithCredentials;
