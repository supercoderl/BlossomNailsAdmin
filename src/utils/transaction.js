export const payError = (code) => {
    let msg = "";
    switch (code) {
        case "00":
            msg = "Transaction successfully";
            break;
        case "07":
            msg = "Deduct money successfully. Suspected transaction (related to fraud, unusual transactions).";
            break;
        case "09":
            msg = "Customer's card/account has not registered for InternetBanking service at the bank.";
            break;
        case "10":
            msg = "Customers verify incorrect card/account information more than 3 times";
            break;
        case "11":
            msg = "Payment deadline has expired. Please retry the transaction.";
            break;
        case "12":
            msg = "Customer's card/account is locked.";
            break;
        case "13":
            msg = "You entered the wrong transaction authentication password (OTP). Please retry the transaction.";
            break;
        case "14":
            msg = "Customer cancled transaction.";
            break;
        case "51":
            msg = "Your account does not have enough balance to make a transaction.";
            break;
        case "65":
            msg = "Your account has exceeded the daily transaction limit.";
            break;
        case "75":
            msg = "The payment bank is under maintenance.";
            break;
        case "79":
            msg = "The customer enters the wrong payment password more than the specified number of times. Please retry the transaction.";
            break;
        default:
            msg = "Something went wrong!";
            break;
    }
    return msg;
};

export const queryError = (code) => {
    let msg = "";
    switch (code)
    {
        case "02":
            msg = "Invalid merchant.";
            break;
        case "03":
            msg = "The data sent is not in the correct format.";
            break;
        case "91":
            msg = "The requested transaction was not found";
            break;
        case "94":
            msg = "Duplicate request within API time limit (Limited to 5 minutes)";
            break;
        case "97":
            msg = "Invalid signature.";
            break;
        default:
            msg = "Something went wrong!";
            break;
    }
    return msg;
}

export const refundError = (code) => {
    let msg = "";
    switch(code)
    {
        case "02":
            msg = "The total repayment amount is greater than the principal amount.";
            break;
        case "03":
            msg = "The data sent is not in the correct format";
            break;
        case "04":
            msg = "Full refunds are not allowed after a partial refund";
            break;
        case "13":
            msg = "Only partial refunds are allowed";
            break;
        case "91":
            msg = "No refund request transaction found";
            break;
        case "93":
            msg = "Invalid refund amount. The refund amount must be less than or equal to the payment amount.";
            break;
        case "94":
            msg = "Duplicate request within API time limit (Limited to 5 minutes)";
            break;
        case "95":
            msg = "This transaction was not successful on VNPAY. VNPAY refuses to process the request.";
            break;
        case "97":
            msg = "Invalid signature.";
            break;
        case "98":
            msg = "Timeout Exception.";
            break;
        default:
            msg = "Something went wrong!";
            break;
    }
    return msg;
}