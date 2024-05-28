// assets
import { 
    TeamOutlined, 
    CommentOutlined, 
    CreditCardOutlined,
    MailOutlined
} from '@ant-design/icons';

// icons
const icons = {
    TeamOutlined,
    CommentOutlined,
    CreditCardOutlined,
    MailOutlined
};

// ==============================|| MENU ITEMS - APPLICATION ||============================== //

const customer = {
    id: 'customer',
    title: 'Customer',
    type: 'group',
    children: [
        {
            id: 'customer',
            title: 'Customers',
            type: 'item',
            url: 'application/customer/default',
            icon: icons.TeamOutlined,
            //   breadcrumbs: false
        },
        {
            id: 'message',
            title: 'Messages',
            type: 'item',
            url: 'application/message/default',
            icon: icons.MailOutlined,
            //   breadcrumbs: false
        },
        {
            id: 'chat',
            title: 'Conversation',
            type: 'item',
            url: 'application/chat/default',
            icon: icons.CommentOutlined,
            //   breadcrumbs: false
        },
        {
            id: 'payment',
            title: 'Payment',
            type: 'item',
            url: 'application/payment/default',
            icon: icons.CreditCardOutlined,
            //   breadcrumbs: false
        }
    ]
};

export default customer;