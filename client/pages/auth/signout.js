import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

//Sign out must come from inside a component
//Cannot come from getInitialprops

export default () => {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},

    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    doRequest();
  }, []);
  return <div>Signing you out...</div>;
};
