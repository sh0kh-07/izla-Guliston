import { Outlet } from 'react-router-dom';
import Header from '../../Components/Other/Header';
import NavBar from '../../Components/Other/NavBar';

export default function MainLayout() {
    return (
        <div className="layout">
            <Header />
            <div className='pb-16'>
                <Outlet />
            </div>
            <NavBar />
        </div>
    );
}
