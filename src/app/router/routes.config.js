import { lazy } from 'react';
import { ROLES } from '../permissions/roles';

export const ROUTES = [
    {
        path: '/',
        component: lazy(() => import('../../Components/Common/FirstPage')),
        roles: null,
    },
    {
        path: '/home',
        component: lazy(() => import('../../Components/Common/Home')),
        roles: null,
    },
    {
        path: '/category/:categoryId',
        component: lazy(() => import('../../Components/Common/Page')),
        roles: null,
    },
    {
        path: '/product/:productId',
        component: lazy(() => import('../../Components/Common/PageDetail')),
        roles: null,
    },
    {
        path: '/products/:productId',
        component: lazy(() => import('../../Components/Common/ProductDetail')),
        roles: null,
    },
    {
        path: '/contact',
        component: lazy(() => import('../../Components/Common/Contact')),
        roles: null,
    },
    {
        path: '/admin/dashboard',
        component: lazy(() => import('../../Components/Common/AdminCategoryManager')),
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
        layout: 'admin'
    },
    {
        path: '/admin/category',
        component: lazy(() => import('../../Components/Common/AdminCategoryManager')),
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
        layout: 'admin',
    },
    {
        path: '/admin/category/:parentId',
        component: lazy(() => import('../../Components/Common/AdminCategoryManager')),
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
        layout: 'admin',
    },
    {
        path: '/admin/products/:categoryId',
        component: lazy(() => import('../../Components/Common/Product')),
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
        layout: 'admin',
    },
    {
        path: '/admin/products/create/:categoryId',
        component: lazy(() => import('../../Components/Common/Product/Create')),
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
        layout: 'admin',
    },
    {
        path: '/admin/products/edit/:productId',
        component: lazy(() => import('../../Components/Common/Product/Edit')),
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
        layout: 'admin',
    },
    {
        path: '/admin/messages',
        component: lazy(() => import('../../Components/Common/Messages')),
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
        layout: 'admin',
    },
];
