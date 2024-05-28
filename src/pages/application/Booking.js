import MainCard from "components/MainCard"
import { Box, Button, Link, Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Typography, Drawer, OutlinedInput, IconButton, Tooltip } from "../../../node_modules/@mui/material/index";
import { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { CalendarOutlined, SearchOutlined, CloseCircleOutlined, FilterOutlined, CaretDownOutlined, SortDescendingOutlined, SortAscendingOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import CustomTableHead from "components/Table/CustomTableHead";
import axiosInstance from "config/axios";
import TableRowsLoader from "components/Table/TableRowsSkeleton";
import { toast } from "react-toastify";
import { formatCurrency } from "utils/currency";
import { dateFormatterV1 } from "utils/date";
import Invoice from "components/Invoice";
import { useNavigate } from "react-router-dom";
import BookingFilter from "./booking-forms/BookingFilter";
import MenuExport from "components/MenuExport";
import MenuSort from "components/MenuSort";
import moment from "moment";

const headCells = [
    {
        id: 'bookingID',
        align: 'center',
        disablePadding: false,
        label: 'ID'
    },
    {
        id: 'customerName',
        align: 'left',
        disablePadding: true,
        label: 'Customer'
    },
    {
        id: 'customerPhone',
        align: 'left',
        disablePadding: true,
        label: 'Phone'
    },
    {
        id: 'customerEmail',
        align: 'left',
        disablePadding: true,
        label: 'Email'
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
    const [searchText, setSearchText] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();
    const [anchorElExport, setAnchorElExport] = useState(null);
    const [anchorElSort, setAnchorElSort] = useState(null);
    const [anchorElFilter, setAnchorElFilter] = useState(null);
    const [filterObject, setFilterObject] = useState({
        bookingDateFrom: null,
        bookingDateTo: null,
        priceMin: 0,
        priceMax: null
    });
    const [sort, setSort] = useState({
        sortType: null,
        sortFrom: "descending"
    });
    const openMenuExport = Boolean(anchorElExport);
    const openMenuSort = Boolean(anchorElSort);
    const openFilter = Boolean(anchorElFilter);

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
        await axiosInstance.get("Booking/bookings", {
            params:
            {
                ...sort,
                searchText,
                bookingDateFrom: filterObject.bookingDateFrom && moment(filterObject.bookingDateFrom).format("DD-MM-YYYY"),
                bookingDateTo: filterObject.bookingDateTo && moment(filterObject.bookingDateTo).format("DD-MM-YYYY"),
                priceMin: filterObject.priceMin,
                priceMax: filterObject.priceMax
            }
        }).then((response) => {
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
    }, [sort]);

    return (
        <>
            <MainCard title="Booking list">
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <OutlinedInput
                            startAdornment={<SearchOutlined onClick={getBookings} />}
                            endAdornment={
                                searchText != "" ?
                                    <IconButton edge="end" onClick={() => setSearchText("")}>
                                        <CloseCircleOutlined />
                                    </IconButton>
                                    :
                                    null
                            }
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            placeholder="Search booking.."
                            size="small"
                            onKeyPress={event => {
                                event.key === 'Enter' && getBookings();
                            }}
                        />
                        <Button variant="outlined" startIcon={<FilterOutlined />} sx={{
                            '.MuiButton-startIcon > *:nth-of-type(1)': {
                                fontSize: 14
                            }
                        }} onClick={(e) => setAnchorElFilter(e.currentTarget)}>
                            Filter
                        </Button>
                        <Button variant="outlined" endIcon={<CaretDownOutlined />} sx={{
                            '.MuiButton-endIcon > *:nth-of-type(1)': {
                                fontSize: 14
                            }
                        }} onClick={(e) => setAnchorElSort(e.currentTarget)}>
                            Sort by
                        </Button>
                        {
                            sort.sortFrom === "descending"
                                ?
                                <IconButton onClick={() => {
                                    setSort({ ...sort, sortFrom: "ascending" });
                                }}>
                                    <SortDescendingOutlined />
                                </IconButton>
                                :
                                <IconButton onClick={() => {
                                    setSort({ ...sort, sortFrom: "descending" });
                                }}>
                                    <SortAscendingOutlined />
                                </IconButton>
                        }
                    </Box>
                    <Box>
                        <Tooltip title="Calendar">
                            <IconButton onClick={handleClickCalendar}>
                                <CalendarOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Reload">
                            <IconButton onClick={() => {
                                getBookings();
                                setSort({ ...sort, sortType: null });
                            }}>
                                <ReloadOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Export">
                            <IconButton onClick={(e) => setAnchorElExport(e.currentTarget)}>
                                <ExportOutlined />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
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
            <BookingFilter
                open={openFilter}
                setAnchorEl={setAnchorElFilter}
                anchorEl={anchorElFilter}
                filterObject={filterObject}
                setFilterObject={setFilterObject}
                onSubmit={getBookings}
            />
            <MenuExport open={openMenuExport} setAnchorEl={setAnchorElExport} anchorEl={anchorElExport} exportObject="booking" />
            <MenuSort
                open={openMenuSort}
                setAnchorEl={setAnchorElSort}
                anchorEl={anchorElSort}
                cols={headCells.filter(h => h.id !== "userID" && h.id !== "actions")}
                sort={sort}
                setSort={setSort}
            />
        </>
    );
};

const BookingRowItem = ({ booking, index }) => {
    const [nailTechnician, setNailTechnician] = useState(null);
    const [openDrawer, setOpenDrawer] = useState(false);

    const handleOpen = () => {
        setOpenDrawer(true);
    };

    const handleClose = () => {
        setOpenDrawer(false);
    };

    const getNailTechnicianByID = async (userID) => {
        if (userID) {
            await axiosInstance.get(`User/user-by-id/${userID}`).then((response) => {
                const result = response.data;
                if (result && result.success) setNailTechnician(result.data);
            }).catch((error) => console.log(error));
        }
    };

    useEffect(() => {
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
                <TableCell align="left">{booking?.customerName || 'N/A'}</TableCell>
                <TableCell align="left">{booking?.customerPhone || 'N/A'}</TableCell>
                <TableCell align="left">{booking?.customerEmail || 'N/A'}</TableCell>
                <TableCell align="center">{dateFormatterV1(booking.bookingDate)}</TableCell>
                <TableCell align="right">{formatCurrency(booking.totalCost)}</TableCell>
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
                <Invoice booking={booking} nailTechnician={nailTechnician} />
            </Drawer>
        </>
    )
};

export default Booking;