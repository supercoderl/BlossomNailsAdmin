import * as Yup from 'yup';
import { Formik } from 'formik';
import axiosInstance from 'config/axios';
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Select, MenuItem } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { toast } from 'react-toastify';
import { TabContext, TabList, TabPanel } from '../../../../node_modules/@mui/lab/index';
import { Box, Tab } from '../../../../node_modules/@mui/material/index';
import { useEffect, useState } from 'react';
import ServiceUploader from './ServiceUploader';

const ServiceViewer = ({ service, state, resetPage }) => {
    const [value, setValue] = useState('1');
    const [categories, setCategories] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getCategories = async () => {
        await axiosInstance.get("Category/categories").then((response) => {
            const result = response.data;
            if (result && result.success) {
                setCategories(result.data);
            }
            else toast.error(result.message);
        }).catch((error) => console.log(error))
    };

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange}>
                        <Tab label={`Service: #${service?.serviceID || 0}`} value="1" />
                        <Tab label="Images" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1" sx={{ p: 0.5 }}>
                    <Formik
                        initialValues={{
                            serviceID: service?.serviceID || "",
                            name: service?.name || "",
                            description: service?.description || "",
                            categoryID: service?.categoryID || null,
                            price: service?.price || 0,
                            workingTime: service?.workingTime || "",
                            representativeImage: service?.representativeImage || ""
                        }}
                        validationSchema={Yup.object().shape({
                            name: Yup.string().required('Service name cannot be empty!'),
                            price: Yup.number().required('Price cannot be empty!'),
                            workingTime: Yup.string().required('Service must have time to perform!'),
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            try {
                                setStatus({ success: false });
                                setSubmitting(true);
                                if (state === "update") {
                                    await axiosInstance.put(`Service/update-service/${values.serviceID}`, values).then((response) => {
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
                                    await axiosInstance.delete(`Service/delete-service/${values.serviceID}`, values).then((response) => {
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
                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="name-service">Service name</InputLabel>
                                            <OutlinedInput
                                                id="name-service"
                                                type="text"
                                                value={values.name}
                                                name="name"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Enter service name"
                                                fullWidth
                                                error={Boolean(touched.name && errors.name)}
                                            />
                                            {touched.name && errors.name && (
                                                <FormHelperText error id="standard-weight-helper-text-name-service">
                                                    {errors.name}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="price-service">Price</InputLabel>
                                            <OutlinedInput
                                                id="price-service"
                                                type="number"
                                                value={values.price}
                                                name="price"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Enter price"
                                                fullWidth
                                                error={Boolean(touched.price && errors.price)}
                                            />
                                            {touched.price && errors.price && (
                                                <FormHelperText error id="standard-weight-helper-text-price-service">
                                                    {errors.price}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="category-service">Category</InputLabel>
                                            <Select
                                                labelId="category-service"
                                                id="category-service"
                                                value={values.categoryID}
                                                onBlur={handleBlur}
                                                name="categoryID"
                                                onChange={handleChange}
                                                placeholder="Select one"
                                                fullWidth
                                                error={Boolean(touched.categoryID && errors.categoryID)}
                                            >
                                                {
                                                    categories && categories.length > 0 ?
                                                        categories.map((item, index) => {
                                                            return (
                                                                <MenuItem value={item.categoryID} key={index}>{item.name}</MenuItem>
                                                            )
                                                        })
                                                        :
                                                        null
                                                }
                                            </Select>
                                            {touched.categoryID && errors.categoryID && (
                                                <FormHelperText error id="standard-weight-helper-text-category-service">
                                                    {errors.categoryID}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="time-service">Period time</InputLabel>
                                            <OutlinedInput
                                                id="time-service"
                                                type="text"
                                                value={values.workingTime}
                                                name="time"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Enter period time"
                                                fullWidth
                                                error={Boolean(touched.workingTime && errors.workingTime)}
                                            />
                                            {touched.workingTime && errors.workingTime && (
                                                <FormHelperText error id="standard-weight-helper-text-time-service">
                                                    {errors.workingTime}
                                                </FormHelperText>
                                            )}
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="description-service">Description</InputLabel>
                                            <OutlinedInput
                                                id="description-service"
                                                type="text"
                                                value={values.description}
                                                name="description"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder="Enter any text"
                                                fullWidth
                                                rows={4}
                                                multiline
                                                error={Boolean(touched.description && errors.description)}
                                            />
                                            {touched.description && errors.description && (
                                                <FormHelperText error id="standard-weight-helper-text-description-service">
                                                    {errors.description}
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
                </TabPanel>
                <TabPanel value="2">
                    <ServiceUploader serviceID={service?.serviceID} />
                </TabPanel>
            </TabContext>
        </>
    )
}

export default ServiceViewer;