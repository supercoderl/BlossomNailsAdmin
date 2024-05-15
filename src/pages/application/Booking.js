import MainCard from "components/MainCard"
import { Box, Button, Grid, Link, Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Typography, Drawer } from "../../../node_modules/@mui/material/index";
import { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { CalendarOutlined } from '@ant-design/icons';
import CustomTableHead from "components/Table/CustomTableHead";
import axiosInstance from "config/axios";
import TableRowsLoader from "components/Table/TableRowsSkeleton";
import { toast } from "react-toastify";
import { formatCurrency } from "utils/currency";
import { dateFormatterV1 } from "utils/date";
import Invoice from "components/Invoice";
import { useNavigate } from "react-router-dom";

const headCells = [
    {
        id: 'bookingID',
        align: 'center',
        disablePadding: false,
        label: 'ID'
    },
    {
        id: 'name',
        align: 'left',
        disablePadding: true,
        label: 'Customer'
    },
    {
        id: 'bookingDate',
        align: 'center',
        disablePadding: false,
        label: 'Booking date'
    },
    {
        id: 'totalCost',
        align: 'right',
        disablePadding: false,
        label: 'Total cost'
    },
    {
        id: 'updatedAt',
        align: 'center',
        disablePadding: false,
        label: 'Updated time'
    },
    {
        id: 'actions',
        align: 'center',
        disablePadding: false,
        label: 'Actions'
    },
];

const Booking = () => {
    const [page, setPage] = useState(0);
    const [order] = useState('asc');
    const [orderBy] = useState('userID');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClickCalendar = () => {
        navigate("/application/booking/calendar", { state: { bookings } });
    }

    const getBookings = async () => {
        setLoading(true);
        await axiosInstance.get("Booking/bookings").then((response) => {
            const result = response.data;
            if (result && result.success) {
                toast.success(result.message);
                setBookings(result.data);
            }
            else toast.error(result.message);
        }).catch((error) => console.log(error)).finally(() => setTimeout(() => setLoading(false), 2000));
    }

    useEffect(() => {
        getBookings();
    }, []);

    return (
        <>
            <MainCard title="Booking list">
                <Grid container justifyContent="flex-end">
                    <Button variant="outlined" color="success" onClick={handleClickCalendar}>
                        <CalendarOutlined />
                        <Typography sx={{ ml: 0.5 }}>Calendar</Typography>
                    </Button>
                </Grid>
                <TableContainer
                    sx={{
                        width: '100%',
                        overflowX: 'auto',
                        position: 'relative',
                        display: 'block',
                        maxWidth: '100%',
                        '& td, & th': { whiteSpace: 'nowrap' }
                    }}
                >
                    <Table
                        aria-labelledby="tableTitle"
                        sx={{
                            '& .MuiTableCell-root:first-of-type': {
                                pl: 2
                            },
                            '& .MuiTableCell-root:last-of-type': {
                                pr: 3
                            }
                        }}
                    >
                        <CustomTableHead headCells={headCells} order={order} orderBy={orderBy} />
                        <TableBody>
                            {
                                loading ?
                                    <TableRowsLoader rowsNum={rowsPerPage} colsNum={headCells.length - 1} />
                                    :
                                    bookings && bookings.length > 0 ?
                                        (rowsPerPage > 0
                                            ? bookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : bookings
                                        ).map((row, index) => (
                                            <BookingRowItem booking={row} index={index} key={index} />
                                        ))
                                        :
                                        <TableRow>
                                            <TableCell colSpan={headCells.length}>
                                                <Typography variant="body2" align="center">Data is empty</Typography>
                                            </TableCell>
                                        </TableRow>
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={headCells.length}
                                    count={bookings.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'Bookings per page',
                                        },
                                        native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </MainCard>
        </>
    )
}

const BookingRowItem = ({ booking, index}) => {
    const [relateLoading, setRelateLoading] = useState(false);
    const [customer, setCustomer] = useState(null);
    const [nailTechnician, setNailTechnician] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);

    const handleOpen = () => {
        setOpenDrawer(true);
    };

    const handleClose = () => {
        setOpenDrawer(false);
    }

    const getCustomerByID = async (userID) => {
        setRelateLoading(true);
        await axiosInstance.get(`User/user-by-id/${userID}`).then((response) => {
            const result = response.data;
            if (result && result.success) {
                setCustomer(result.data);
            }
        }).catch((error) => console.log(error)).finally(() => setTimeout(() => setRelateLoading(false), 2000));
    }

    const getNailTechnicianByID = async (userID) => {
        setRelateLoading(true);
        await axiosInstance.get(`User/user-by-id/${userID}`).then((response) => {
            const result = response.data;
            if (result && result.success) {
                setNailTechnician(result.data);
            }
        }).catch((error) => console.log(error)).finally(() => setTimeout(() => setRelateLoading(false), 2000));
    }

    useEffect(() => {
        getCustomerByID(booking.customerID);
        getNailTechnicianByID(booking.nailTechnicianID);
    }, []);

    return (
        <>
            <TableRow
                hover
                role="checkbox"
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                tabIndex={-1}
                key={booking.bookingID}
            >
                <TableCell component="th" scope="row" align="center">
                    <Link color="secondary" component={RouterLink} to="">
                        {index + 1}
                    </Link>
                </TableCell>
                <TableCell align="left">{relateLoading ? "Loading..." : customer ? customer.lastname + " " + customer.firstname : 'N/A'}</TableCell>
                <TableCell align="center">{dateFormatterV1(booking.bookingDate)}</TableCell>
                <TableCell align="right">{formatCurrency(booking.totalCost)}</TableCell>
                <TableCell align="center">{dateFormatterV1(booking.updatedAt)}</TableCell>
                <TableCell align="center">
                    <Box>
                        <Button onClick={handleOpen}>View details</Button>
                    </Box>
                </TableCell>
            </TableRow>
            <Drawer
                anchor="right"
                open={openDrawer}
                onClose={handleClose}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: 500,
                        paddingTop: 8,
                        boxSizing: "border-box",
                        paddingInline: 1
                    }
                }}
            >
                <Invoice booking={booking} customer={customer} nailTechnician={nailTechnician} />
            </Drawer>
        </>
    )
}

export default Booking;