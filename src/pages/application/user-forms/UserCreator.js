import * as Yup from 'yup';
import { Formik } from 'formik';
import axiosInstance from 'config/axios';
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Select, MenuItem } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { v4 as uuid } from 'uuid';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

const UserCreator = ({ resetPage }) => {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        getRoles();
    }, []);

    const getRoles = async () => {
        await axiosInstance.get("Role/roles").then((response) => {
            const result = response.data;
            if(!result) return;
            else if (result.data && result.success) {
                setRoles(result.data);
            }
        }).catch((error) => console.log("Get roles: ", error));
    }

    return (
        <Formik
            initialValues={{
                userID: uuid(),
                username: "",
                password: "123456",
                firstname: "",
                lastname: "",
                phone: "",
                roleCode: 200
            }}
            validationSchema={Yup.object().shape({
                username: Yup.string().required('Username cannot be empty!'),
                phone: Yup.number().required('Phone cannot be empty!'),
                password: Yup.string().required('Password cannot be empty!'),
                firstname: Yup.string().required('First name cannot be empty!'),
                lastname: Yup.string().required('Last name cannot be empty!'),
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    setStatus({ success: false });
                    setSubmitting(true);
                    await axiosInstance.post(`Auth/register`, values).then((response) => {
                        const result = response.data;
                        if (result && result.success) {
                            setStatus({ success: true });
                            toast.success(result.message);
                            setTimeout(() => {
                                resetPage();
                            }, 1600);
                        }
                        else toast.error(result.message);
                    }).catch((error) => console.log(error)).finally(() => setSubmitting(false));
                } catch (err) {
                    setStatus({ success: false });
                    setErrors({ submit: err.message });
                    setSubmitting(false);
                }
            }}
        >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="username-user">Username</InputLabel>
                                <OutlinedInput
                                    id="username-user"
                                    type="text"
                                    value={values.username}
                                    name="username"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Enter username"
                                    fullWidth
                                    error={Boolean(touched.username && errors.username)}
                                />
                                {touched.username && errors.username && (
                                    <FormHelperText error id="standard-weight-helper-text-username-user">
                                        {errors.username}
                                    </FormHelperText>
                                )}
                            </Stack>
                        </Grid>

                        <Grid item xs={6}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="password-user">Password</InputLabel>
                                <OutlinedInput
                                    id="password-user"
                                    type="text"
                                    value={values.password}
                                    name="password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    fullWidth
                                    error={Boolean(touched.password && errors.password)}
                                />
                                {touched.password && errors.password && (
                                    <FormHelperText error id="standard-weight-helper-text-password-user">
                                        {errors.password}
                                    </FormHelperText>
                                )}
                            </Stack>
                        </Grid>

                        <Grid item xs={6}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="firstname-user">First name</InputLabel>
                                <OutlinedInput
                                    id="firstname-user"
                                    type="text"
                                    value={values.firstname}
                                    name="firstname"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Enter first name"
                                    fullWidth
                                    error={Boolean(touched.firstname && errors.firstname)}
                                />
                                {touched.firstname && errors.firstname && (
                                    <FormHelperText error id="standard-weight-helper-text-firstname-user">
                                        {errors.firstname}
                                    </FormHelperText>
                                )}
                            </Stack>
                        </Grid>

                        <Grid item xs={6}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="lastname-user">Last name</InputLabel>
                                <OutlinedInput
                                    id="lastname-user"
                                    type="text"
                                    value={values.lastname}
                                    name="lastname"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Enter last name"
                                    fullWidth
                                    error={Boolean(touched.lastname && errors.lastname)}
                                />
                                {touched.lastname && errors.lastname && (
                                    <FormHelperText error id="standard-weight-helper-text-lastname-user">
                                        {errors.lastname}
                                    </FormHelperText>
                                )}
                            </Stack>
                        </Grid>

                        <Grid item xs={6}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="phone-user">Phone number</InputLabel>
                                <OutlinedInput
                                    id="phone-user"
                                    type="tel"
                                    value={values.phone}
                                    name="phone"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    fullWidth
                                    error={Boolean(touched.phone && errors.phone)}
                                />
                                {touched.phone && errors.phone && (
                                    <FormHelperText error id="standard-weight-helper-text-phone-user">
                                        {errors.phone}
                                    </FormHelperText>
                                )}
                            </Stack>
                        </Grid>

                        <Grid item xs={6}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="role-user">Role</InputLabel>
                                <Select
                                    id="role-user"
                                    value={values.roleCode}
                                    name="roleCode"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Select one"
                                    fullWidth
                                    error={Boolean(touched.roleCode && errors.roleCode)}
                                >
                                    {
                                        roles && roles.length > 0 ?
                                            roles.map((item, index) => {
                                                return (
                                                    <MenuItem value={item.code} key={index}>{item.name}</MenuItem>
                                                )
                                            })
                                            :
                                            null
                                    }
                                </Select>
                                {touched.roleCode && errors.roleCode && (
                                    <FormHelperText error id="standard-weight-helper-text-role-user">
                                        {errors.roleCode}
                                    </FormHelperText>
                                )}
                            </Stack>
                        </Grid>

                        <Grid item xs={12}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    size="large"
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                >
                                    Submit
                                </Button>
                            </AnimateButton>
                        </Grid>
                    </Grid>
                </form>
            )
            }
        </Formik >
    )
}

export default UserCreator;