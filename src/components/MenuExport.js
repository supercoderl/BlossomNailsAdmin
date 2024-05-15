import axiosInstance from "config/axios";
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList } from "../../node_modules/@mui/material/index"
import { FileWordOutlined, ExportOutlined, FilePdfOutlined, FileImageOutlined, FileExcelOutlined, FileTextOutlined, PythonOutlined, Html5Outlined, FileJpgOutlined } from "@ant-design/icons";

const MenuExport = ({ open, anchorEl, setAnchorEl, exportObject }) => {

    const handleExport = async (exportType) => {
        switch (exportType) {
            case "xlsx":
                await axiosInstance.post(`File/export-excel?type=${exportObject}`, { responseType: "blob" }).then((response) => {
                    var result = response.data;
                    if (!result) return;
                    else if(result.status && result.data) {
                        const binaryString = window.atob(result.data?.data);
                        const len = binaryString.length;
                        const bytes = new Uint8Array(len);
                        for (let i = 0; i < len; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(bytes);
                        const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = result.data.filename;
                        a.click();
                        window.URL.revokeObjectURL(url);
                        a.remove();
                    }
                }).catch((error) => console.log(error));
                break;
        }
    }

    return (
        <Menu
            id="menu-export"
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
        >
            <MenuList sx={{ width: 180, maxWidth: '100%' }}>
                <MenuItem>
                    <ListItemIcon>
                        <FileWordOutlined />
                    </ListItemIcon>
                    <ListItemText>Word</ListItemText>
                    <ListItemIcon>
                        <ExportOutlined />
                    </ListItemIcon>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <FilePdfOutlined />
                    </ListItemIcon>
                    <ListItemText>Pdf</ListItemText>
                    <ListItemIcon>
                        <ExportOutlined />
                    </ListItemIcon>
                </MenuItem>
                <Divider />
                <MenuItem>
                    <ListItemIcon>
                        <FileImageOutlined />
                    </ListItemIcon>
                    <ListItemText>Png</ListItemText>
                    <ListItemIcon>
                        <ExportOutlined />
                    </ListItemIcon>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <FileJpgOutlined />
                    </ListItemIcon>
                    <ListItemText>Jpg</ListItemText>
                    <ListItemIcon>
                        <ExportOutlined />
                    </ListItemIcon>
                </MenuItem>
                <Divider />
                <MenuItem>
                    <ListItemIcon>
                        <FileTextOutlined />
                    </ListItemIcon>
                    <ListItemText>Csv</ListItemText>
                    <ListItemIcon>
                        <ExportOutlined />
                    </ListItemIcon>
                </MenuItem>
                <MenuItem onClick={() => handleExport("xlsx")}>
                    <ListItemIcon>
                        <FileExcelOutlined />
                    </ListItemIcon>
                    <ListItemText>Xlsx</ListItemText>
                    <ListItemIcon>
                        <ExportOutlined />
                    </ListItemIcon>
                </MenuItem>
                <Divider />
                <MenuItem>
                    <ListItemIcon>
                        <PythonOutlined />
                    </ListItemIcon>
                    <ListItemText>Python</ListItemText>
                    <ListItemIcon>
                        <ExportOutlined />
                    </ListItemIcon>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <Html5Outlined />
                    </ListItemIcon>
                    <ListItemText>Html</ListItemText>
                    <ListItemIcon>
                        <ExportOutlined />
                    </ListItemIcon>
                </MenuItem>
            </MenuList>
        </Menu>
    )
}

export default MenuExport;