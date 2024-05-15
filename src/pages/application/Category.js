import MainCard from "components/MainCard"
import { Box, Button, Chip, IconButton, Link, OutlinedInput, Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Tooltip, Typography, } from "../../../node_modules/@mui/material/index";
import { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, CaretDownOutlined, SortAscendingOutlined, CloseCircleOutlined, ReloadOutlined, ExportOutlined, SortDescendingOutlined, FilterOutlined } from '@ant-design/icons';
import CustomTableHead from "components/Table/CustomTableHead";
import axiosInstance from "config/axios";
import TableRowsLoader from "components/Table/TableRowsSkeleton";
import { toast } from "react-toastify";
import ModalCustom from "components/Modal/Modal";
import { dateFormatterV1 } from "utils/date";
import CategoryCreator from "./category-form/CategoryCreator";
import CategoryViewer from "./category-form/CategoryViewer";
import MenuExport from "components/MenuExport";
import MenuSort from "components/MenuSort";
import CategoryFilter from "./category-form/CategoryFilter";

const headCells = [
    {
        id: 'categoryID',
        align: 'center',
        disablePadding: false,
        label: 'ID'
    },
    {
        id: 'name',
        align: 'left',
        disablePadding: true,
        label: 'Category name'
    },
    {
        id: 'status',
        align: 'center',
        disablePadding: false,
        label: 'Status'
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

const Category = () => {
    const [page, setPage] = useState(0);
    const [order] = useState('asc');
    const [orderBy] = useState('userID');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [category, setCategory] = useState(null);
    const [state, setState] = useState("update");
    const [searchText, setSearchText] = useState(null);
    const [anchorElExport, setAnchorElExport] = useState(null);
    const [anchorElSort, setAnchorElSort] = useState(null);
    const [anchorElFilter, setAnchorElFilter] = useState(null);
    const [filterObject, setFilterObject] = useState({
        status: null
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
        setCategory(item);
    };

    const handleClose = () => {
        setOpenModal(false);
        setCategory(null);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getCategories = async () => {
        setLoading(true);
        await axiosInstance.get("Category/categories", { params: { ...filterObject, ...sort, searchText } }).then((response) => {
            const result = response.data;
            if (result && result.success) {
                toast.success(result.message);
                setCategories(result.data);
            }
            else toast.error(result.message);
        }).catch((error) => console.log(error)).finally(() => setTimeout(() => setLoading(false), 2000));
    }

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <>
            <MainCard title="Category list">
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            startAdornment={<SearchOutlined onClick={getCategories} />}
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
                            placeholder="Search category.."
                            size="small"
                            onKeyPress={event => {
                                event.key === 'Enter' && getCategories();
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
                                    getCategories();
                                }}>
                                    <SortDescendingOutlined />
                                </IconButton>
                                :
                                <IconButton onClick={() => {
                                    setSort({ ...sort, sortFrom: "descending" });
                                    getCategories();
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
                                getCategories();
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
                                    categories && categories.length > 0
                                        ?
                                        (rowsPerPage > 0
                                            ? categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : categories
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
                                                <TableCell align="center">
                                                    <Chip
                                                        label={row.isActive ? "Active" : "Disable"}
                                                        color={row.isActive ? "success" : "error"}
                                                    />
                                                </TableCell>
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
                                                <Typography align="center" variant="body2">Data is empty</Typography>
                                            </TableCell>
                                        </TableRow>
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={headCells.length}
                                    count={categories?.length || 0}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'Categories per page',
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
            <ModalCustom open={openModal} handleClose={handleClose} width={400}>
                {
                    state === "create" ?
                        <CategoryCreator resetPage={() => { getCategories(); handleClose(); }} />
                        :
                        <CategoryViewer category={category} state={state} resetPage={getCategories} />
                }
            </ModalCustom>
            <CategoryFilter
                open={openFilter}
                setAnchorEl={setAnchorElFilter}
                anchorEl={anchorElFilter}
                filterObject={filterObject}
                setFilterObject={setFilterObject}
                onSubmit={getCategories}
            />
            <MenuExport open={openMenuExport} setAnchorEl={setAnchorElExport} anchorEl={anchorElExport} exportObject="category" />
            <MenuSort
                open={openMenuSort}
                setAnchorEl={setAnchorElSort}
                anchorEl={anchorElSort}
                cols={headCells.filter(h => h.id !== "categoryID" && h.id !== "actions")}
                sort={sort}
                setSort={setSort}
            />
        </>
    )
}

export default Category;