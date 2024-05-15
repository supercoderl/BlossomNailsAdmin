import { useEffect, useState } from "react";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, FormGroup, Menu, Typography } from "../../../../node_modules/@mui/material/index";
import axiosInstance from "config/axios";

const UserFilter = ({ open, anchorEl, setAnchorEl, filterObject, setFilterObject, onSubmit }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [roles, setRoles] = useState([]);

    const handleCancel = () => {
        setOpenDialog(false);
    }

    const getRoles = async () => {
        await axiosInstance.get("Role/roles").then((response) => {
            const result = response.data;
            if (!result) return;
            else if (result.status && result.data) setRoles(result.data);
        }).catch((error) => console.log(error));
    }

    useEffect(() => {
        getRoles();
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
                        Status
                    </Typography>
                    <Divider />
                    <FormGroup sx={{ flexDirection: "row", paddingBottom: 1 }}>
                        <FormControlLabel
                            control={<Checkbox checked={filterObject.status === "activated"} />}
                            label="Activated"
                            onChange={e => setFilterObject({ ...filterObject, status: e.target.checked ? "activated" : null })}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={filterObject.status === "disabled"} />}
                            label="Disabled"
                            onChange={e => {
                                setFilterObject({ ...filterObject, status: e.target.checked ? "disabled" : null });
                            }}
                        />
                    </FormGroup>
                    <Typography variant="subheading">
                        Role
                    </Typography>
                    <Divider />
                    <FormGroup sx={{ flexDirection: "row" }}>
                        {
                            roles && roles.length > 0 ?
                                roles.map((role, index) => {
                                    return (
                                        <FormControlLabel
                                            key={index}
                                            control={<Checkbox checked={filterObject.role === role.name} />}
                                            label={role.name}
                                            onChange={e => setFilterObject({ ...filterObject, role: e.target.checked ? role.name : null })}
                                        />
                                    )
                                })
                                :
                                <Typography variant="body2">Loading...</Typography>
                        }
                    </FormGroup>
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

export default UserFilter;