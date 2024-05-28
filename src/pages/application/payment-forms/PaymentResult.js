import MainCard from "components/MainCard";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography } from "../../../../node_modules/@mui/material/index";
import { FontAwesomeIcon } from "../../../../node_modules/@fortawesome/react-fontawesome/index";
import { faCalendar } from "../../../../node_modules/@fortawesome/free-solid-svg-icons/index";
import { convertStringToDate } from "utils/date";

const PaymentResult = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [result, setResult] = useState({
        vnpAmount: null,
        vnpBankCode: null,
        vnpCardType: null,
        vnpOrderInfo: null,
        vnpPayDate: null,
        vnpResponseCode: null,
        vnpTmnCode: null,
        vnpTransactionNo: null,
        vnpTransactionStatus: null,
        vnpTxnRef: null,
        vnpSecureHash: null
    })

    useEffect(() => {
        if (queryParams && queryParams.size > 0) {
            setResult({
                ...result,
                vnpAmount: queryParams.get('vnp_Amount'),
                vnpBankCode: queryParams.get('vnp_BankCode'),
                vnpCardType: queryParams.get('vnp_CardType'),
                vnpOrderInfo: queryParams.get('vnp_OrderInfo'),
                vnpPayDate: queryParams.get('vnp_PayDate'),
                vnpResponseCode: queryParams.get('vnp_ResponseCode'),
                vnpTmnCode: queryParams.get('vnp_TmnCode'),
                vnpTransactionNo: queryParams.get('vnp_TransactionNo'),
                vnpTransactionStatus: queryParams.get('vnp_TransactionStatus'),
                vnpTxnRef: queryParams.get('vnp_TxnRef'),
                vnpSecureHash: queryParams.get('vnp_SecureHash')
            })
        }
    }, []);

    return (
        <>
            <MainCard title="Payment result">
                <Box
                    background="white"
                    overflow="hidden"
                    boxShadow="0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
                    display="flex"
                    flexDirection="column"
                    width={422}
                    sx={{ borderRadius: 2 }}
                    margin="auto"
                >
                    <Box
                        width="100%"
                        paddingInline={6}
                        paddingBlock={1.25}
                        backgroundColor={result.vnpResponseCode == "00" && result.vnpTransactionStatus == "00" ? "rgb(38 162 220)" : "rgb(220 38 38)"}
                        display="inline-flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Typography fontSize={14} color="white" textAlign="center" fontWeight={500} lineHeight={1.25}>
                            {
                                result.vnpResponseCode == "00" && result.vnpTransactionStatus == "00" ?
                                    "Payment status: transaction successfully"
                                    :
                                    `Payment status: transaction error - code: ${result?.vnpResponseCode}`
                            }
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        paddingInline={2}
                        paddingTop={2}
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box
                            display="flex"
                            flexDirection="column"
                            gap={1}
                        >
                            <Typography variant="h5">Payment amount</Typography>
                            <Typography color="rgb(163 163 163)">Terminal ID</Typography>
                            <Typography color="rgb(163 163 163)">Transaction ID</Typography>
                            <Typography color="rgb(163 163 163)">Transaction bank</Typography>
                        </Box>
                        <Box
                            display="flex"
                            flexDirection="column"
                            gap={1}
                        >
                            <Typography variant="h5" textAlign="right">{result.vnpAmount} VND</Typography>
                            <Typography color="rgb(163 163 163)" textAlign="right">#{result.vnpTmnCode}</Typography>
                            <Typography color="rgb(163 163 163)" textAlign="right">{result.vnpTxnRef}</Typography>
                            <Typography color="rgb(163 163 163)" textAlign="right">{result.vnpBankCode}</Typography>
                        </Box>
                    </Box>
                    <Box
                        marginBlock={1}
                        paddingInline={2}
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        display="inline-flex"
                    >
                        <Box
                            paddingInline={1.5}
                            paddingBlock={0.5}
                            color={result.vnpResponseCode == "00" && result.vnpTransactionStatus == "00" ? "rgb(38 207 255)" : "rgb(255 38 38)"}
                            backgroundColor={result.vnpResponseCode == "00" && result.vnpTransactionStatus == "00" ? "rgb(68 178 239 / 0.1)" : "rgb(239 68 68 / 0.1)"}
                            sx={{ borderRadius: 1.5 }}
                        >
                            {
                                result.vnpResponseCode == "00" && result.vnpTransactionStatus == "00" ?
                                    "succeeded"
                                    :
                                    "failed"
                            }
                        </Box>
                    </Box>
                    <Box
                        marginTop={2}
                        paddingInline={2}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Box
                            display="flex"
                            gap={1}
                            alignItems="center"
                        >
                            <FontAwesomeIcon icon={faCalendar} color="rgb(220 38 38)" />
                            <Typography color="rgb(220 38 38)">{convertStringToDate(result?.vnpPayDate, "YYYYMMDDHHmmss", "YYYY-MM-DD HH:mm:ss")}</Typography>
                        </Box>
                    </Box>
                    <Box
                        width="100%"
                        paddingInline={2}
                        marginBlock={2}
                    >
                        <Box
                            border="1px solid rgb(243 244 246)"
                            sx={{ borderStyle: "dashed" }}
                        ></Box>
                    </Box>
                </Box>
            </MainCard>
        </>
    )
}

export default PaymentResult;