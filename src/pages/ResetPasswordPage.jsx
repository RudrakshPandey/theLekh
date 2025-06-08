// import React from 'react'
import { Helmet } from 'react-helmet';
import ResetPasswordForm from '../components/password/ResetPasswordForm';

const ResetPasswordPage = () => {
  return (
    <>
      <Helmet>
        <title>Register | theLekh</title>
      </Helmet>
      <div className='login-main-div'>
        <ResetPasswordForm />
      </div>
    </>
  );
};

export default ResetPasswordPage;
