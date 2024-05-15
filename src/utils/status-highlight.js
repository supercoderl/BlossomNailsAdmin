export const statusColor = (value) => {
    let color = "";
    switch (value) {
        case "Booked":
            color = "#009fe3";
            break;
        default:
            color = "#feba02";
            break;
    }
    return color;
};