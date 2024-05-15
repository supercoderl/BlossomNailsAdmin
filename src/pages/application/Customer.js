import MainCard from "components/MainCard"
import { Box, IconButton, Link, Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Tooltip, } from "../../../node_modules/@mui/material/index";
import { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CustomTableHead from "components/Table/CustomTableHead";
import axiosInstance from "config/axios";
import TableRowsLoader from "components/Table/TableRowsSkeleton";
import { toast } from "react-toastify";
import ModalCustom from "components/Modal/Modal";
import CustomerViewer from "./customer-forms/CustomerViewer";

const headCells = [
    {
        id: 'customerID',
        align: 'center',
        disablePadding: false,
        label: 'ID'
    },
    {
        id: 'name',
        align: 'left',
        disablePadding: true,
        label: 'Customer name'
    },
    {
        id: 'phone',
        align: 'right',
        disablePadding: false,
        label: 'Phone number'
    },
    {
        id: 'actions',
        align: 'center',
        disablePadding: false,
        label: 'Actions'
    },
];

const Customer = () => {
    const [page, setPage] = useState(0);
    const [order] = useState('asc');
    const [orderBy] = useState('customerID');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [user, setUser] = useState(null);
    const [state, setState] = useState("update");

    const handleOpen = (item, state) => {
        setOpenModal(true);
        setState(state);
        setUser(item);
    };

    const handleClose = () => {
        setOpenModal(false);
        setUser(null);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getUsers = async () => {
        setLoading(true);
        await axiosInstance.get("User/users").then((response) => {
            const result = response.data;
            if (result && result.success) {
                toast.success(result.message);
                setUsers(result.data);
            }
            else toast.error(result.message);
        }).catch((error) => console.log(error)).finally(() => setTimeout(() => setLoading(false), 2000));
    }

    useEffect(() => {
        getUsers();
    }, []);


    return (
        <>
            <MainCard title="Customer list">
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
                        aria-labelledby="tableTitle sticky"
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
                                    (rowsPerPage > 0
                                        ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : users
                                    ).map((row, index) => (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            tabIndex={-1}
                                            key={row.userID}
                                        >
                                            <TableCell component="th" scope="row" align="center">
                                                <Link color="secondary" component={RouterLink} to="">
                                                    {index + 1}
                                                </Link>
                                            </TableCell>
                                            <TableCell align="left">{row.lastname + " " + row.firstname}</TableCell>
                                            <TableCell align="right">{"0" + row.phone}</TableCell>
                                            <TableCell align="center">
                                                <Box>
                                                    <Tooltip title="Update" placement="top">
                                                        <IconButton aria-label="edit" onClick={() => handleOpen(row, "update")}>
                                                            <EditOutlined />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete" placement="top">
                                                        <IconButton aria-label="delete" onClick={() => handleOpen(row, "delete")}>
                                                            <DeleteOutlined />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'Tất cả', value: -1 }]}
                                    colSpan={headCells.length}
                                    count={users.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'Customers per page',
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
            <ModalCustom open={openModal} handleClose={handleClose} width={600}>
                <CustomerViewer customer={user} state={state} resetPage={getUsers} />
            </ModalCustom>
        </>
    )
}

export default Customer;