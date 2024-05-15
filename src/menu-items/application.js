// assets
import { 
    UserOutlined, 
    TeamOutlined, 
    ShoppingCartOutlined, 
    CommentOutlined, 
    TagOutlined, 
    HighlightOutlined, 
    AppstoreAddOutlined, 
    SolutionOutlined,
    PictureOutlined   
} from '@ant-design/icons';

// icons
const icons = {
    UserOutlined,
    TeamOutlined,
    HighlightOutlined,
    ShoppingCartOutlined,
    CommentOutlined,
    TagOutlined,
    AppstoreAddOutlined,
    SolutionOutlined,
    PictureOutlined
};

// ==============================|| MENU ITEMS - APPLICATION ||============================== //

const application = {
    id: 'application',
    title: 'Application',
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
            id: 'user',
            title: 'Users',
            type: 'item',
            url: 'application/user/default',
            icon: icons.UserOutlined,
            //   breadcrumbs: false
        },
        {
            id: 'service',
            title: 'Services',
            type: 'item',
            url: 'application/service/default',
            icon: icons.HighlightOutlined,
            //   breadcrumbs: false
        },
        {
            id: 'category',
            title: 'Categories',
            type: 'item',
            url: 'application/category/default',
            icon: icons.AppstoreAddOutlined,
            //   breadcrumbs: false
        },
        {
            id: 'gallery',
            title: 'Galleries',
            type: 'item',
            url: 'application/gallery/default',
            icon: icons.PictureOutlined,
            //   breadcrumbs: false
        },
        {
            id: 'booking',
            title: 'Bookings',
            type: 'item',
            url: 'application/booking/default',
            icon: icons.SolutionOutlined,
            //   breadcrumbs: false
        },
        {
            id: 'message',
            title: 'Messages',
            type: 'item',
            url: 'application/message/default',
            icon: icons.CommentOutlined,
            //   breadcrumbs: false
        }
    ]
};

export default application;
