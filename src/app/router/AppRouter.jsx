import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import MainLayout from '../layout/MainLayout';
import AdminLayout from '../layout/AdminLayout'; // New import
import RoleGuard from './RoleGuard';
import { ROUTES } from './routes.config';
import Loading from '../../Components/Other/UI/Loadings/Loading';

const Login = lazy(() => import('../../Components/Common/Login'));

export default function AppRouter() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                {/* Public Routes without MainLayout */}
                <Route path="/login" element={<Login />} />

                {/* Admin Routes with AdminLayout */}
                <Route element={<AdminLayout />}>
                    {ROUTES.filter(r => r.layout === 'admin').map(r => (
                        <Route key={r.path} element={<RoleGuard allow={r.roles} />}>
                            <Route path={r.path} element={<r.component />} />
                        </Route>
                    ))}
                </Route>

                {/* Main Routes with MainLayout */}
                <Route element={<MainLayout />}>
                    {ROUTES.filter(r => r.layout !== 'admin').map(r => (
                        <Route key={r.path} element={<RoleGuard allow={r.roles} />}>
                            <Route path={r.path} element={<r.component />} />
                        </Route>
                    ))}
                </Route>
            </Routes>
        </Suspense>
    );
}
