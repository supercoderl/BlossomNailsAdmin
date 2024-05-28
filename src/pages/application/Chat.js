import { useEffect, useState } from "react";
import axiosInstance from "config/axios";
// import { getFirstLetter, getFirstName } from "utils/text";
import { ChatList } from "components/Conversation/ChatList/ChatList";
import ChatBody from "components/Conversation/ChatBody/ChatBody";
// import { toast } from "react-toastify";

const Chat = ({ connection, setHasNotification }) => {
    const [rooms, setRooms] = useState([]);
    const [roomSelected, setRoomSelected] = useState(null);
    const [user] = useState(JSON.parse(localStorage.getItem("user")));

    useEffect(() => {
        getRooms();
        setHasNotification(false);
        if (connection) {
            connection.on("ReceiveMessageChatForConsultant", (message) => {
                getRooms();
                if (rooms && rooms.length > 0) {
                    setRooms((prevRooms) => {
                        const roomIndex = prevRooms.findIndex(room => room.id === message.roomID);
                        if (roomIndex > -1) {
                            const updatedRooms = [...prevRooms];
                            const [room] = updatedRooms.splice(roomIndex, 1);
                            updatedRooms.unshift(room);
                            return updatedRooms;
                        }
                        return prevRooms;
                    });
                }
            });
        }
    }, []);

    const getRooms = async () => {
        await axiosInstance.get("Chat/get-all-rooms").then((response) => {
            const result = response.data;
            if (!result) return;
            else if (result.success && result.data) {
                setRooms(result.data);
            }
        }).catch((error) => console.log("Get rooms: ", error));
    }

    const handleOpenMessage = async (roomID) => {
        setRoomSelected(roomID);
        await connection.invoke("JoinRoomChatCustomer", { userID: user.userID, roomID });
    }

    return (
        <div className='container'>
            <div className='inbox'>
                <aside>
                    <div className="title">Messages</div>
                    <ChatList
                        rooms={rooms}
                        onGet={getRooms}
                        user={user}
                        handleOpenMessage={handleOpenMessage}
                        connection={connection}
                    />
                </aside>
                <ChatBody
                    room={roomSelected}
                    user={user}
                    connection={connection}
                />
            </div>
        </div>
    )
}

export default Chat;