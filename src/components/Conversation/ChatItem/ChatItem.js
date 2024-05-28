import { Avatar, Box, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from "../../../../node_modules/@mui/material/index"
import axiosInstance from "config/axios";
import { useEffect, useState } from "react";
import { getRandomImageUrl } from "utils/random";
import { images } from "models/images";

export const ChatItem = (props) => {
    const { room, handleOpenMessage, connection, user } = props;
    const [latestMessage, setLatestMessage] = useState(null);
    const avatar = getRandomImageUrl(images);

    const getLatestMessage = async () => {
        await axiosInstance.get("Chat/get-message", { params: { roomID: room?.id, wannaLatestMessage: true } }).then((response) => {
            const result = response.data;
            if (!result) return;
            else if (result.success && result.data) {
                setLatestMessage(result.data);
            }
        }).catch((error) => console.log(error));
    }

    const updateReadMessage = async () => {
        if (room) {
            await axiosInstance.put(`Chat/update-read-message/${room?.id}`).then((response) => {
                const result = response.data;
                if (!result) return;
                else if (result.success) getLatestMessage();
            }).catch((error) => console.log(error));
        }
    }

    const onClick = () => {
        handleOpenMessage(room?.id);
        updateReadMessage();
    }

    useEffect(() => {
        getLatestMessage();
        connection.on("ReceiveMessageChat", getLatestMessage);
    }, []);

    return (
        <ListItemButton sx={{ p: 0 }} onClick={onClick}>
            <ListItem>
                <ListItemAvatar>
                    <Avatar src={avatar} />
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography
                                noWrap
                                sx={{ overflow: "hidden", textOverflow: "ellipsis", fontWeight: "bold" }}
                            >
                                {room?.userID ? room?.userID.split("-")[0] : "Anonymous"}
                            </Typography>
                            {
                                latestMessage?.status === "Sent" &&
                                latestMessage?.userID !== user?.userID &&
                                <Box width={8} height={8} backgroundColor="green" borderRadius="50%"></Box>}
                        </Box>
                    }
                    secondary={
                        <Typography
                            noWrap
                            sx={{
                                overflow: "hidden", textOverflow: "ellipsis", color:
                                    latestMessage?.status === "Sent" && latestMessage?.userID !== user?.userID ? "black" : "#A9A9AC"
                            }}
                        >
                            {latestMessage?.message || "N/A"}
                        </Typography>
                    }
                />
            </ListItem>
        </ListItemButton>
    )
}