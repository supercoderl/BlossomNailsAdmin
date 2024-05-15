
import {
    PictureOutlined,
    CloseCircleOutlined,
    FilterOutlined,
    CaretDownOutlined,
    SortDescendingOutlined,
    SortAscendingOutlined,
    ReloadOutlined,
    SearchOutlined,
    DeleteOutlined,
    LoadingOutlined
} from "@ant-design/icons";
import "./gallery-forms.js/css/gallery.css";
import { Box, Button, IconButton, OutlinedInput, Tooltip } from "../../../node_modules/@mui/material/index";
import { useEffect, useState } from "react";
import MainCard from "components/MainCard";
import { toast } from "react-toastify";
import axiosInstance from "config/axios";
import { checkImageURL } from "utils/text";

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState(null);
    const [anchorElSort, setAnchorElSort] = useState(null);
    const [sort, setSort] = useState({
        sortType: null,
        sortFrom: "descending"
    });

    const openMenuSort = Boolean(anchorElSort);
    console.log(openMenuSort);

    const getImages = async () => {
        setLoading(true);
        await axiosInstance.get(`ServiceImage/images`).then((response) => {
            const result = response.data;
            if (result && result.success) {
                setImages(result.data);
            }
            else console.log(result.message);
        }).catch((error) => console.log(error)).finally(() => setTimeout(() => setLoading(false), 600));
    }

    useEffect(() => {
        getImages();
    }, []);

    const onDeleteImage = async (imageID) => {
        await axiosInstance.delete(`ServiceImage/image/${imageID}`).then((response) => {
            const result = response.data;
            if (!result) return;
            else if (result.success) {
                toast.success(result.message);
                getImages();
            }
            else toast.error(result.message);
        }).catch((error) => console.log(error));
    }

    const onUploadImage = async (event) => {
        const id = toast.loading("Vui lòng chờ...")
        const body = {
            imageName: event.target.files[0].name.split('.').shift(),
        };

        const formData = new FormData();
        formData.append('file', event.target.files[0]);

        await axiosInstance
            .post('ServiceImage/upload-image', formData, { params: body, headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response) => {
                const result = response.data;
                if (!result) return;
                else if (result.success) {
                    toast.update(id, { render: result.message, type: "success", isLoading: false, autoClose: 2000 });
                    getImages();
                }
                else toast.update(id, { render: result.message, type: "error", isLoading: false, autoClose: 2000 });
            })
            .catch((error) => {
                toast.update(id, { render: result.message, type: "error", isLoading: false, autoClose: 2000 });
                console.log(error)
            });
    };

    return (
        <>
            <MainCard title="Galleries">
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <OutlinedInput
                            startAdornment={<SearchOutlined />}
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
                            placeholder="Search image.."
                            size="small"
                        // onKeyPress={event => {
                        //     event.key === 'Enter' && getUsers();
                        // }}
                        />
                        <Button variant="outlined" startIcon={<FilterOutlined />} sx={{
                            '.MuiButton-startIcon > *:nth-of-type(1)': {
                                fontSize: 14
                            }
                        }}>
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
                        <Tooltip title="Reload">
                            <IconButton onClick={() => {
                                setSort({ ...sort, sortType: null });
                                getImages();
                            }}>
                                <ReloadOutlined />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box >

                <div className="uploader-container">
                    <div className="image-list">
                        <div className="uploader">
                            <input id="file-upload" type="file" name="fileUpload" accept="image/*" onChange={onUploadImage} />

                            <label htmlFor="file-upload" id="file-drag">
                                <img id="file-image" src="#" alt="Preview" className="hidden" />
                                <div id="start">
                                    <PictureOutlined style={{ fontSize: "300%" }} />
                                </div>
                                <div id="response" className="hidden">
                                    <div id="messages"></div>
                                    <progress className="progress" id="file-progress" value="0">
                                        <span>0</span>%
                                    </progress>
                                </div>
                            </label>
                        </div>
                        {
                            loading ?
                                <div className="uploader">
                                    <input id="file-upload" type="file" name="fileUpload" accept="image/*" onChange={onUploadImage} />

                                    <label htmlFor="file-upload" id="file-drag">
                                        <img id="file-image" src="#" alt="Preview" className="hidden" />
                                        <div id="start">
                                            <LoadingOutlined style={{ fontSize: "300%" }} />
                                        </div>
                                        <div id="response" className="hidden">
                                            <div id="messages"></div>
                                            <progress className="progress" id="file-progress" value="0">
                                                <span>0</span>%
                                            </progress>
                                        </div>
                                    </label>
                                </div>
                                :
                                images && images.length > 0 ?
                                    images.map((item, index) => {
                                        return (
                                            <div className="uploader" key={index}>
                                                <IconButton
                                                    className="action-container"
                                                    onClick={() => onDeleteImage(item.imageID)}
                                                >
                                                    <DeleteOutlined />
                                                </IconButton>
                                                <div className="image-container">
                                                    <img src={checkImageURL(item.imageURL)} alt="Preview" />
                                                </div>
                                            </div>
                                        )
                                    })
                                    :
                                    null
                        }
                    </div>
                </div>
            </MainCard>
        </>
    )
}

export default Gallery;