import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Button, Dialog, DialogActions, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '../../../../node_modules/@mui/material/index';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { useEffect, useState } from 'react';
import { dateFormatterV2 } from 'utils/date';
import axiosInstance from 'config/axios';
import { FormOutlined, CloseOutlined } from "@ant-design/icons";
import { toast } from 'react-toastify';
import { statusColor } from 'utils/status-highlight';

const localizer = momentLocalizer(moment)
const NailCalendar = () => {
    const [nailTechnicians, setNailTechnicians] = useState([]);
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [openEvent, setOpenEvent] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [event, setEvent] = useState({
        bookingID: 0,
        title: "",
        desc: "",
        start: new Date,
        end: new Date,
        status: "",
        clickedEvent: {}
    });

    const handleClose = () => {
        setOpenEvent(false);
        setEvent({
            bookingID: 0,
            title: "",
            desc: "",
            status: "",
            start: new Date,
            end: new Date,
            clickedEvent: {}
        })
    }

    const handleEventSelected = (event) => {
        setOpenEvent(true);
        setEvent({
            bookingID: event.bookingID,
            clickedEvent: event,
            start: event.start,
            end: event.end,
            status: event.status,
            title: event.title,
            desc: event.desc
        });
    }

    const handleSubmit = async () => {
        const id = toast.loading("Please wait...");
        if (bookings.length <= 0) {
            toast.update(id, { render: "Bookings are empty!", type: "error", isLoading: false, autoClose: 2000 });
            return;
        }
        const booking = bookings.find(booking => booking.bookingID === event.bookingID);
        const body = {
            bookingID: event.bookingID,
            nailTechnicianID: event.title,
            status: booking.status,
            totalCost: booking.totalCost,
            bookingDate: booking.bookingDate,
            startTime: booking.startTime,
            endTime: booking.endTime,
            notes: booking.notes
        }
        await axiosInstance.put(`Booking/update-booking/${body.bookingID}`, body).then((response) => {
            const result = response.data;
            if (!result) return;
            else if (result.status && result.data) {
                toast.update(id, { render: result.message, type: "success", isLoading: false, autoClose: 2000 });
                getBookings();
            }
            else toast.update(id, { render: result.message, type: "error", isLoading: false, autoClose: 2000 });
        }).catch((error) => toast.update(id, { render: error, type: "error", isLoading: false, autoClose: 2000 }));
    }

    const getBookings = async () => {
        const id = toast.loading("Searching bookings...");
        await axiosInstance.get("Booking/bookings").then(async (response) => {
            const result = response.data;
            if (!result) return;
            else if (result.status && result.data && result.data.length > 0) {
                setBookings(result.data);
                const customers = await axiosInstance.get("User/users");
                if (!customers.data || !customers.data.data) return;
                setNailTechnicians(customers.data.data);
                const newEvents = await Promise.all(result.data.map(async booking => {
                    const serviceBookings = await axiosInstance.get(`Booking/services-in-booking/${booking.bookingID}`);
                    if (!serviceBookings.data || !serviceBookings.data.data) return;
                    else if (serviceBookings.data.data.length > 0 && customers.data.data.length > 0) {
                        return {
                            bookingID: booking.bookingID,
                            title: booking.nailTechnicianID,
                            status: booking.status,
                            desc: `Customer: ${customers.data.data.find(n => n.userID === booking.customerID)?.lastname + " " + customers.data.data.find(n => n.userID === booking.customerID)?.firstname} \nService: ${serviceBookings.data.data?.map(x => x.service?.name).join(", ")} \nNote: ${booking?.notes || ""}`,
                            start: moment(booking.bookingDate + ' ' + booking.startTime, 'YYYY-MM-DD HH:mm:ss').toDate(),
                            end: moment(booking.bookingDate + ' ' + booking.endTime, 'YYYY-MM-DD HH:mm:ss').toDate()
                        };
                    }
                    return null;
                }));

                const filteredEvents = newEvents.filter(event => event !== null);
                setEvents([...events, ...filteredEvents]);
            }
        }).catch((error) => console.log("Calendar: ", error)).finally(() => setTimeout(() => toast.update(id, { render: "Search finish!", type: "success", isLoading: false, autoClose: 2000 }), 2000));
    }

    useEffect(() => {
        getBookings();
    }, []);

    return (
        <>
            <Calendar
                events={events}
                localizer={localizer}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                views={["day", "week"]}
                defaultView="week"
                longPressThreshold={10}
                selectable={true}
                onSelectEvent={event => handleEventSelected(event)}
                eventPropGetter={(a) => {
                    return { style: { backgroundColor: statusColor(a.status) } }
                }}
                step={7.5}
                min={
                    new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate(),
                        9
                    )
                }
                max={
                    new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate(),
                        18
                    )
                }
            />
            <Dialog
                modal="false"
                open={openEvent}
                onClose={handleClose}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle sx={{ fontSize: 18, textAlign: "center" }}>View/Edit Booking of {dateFormatterV2(event.start)}</DialogTitle>
                <Box sx={{ paddingInline: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                        <FormControl variant="standard" sx={{ flex: 1 }}>
                            <InputLabel id="title-label">Employee</InputLabel>
                            <Select
                                labelId="title-label"
                                id="title-standard"
                                value={event.title}
                                disabled={!isEditing}
                                onChange={e => {
                                    setEvent(
                                        {
                                            ...event,
                                            title: e.target.value
                                        });
                                    setIsEditing(false);
                                }}
                                label="Employee"
                            >
                                {
                                    nailTechnicians && nailTechnicians.length > 0 ?
                                        nailTechnicians.filter(n => n.roles.includes("Employee")).map((n, index) => {
                                            return (
                                                <MenuItem key={index} value={n.userID}>{n.lastname + " " + n.firstname}</MenuItem>
                                            )
                                        })
                                        :
                                        null
                                }
                            </Select>
                        </FormControl>
                        {
                            isEditing ?
                                <CloseOutlined onClick={() => setIsEditing(false)} style={{ fontSize: '150%', marginLeft: 10 }} />
                                :
                                <FormOutlined onClick={() => setIsEditing(true)} style={{ fontSize: '150%', marginLeft: 10 }} />
                        }
                    </Box>
                    <TextField
                        label="Description"
                        variant="standard"
                        multiline
                        value={event.desc}
                        readOnly
                    />
                    <MobileTimePicker
                        label="Start time"
                        minutesStep={5}
                        value={moment(event.start)}
                        onChange={date => setEvent({ ...event, start: date._d })}
                        slotProps={{ textField: { variant: 'standard', sx: { marginTop: 2 } } }}
                    />
                    <MobileTimePicker
                        label="End time"
                        minutesStep={5}
                        value={moment(event.end)}
                        onChange={date => setEvent({ ...event, end: date._d })}
                        slotProps={{ textField: { variant: 'standard', sx: { marginTop: 2 } } }}
                    />
                </Box>
                <DialogActions>
                    <Button onClick={handleClose} color="info" sx={{ fontSize: 16 }}>Cancle</Button>
                    <Button onClick={handleClose} color="error" sx={{ fontSize: 16 }}>Delete</Button>
                    <Button onClick={handleSubmit} autoFocus sx={{ fontSize: 16 }}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default NailCalendar;