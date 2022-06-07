import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';

// material
import { Link, Stack, Checkbox, TextField, IconButton, InputAdornment, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

// component
import axios from '../../../http-common';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [emailData, setEmailData] = useState();

  const [isUserPresent, setIsUserPresent] = useState(false);

  const [open, setOpen] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true,
    },
    validationSchema: LoginSchema,

    onSubmit: async () => {
      let response = null;
      try {
        response = await axios.get(`http://localhost:8180/korisnik/email/${emailData}`);
        if (
          response.data.data.korisnik.email === getFieldProps('email').value &&
          response.data.data.korisnik.password === getFieldProps('password').value
        ) {
          setIsUserPresent(true);
          localStorage.setItem(
            'user',
            JSON.stringify({
              email: response.data.data.korisnik.email,
              firstName: response.data.data.korisnik.firstName,
              lastName: response.data.data.korisnik.lastName,
              password: response.data.data.korisnik.password,
              uloga: response.data.data.korisnik.uloga,
              narudzba_id: response.data.data.korisnik.narudzba?.id,
            })
          );
          navigate('/dashboard/products', { replace: true, state: { email: emailData } });
        }
      } catch (error) {
        console.log('ERROR: ', error);
        setIsUserPresent(false);
        setOpen(true);
      }
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  useEffect(() => {
    setEmailData(getFieldProps('email').value);
  }, [getFieldProps]);

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <FormikProvider value={formik}>
      {!isUserPresent && (
        <Collapse in={open}>
          {' '}
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            The username or password is incorrect!
          </Alert>
        </Collapse>
      )}
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label="Remember me"
          />

          <Link component={RouterLink} variant="subtitle2" to="#" underline="hover">
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
