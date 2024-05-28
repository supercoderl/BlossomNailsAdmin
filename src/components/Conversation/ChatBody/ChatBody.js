import { SendOutlined, } from "@ant-design/icons";
import { Avatar, Button, Typography } from "../../../../node_modules/@mui/material/index";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "config/axios";
import { getRandomImageUrl } from "utils/random";
import { images } from "models/images";

const ChatBody = ({ room, user, connection }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const ref = useChatScroll(messages);
    const avatar = getRandomImageUrl(images);

    const getMessageByRoom = async () => {
        await axiosInstance.get("Chat/get-message-by-room", { params: { roomID: room } }).then(async (response) => {
            const result = response.data;
            if (!result) return;
            else if (result.data && result.data.length > 0) {
                setMessages(result.data);
            }
        }).catch((error) => console.log(error));
    }

    const sendMessage = async () => {
        if (!message || message === "") return;
        await connection.invoke("SendMessage", message);
        setMessage("");
    }

    const connectRoom = async () => {
        connection.on("ReceiveMessageChat", (message) => {
            setMessages((messages) => [...messages, message]);
        });
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    };

    useEffect(() => {
        if (room) {
            getMessageByRoom();
        }
    }, [room]);

    useEffect(() => {
        if (connection) {
            connectRoom();
        }
    }, [connection]);

    function useChatScroll(dep) {
        const ref = useRef();
        useEffect(() => {
            if (ref.current) {
                ref.current.scrollTop = ref.current.scrollHeight;
            }
        }, [dep]);
        return ref;
    }

    return (
        <main>
            <div className="title">Room: #{room}</div>
            <div className="message-wrap" ref={ref}>
                <div className="text-box-sender">
                    {
                        messages && messages.length > 0 &&
                        messages.map((item, index) => {
                            const showAvatar = index === 0 || messages[index - 1].userID !== item.userID;
                            return (
                                <div key={index} className={item.userID !== user?.userID ? "senderSays" : "userSays"}>
                                    {
                                        item.userID !== user?.userID ? showAvatar ?
                                            <Avatar src={avatar} />
                                            :
                                            <div style={{ width: 40, height: 40 }} />
                                            :
                                            null
                                    }

                                    <div className="text">
                                        <Typography variant="h6">{item?.message}</Typography>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <footer>
                <form>
                    <input
                        placeholder='Enter a message'
                        type='text'
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <Button
                        variant="contained"
                        color="error"
                        className="send"
                        onClick={sendMessage}
                    >
                        Send
                        <SendOutlined />
                    </Button>
                </form>
            </footer>
        </main>
    )
}

export default ChatBody;