import MainCard from "components/MainCard";
import { FontAwesomeIcon } from "../../../node_modules/@fortawesome/react-fontawesome/index";
import { faCcVisa } from "../../../node_modules/@fortawesome/free-brands-svg-icons/index";
import "./payment-forms/css/payment.css";
import { faBuildingColumns, faCreditCard } from "../../../node_modules/@fortawesome/free-solid-svg-icons/index";
import { Box, Button, OutlinedInput, Typography } from "../../../node_modules/@mui/material/index";
import ReactFlagsSelect from 'react-flags-select';
import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "config/axios";

const Payment = () => {
    const [loading, setLoading] = useState(false);
    const [payment, setPayment] = useState("bank");
    const [language, setLanguage] = useState("VN");
    const [money, setMoney] = useState(0);

    const handleCheckout = async () => {
        setLoading(true);
        if (!money || money === 0) {
            toast.error("Please enter money");
            return;
        }
        const body = {
            bankcode_Vnpayqr: false,
            bankcode_Vnbank: payment === "bank",
            bankcode_Intcard: payment === "global",
            locale_Vn: language === "VN",
            locale_En: language === "GB",
            money: money
        }

        await axiosInstance.post("Payment", body).then((response) => {
            const result = response.data;
            if (!result) return;
            else if (result && result.success) {
                window.location.href = result.data.paymentUrl;
            }
            else toast.error(result.message);
        }).catch((error) => console.log(error)).finally(() => setTimeout(() => setLoading(false), 300));
    }

    return (
        <>
            <MainCard title="Booking list">
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="h5">Choose a payment method for: </Typography>
                        <OutlinedInput
                            endAdornment={"₫"}
                            size="small"
                            type="number"
                            value={money}
                            onChange={e => setMoney(Number(e.target.value))}
                        />
                    </Box>
                    <Button variant="contained" onClick={handleCheckout}>
                        {
                            loading ?
                                <LoadingOutlined style={{ fontSize: 24.5 }} />
                                :
                                "Submit"
                        }
                    </Button>
                </Box>
                <Box display="flex" alignItems="center" gap={1} marginTop={2}>
                    <Typography variant="h5">Language: </Typography>
                    <ReactFlagsSelect
                        countries={["GB", "VN"]}
                        selectedSize={14}
                        optionsSize={14}
                        onSelect={e => setLanguage(e)}
                        defaultCountry={language}
                        customLabels={{ "GB": "English", "VN": "Vietnamese" }}
                        showSelectedLabel
                        placeholder="Select a language"
                        selected={language}
                    />
                </Box>
                <article className="card">
                    <div className="card-body">
                        <div className="payment-type">
                            <div className="types">
                                <div
                                    className={`type ${payment === "bank" && "selected"}`}
                                    onClick={() => setPayment("bank")}
                                    onKeyDown={() => setPayment("bank")}
                                    role="presentation"
                                >
                                    <div className="logo">
                                        <FontAwesomeIcon icon={faBuildingColumns} />
                                    </div>
                                    <div className="text">
                                        <p>Domestic bank account</p>
                                    </div>
                                </div>
                                <div
                                    className={`type ${payment === "global" && "selected"}`}
                                    onClick={() => setPayment("global")}
                                    onKeyDown={() => setPayment("global")}
                                    role="presentation"
                                >
                                    <div className="logo">
                                        <FontAwesomeIcon icon={faCcVisa} />
                                    </div>
                                    <div className="text">
                                        <p>Visa, Master card, etc.</p>
                                    </div>
                                </div>
                                <div
                                    className={`type ${payment === "vnpay" && "selected"}`}
                                    onClick={() => setPayment("vnpay")}
                                    onKeyDown={() => setPayment("vnpay")}
                                    role="presentation"
                                >
                                    <div className="logo">
                                        <FontAwesomeIcon icon={faCreditCard} />
                                    </div>
                                    <div className="text">
                                        <p>Payment gateway - VNPAY</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </MainCard >
        </>
    )
}

export default Payment;