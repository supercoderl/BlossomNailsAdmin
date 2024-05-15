import { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Menu, MenuItem, Select, Slider, TextField, Typography } from "../../../../node_modules/@mui/material/index";
import { MinusOutlined } from "@ant-design/icons";
import axiosInstance from "config/axios";

const ServiceFilter = ({ open, anchorEl, setAnchorEl, filterObject, setFilterObject, onSubmit }) => {
    const [value, setValue] = useState([0, 1000]);
    const [categories, setCategories] = useState([]);
    const [categoryID, setCategoryID] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const minDistance = 10;

    const handleCancel = () => {
        setOpenDialog(false);
    }

    const handleChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setValue([Math.min(newValue[0], value[1] - minDistance), value[1]]);
            setFilterObject({ ...filterObject, priceMin: Math.min(newValue[0], value[1] - minDistance) });
        } else {
            setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
            setFilterObject({ ...filterObject, priceMax: Math.max(newValue[1], value[0] + minDistance) });
        }
    };

    function valuetext(value) {
        return `${value}°C`;
    }

    const getCategories = async () => {
        await axiosInstance.get("Category/categories").then((response) => {
            const result = response.data;
            if (!result) return;
            else if (result.status && result.data) setCategories(result.data);
        }).catch((error) => console.log("Service filter - get categories: ", error));
    }

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <>
            <Menu
                id="menu-filter"
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
            >
                <Box sx={{ width: 400, padding: 2 }}>
                    <Typography variant="subheading">
                        Time to do
                    </Typography>
                    <Divider />
                    <Box display="flex" gap={1} alignItems="center" py={1.5}>
                        <TextField label="From" variant="outlined" type="number" onChange={e => setFilterObject({ ...filterObject, workingTimeFrom: e.target.value.toString() })} />
                        <MinusOutlined />
                        <TextField label="To" variant="outlined" type="number" onChange={e => setFilterObject({ ...filterObject, workingTimeTo: e.target.value.toString() })} />
                    </Box>
                    <Typography variant="subheading">
                        Price
                    </Typography>
                    <Divider />
                    <Box display="flex" gap={1} alignItems="center" py={1.5}>
                        <TextField label="Min" value={value[0]} variant="outlined" readOnly />
                        <MinusOutlined />
                        <TextField label="Max" value={value[1]} variant="outlined" readOnly />
                    </Box>
                    <Slider
                        getAriaLabel={() => 'Minimum distance'}
                        value={value}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        disableSwap
                        max={1000}
                    />
                    <Typography variant="subheading">
                        Category
                    </Typography>
                    <Divider />
                    <Select
                        id="category-standard"
                        value={categoryID}
                        sx={{ width: "100%", my: 1.5 }}
                        onChange={e => {
                            setCategoryID(e.target.value);
                            setFilterObject({ ...filterObject, categoryID: e.target.value });
                        }}
                    >
                        <MenuItem value={0} readOnly>Select one</MenuItem>
                        {
                            categories && categories.length > 0 ?
                                categories.map((c, index) => {
                                    return (
                                        <MenuItem key={index} value={c.categoryID}>{c.name}</MenuItem>
                                    )
                                })
                                :
                                null
                        }
                    </Select>
                    <Box display="flex" justifyContent="space-evenly" pt={3}>
                        <Button onClick={() => {
                            setFilterObject({
                                workingTimeFrom: null,
                                workingTimeTo: null,
                                priceMin: 0,
                                priceMax: null,
                                categoryID: null
                            });
                            setOpenDialog(true);
                        }}>
                            Remove condition
                        </Button>
                        <Button variant="contained" onClick={() => {
                            onSubmit();
                            setAnchorEl(null);
                        }}>
                            Refine your search
                        </Button>
                    </Box>
                </Box>
            </Menu>
            <Dialog
                open={openDialog}
                onClose={handleCancel}
            >
                <DialogTitle>Remove filter</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your filter will be removed. Are you sure?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={() => {
                        onSubmit();
                        setAnchorEl(null);
                        handleCancel();
                    }}>Accept</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ServiceFilter;