import { useState } from "react";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControlLabel, Menu, Typography } from "../../../../node_modules/@mui/material/index";

const CategoryFilter = ({ open, anchorEl, setAnchorEl, filterObject, setFilterObject, onSubmit }) => {
    const [openDialog, setOpenDialog] = useState(false);

    const handleCancel = () => {
        setOpenDialog(false);
    }

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

export default CategoryFilter;