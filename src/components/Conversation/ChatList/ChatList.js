import { Box, List, OutlinedInput, Typography } from "../../../../node_modules/@mui/material/index";
import { SearchOutlined, } from "@ant-design/icons";
import { ChatItem } from "../ChatItem/ChatItem";
import { useState } from "react";

export const ChatList = (props) => {
    const { rooms, onGet, handleOpenMessage, connection, user } = props;
    const [search, setSearch] = useState("");

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Box sx={{ p: "0.75rem" }}>
                <OutlinedInput
                    startAdornment={
                        <SearchOutlined />
                    }
                    placeholder="Search..."
                    size="small"
                    value={search}
                    fullWidth
                    onChange={(e) => {
                        onGet(e.target.value);
                        setSearch(e.target.value);
                    }}
                />
            </Box>
            {
                rooms && rooms.length > 0 ?
                    rooms.map((room, index) => {
                        return (
                            <ChatItem
                                key={index}
                                room={room}
                                user={user}
                                handleOpenMessage={handleOpenMessage}
                                connection={connection}
                            />
                        )
                    })
                    :
                    <Typography variant="body1" sx={{ textAlign: "center" }}>Loading conversation...</Typography>
            }
        </List>
    )
}