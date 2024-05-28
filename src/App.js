// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';
import 'react-toastify/dist/ReactToastify.css';
import "App.css";
import { ToastContainer } from "react-toastify";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '../node_modules/@microsoft/signalr/dist/esm/HubConnectionBuilder';
import { LogLevel } from '../node_modules/@microsoft/signalr/dist/esm/ILogger';
import { HubConnectionState } from '../node_modules/@microsoft/signalr/dist/esm/HubConnection';
// import notiSound from "./assets/sounds/short1.mp3";
// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
  const [connection, setConnection] = useState(null);
  const [hasNotification, setHasNotification] = useState(false);
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  // const [audio] = useState(new Audio(notiSound));

  useEffect(() => {
    const connection = new HubConnectionBuilder().withUrl(`${process.env.REACT_APP_URL_API}/notify`).withAutomaticReconnect().configureLogging(LogLevel.Information).build();

    setConnection(connection);

    //Start connection
    const startConnection = async () => {
      try {
        if (connection.state === HubConnectionState.Disconnected) {
          await connection.start();
          console.log('SignalR Connected.');
        } else {
          console.log(`Cannot start connection because it is in the '${connection.state}' state.`);
        }
      } catch (err) {
        console.error('SignalR connection error:', err);
        setTimeout(startConnection, 5000); // Try to reconnect in 5 seconds
      }
    };

    connection.onclose(async () => {
      console.log('SignalR connection closed. Attempting to reconnect...');
      setTimeout(startConnection, 5000); // Try to reconnect in 5 seconds
    });

    startConnection();

    connection.on("ReceiveMessageChatForConsultant", (message) => {
      if (message.userID !== user?.userID) {
        setHasNotification(true);
        // audio.play();
      }
    });

    return () => {
      connection.stop()
        .then(() => console.log('SignalR Disconnected.'))
        .catch((error) => console.error('Error while stopping SignalR connection:', error));
    };
  }, []);

  useEffect(() => {
    const originalTitle = document.title;
    let interval;

    if (hasNotification) {
      interval = setInterval(() => {
        document.title = document.title === 'You have new message 🔔!' ? originalTitle : 'You have new message 🔔!';
      }, 1500); // Thay đổi tiêu đề mỗi 1 giây
    } else {
      document.title = originalTitle;
    }

    return () => {
      clearInterval(interval);
      document.title = originalTitle; // Đặt lại tiêu đề gốc khi component unmount
    };
  }, [hasNotification]);

  return (
    <ThemeCustomization>
      <ToastContainer />
      <ScrollTop>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Routes connection={connection} setHasNotification={setHasNotification} />
        </LocalizationProvider>
      </ScrollTop>
    </ThemeCustomization>
  )
};

export default App;
