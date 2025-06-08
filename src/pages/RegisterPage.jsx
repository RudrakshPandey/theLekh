import RegisterForm from '../components/auth/RegisterForm';
import { Helmet } from 'react-helmet';
const RegisterPage = () => {
  return (
    <>
      <Helmet>
        <title>Register | theLekh</title>
      </Helmet>
      <div className='login-main-div'>
        <RegisterForm />
      </div>
    </>
  );
};

export default RegisterPage;
