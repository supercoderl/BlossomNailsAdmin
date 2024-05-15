import * as Yup from 'yup';
import { Formik } from 'formik';
import axiosInstance from 'config/axios';
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { toast } from 'react-toastify';

const CategoryViewer = ({ category, state, resetPage }) => {


    return (
        <Formik
            initialValues={{
                categoryID: category?.categoryID || 0,
                name: category?.name || "",
                priority: category?.priority || 0
            }}
            validationSchema={Yup.object().shape({
                name: Yup.string().required('Category name cannot be empty!'),
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                    setStatus({ success: false });
                    setSubmitting(true);
                    if (state === "update") {
                        await axiosInstance.put(`Category/update-category/${values.categoryID}`, values).then((response) => {
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
                    }
                    else {
                        await axiosInstance.delete(`Service/delete-category/${values.categoryID}`, values).then((response) => {
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
                    }
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
                        <Grid item xs={4}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="name-category">Category name</InputLabel>
                                <OutlinedInput
                                    id="name-category"
                                    type="text"
                                    value={values.name}
                                    name="name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Enter category name"
                                    fullWidth
                                    error={Boolean(touched.name && errors.name)}
                                />
                                {touched.name && errors.name && (
                                    <FormHelperText error id="standard-weight-helper-text-name-category">
                                        {errors.name}
                                    </FormHelperText>
                                )}
                            </Stack>
                        </Grid>

                        <Grid item xs={4}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="priority-category">Priority</InputLabel>
                                <OutlinedInput
                                    id="priority-category"
                                    type="number"
                                    value={values.priority}
                                    name="priority"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    placeholder="Enter priority"
                                    fullWidth
                                    error={Boolean(touched.priority && errors.priority)}
                                />
                                {touched.priority && errors.priority && (
                                    <FormHelperText error id="standard-weight-helper-text-priority-category">
                                        {errors.priority}
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
                                    color={state === "update" ? "primary" : "error"}
                                >
                                    {state === "update" ? "Submit update" : "Submit delete"}
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

export default CategoryViewer;