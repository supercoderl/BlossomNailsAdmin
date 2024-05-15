import MainCard from "components/MainCard"
import { Box, IconButton, Link, Table, OutlinedInput, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Tooltip, Typography, Button, } from "../../../node_modules/@mui/material/index";
import { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, CaretDownOutlined, SortAscendingOutlined, CloseCircleOutlined, ReloadOutlined, ExportOutlined, SortDescendingOutlined, FilterOutlined } from '@ant-design/icons';
import CustomTableHead from "components/Table/CustomTableHead";
import axiosInstance from "config/axios";
import TableRowsLoader from "components/Table/TableRowsSkeleton";
import { toast } from "react-toastify";
import { formatCurrency } from "utils/currency";
import ModalCustom from "components/Modal/Modal";
import { dateFormatterV1 } from "utils/date";
import ServiceCreator from "./service-forms/ServiceCreator";
import ServiceViewer from "./service-forms/ServiceViewer";
import MenuExport from "components/MenuExport";
import MenuSort from "components/MenuSort";
import ServiceFilter from "./service-forms/ServiceFilter";

const headCells = [
    {
        id: 'serviceID',
        align: 'center',
        disablePadding: false,
        label: 'ID'
    },
    {
        id: 'name',
        align: 'left',
        disablePadding: true,
        label: 'Service name'
    },
    {
        id: 'price',
        align: 'right',
        disablePadding: false,
        label: 'Price'
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

const Service = () => {
    const [page, setPage] = useState(0);
    const [order] = useState('asc');
    const [orderBy] = useState('userID');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [service, setService] = useState(null);
    const [state, setState] = useState("update");
    const [searchText, setSearchText] = useState(null);
    const [anchorElExport, setAnchorElExport] = useState(null);
    const [anchorElSort, setAnchorElSort] = useState(null);
    const [anchorElFilter, setAnchorElFilter] = useState(null);
    const [filterObject, setFilterObject] = useState({
        workingTimeFrom: null,
        workingTimeTo: null,
        priceMin: 0,
        priceMax: null,
        categoryID: null
    });
    const [sort, setSort] = useState({
        sortType: null,
        sortFrom: "descending"
    });
    const openMenuExport = Boolean(anchorElExport);
    const openMenuSort = Boolean(anchorElSort);
    const openFilter = Boolean(anchorElFilter);

    const handleOpen = (item, state) => {
        setOpenModal(true);
        setState(state);
        setService(item);
    };

    const handleClose = () => {
        setOpenModal(false);
        setService(null);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getServices = async () => {
        setLoading(true);
        await axiosInstance.get(`Service/services`, { params: { ...filterObject, ...sort, searchText } }).then((response) => {
            const result = response.data;
            if (result && result.success) {
                toast.success(result.message);
                setServices(result.data);
            }
            else toast.error(result.message);
        }).catch((error) => console.log(error)).finally(() => setTimeout(() => setLoading(false), 2000));
    }

    useEffect(() => {
        getServices();
    }, []);

    return (
        <>
            <MainCard title="Service list">
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            startAdornment={<SearchOutlined onClick={getServices} />}
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
                            placeholder="Search service.."
                            size="small"
                            onKeyPress={event => {
                                event.key === 'Enter' && getServices();
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
                                    getServices();
                                }}>
                                    <SortDescendingOutlined />
                                </IconButton>
                                :
                                <IconButton onClick={() => {
                                    setSort({ ...sort, sortFrom: "descending" });
                                    getServices();
                                }}>
                                    <SortAscendingOutlined />
                                </IconButton>
                        }
                    </Box>
                    <Box>
                        <Tooltip title="Create new">
                            <IconButton onClick={() => handleOpen(null, "create")}>
                                <PlusOutlined />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Reload">
                            <IconButton onClick={() => {
                                getServices();
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
                                    services && services.length > 0 ?
                                        (rowsPerPage > 0
                                            ? services.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : services
                                        ).map((row, index) => (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                tabIndex={-1}
                                                key={row.productID}
                                            >
                                                <TableCell component="th" scope="row" align="center">
                                                    <Link color="secondary" component={RouterLink} to="">
                                                        {index + 1}
                                                    </Link>
                                                </TableCell>
                                                <TableCell align="left">{row.name}</TableCell>
                                                <TableCell align="right">{formatCurrency(row.price)}</TableCell>
                                                <TableCell align="center">{dateFormatterV1(row.updatedAt)}</TableCell>
                                                <TableCell align="center">
                                                    <Box>
                                                        <Tooltip title="Update" placement="top">
                                                            <IconButton aria-label="edit" onClick={() => handleOpen(row, "update")}>
                                                                <EditOutlined />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete" placement="top" onClick={() => handleOpen(row, "delete")}>
                                                            <IconButton aria-label="delete">
                                                                <DeleteOutlined />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
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
                                    count={services.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'Services per page',
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
                {
                    state === "create" ?
                        <ServiceCreator resetPage={() => { getServices(); handleClose(); }} />
                        :
                        <ServiceViewer service={service} state={state} resetPage={() => { getServices(); handleClose(); }} />
                }
            </ModalCustom>
            <ServiceFilter
                open={openFilter}
                setAnchorEl={setAnchorElFilter}
                anchorEl={anchorElFilter}
                filterObject={filterObject}
                setFilterObject={setFilterObject}
                onSubmit={getServices}
            />
            <MenuExport open={openMenuExport} setAnchorEl={setAnchorElExport} anchorEl={anchorElExport} exportObject="service" />
            <MenuSort
                open={openMenuSort}
                setAnchorEl={setAnchorElSort}
                anchorEl={anchorElSort}
                cols={headCells.filter(h => h.id !== "serviceID" && h.id !== "actions")}
                sort={sort}
                setSort={setSort}
            />
        </>
    )
}

export default Service;