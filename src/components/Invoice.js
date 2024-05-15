import { dateFormatterV2 } from "utils/date";
import { ThemeProvider, Box, Typography, Button, createTheme, Divider } from "../../node_modules/@mui/material/index";
import { FilePdfOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import axiosInstance from "config/axios";
import { formatCurrency } from "utils/currency";

const theme = createTheme({
    typography: {
        fontFamily: 'PT Mono',
    },
});

const Invoice = ({ booking, customer, nailTechnician }) => {
    const [serviceBookings, setServiceBookings] = useState([]);

    const getServiceBookings = async () => {
        await axiosInstance.get(`Booking/services-in-booking/${booking.bookingID}`).then((response) => {
            const result = response.data;
            if (!result) return;
            else if (result.status && result.data) setServiceBookings(result.data);
        }).catch((error) => console.log(error));
    }

    useEffect(() => {
        getServiceBookings();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ padding: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: 28, fontFamily: "PT Mono" }}>invoice</Typography>
                    <img src="https://blossom-nails.web.app/static/media/logo3.c742be5ecb2e71b630f7.png" width={200} alt="Logo" />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBlock: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "45%" }}>
                        <Box>
                            <Typography sx={{ textTransform: "uppercase" }} variant="body2">Invoice no</Typography>
                            <Typography sx={{ textTransform: "uppercase" }} variant="body2">Invoice date</Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                            <Typography variant="body2"># {booking.bookingID}</Typography>
                            <Typography variant="body2">{dateFormatterV2(new Date())}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "45%" }}>
                        <Box>
                            <Typography variant="body2">BOOKING NO</Typography>
                            <Typography sx={{ textTransform: "uppercase" }} variant="body2">Due date</Typography>
                        </Box>
                        <Box sx={{ width: 100, textAlign: "right", overflow: "hidden" }}>
                            <Typography variant="body2">{dateFormatterV2(booking.bookingDate, "DDMM/YYYY")}</Typography>
                            <Typography variant="body2">{dateFormatterV2(booking.bookingDate)}</Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider />

                <Box sx={{ display: "flex", justifyContent: "space-between", paddingBlock: 2 }}>
                    <Box sx={{ width: "45%" }}>
                        <Typography sx={{ textTransform: "uppercase" }} variant="body2">From</Typography>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", overflowWrap: "break-word" }}>
                            <Typography variant="body2">Blossom Nails</Typography>
                            <Typography variant="body2">8c wells place SO50 5PP Eastleigh, UK</Typography>
                        </div>
                    </Box>
                    <Box sx={{ width: "45%" }}>
                        <Typography variant="body2">TO</Typography>
                        <Typography variant="body2">{customer.lastname + " " + customer.firstname}</Typography>
                        <Typography variant="body2">{"+84" + customer.phone}</Typography>
                    </Box>
                </Box>

                <Divider />

                <table id="myTable">
                    <thead>
                        <tr>
                            <th width="10%" align="center">No</th>
                            <th width="40%" align="left">Service</th>
                            <th width="35%">Nail technician</th>
                            <th width="15%">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            serviceBookings && serviceBookings.length > 0 ?
                                serviceBookings.map((item, index) => {
                                    console.log(item);
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.service?.name}</td>
                                            <td>{nailTechnician.firstname}</td>
                                            <td>{formatCurrency(item.serviceCost)}</td>
                                        </tr>
                                    )
                                })
                                :
                                null
                        }
                    </tbody>
                </table>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3, paddingBlock: 2 }}>
                    <Box>
                        <Typography>Subtotal</Typography>
                        <Typography>Tax</Typography>
                    </Box>
                    <Box sx={{ width: 100, textAlign: "right" }}>
                        <Typography>{formatCurrency(booking.totalCost)}</Typography>
                        <Typography>{formatCurrency(0)}</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: "3px solid", paddingBlock: 0.5, paddingInline: 1 }}>
                    <Typography sx={{ textTransform: "uppercase" }} variant="h6">Total</Typography>
                    <Typography variant="h6">{formatCurrency(booking.totalCost)}</Typography>
                </Box>

                <Button variant="contained" color="warning" sx={{ float: "right", mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
                    <FilePdfOutlined />
                    <Typography sx={{ textTransform: "capitalize" }}>Print</Typography>
                </Button>
            </Box>
        </ThemeProvider>
    )
}

export default Invoice;