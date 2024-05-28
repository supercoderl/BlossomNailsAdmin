// assets
import { 
    UserOutlined,  
    ShoppingCartOutlined, 
    TagOutlined, 
    HighlightOutlined, 
    AppstoreAddOutlined, 
    SolutionOutlined,
    PictureOutlined,
} from '@ant-design/icons';

// icons
const icons = {
    UserOutlined,
    HighlightOutlined,
    ShoppingCartOutlined,
    TagOutlined,
    AppstoreAddOutlined,
    SolutionOutlined,
    PictureOutlined,
};

// ==============================|| MENU ITEMS - APPLICATION ||============================== //

const application = {
    id: 'application',
    title: 'Application',
    type: 'group',
    children: [
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
    ]
};

export default application;
