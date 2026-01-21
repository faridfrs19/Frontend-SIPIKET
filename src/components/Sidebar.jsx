import '../../public/assets/css/volt.css'
import logo from '../assets/image/logo2.svg'
//import Link
import { Link, useLocation } from 'react-router-dom';

//import permissions
import hasAnyPermission from '../utils/Permissions.jsx';


export default function Sidebar() {

    //assigning location variable
    const location = useLocation();

    //destructuring pathname from location
    const { pathname } = location;

    //Javascript split method to get the name of the path in array
    const activeRoute = pathname.split("/dashboard");
    

    return (
        <div>
            <nav id="sidebarMenu" className="sidebar d-lg-block collapse" data-simplebar>
                <div className="sidebar-inner px-3 pt-3">
                    <div className="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
                        <div className="collapse-close d-md-none">
                            <a href="#sidebarMenu" data-bs-toggle="collapse" data-bs-target="#sidebarMenu"
                                aria-controls="sidebarMenu" aria-expanded="true" aria-label="Toggle navigation">
                                <svg className="icon icon-xs" fill="currentColor" viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <ul className="nav flex-column pt-3 pt-md-0">
                        <li className="nav-item">
                            <span className="mt-2 d-flex justify-content-center">
                                <span>
                                    <span className="sidebar-icon">
                                        <img src={logo} alt="" style={{ width: '50px', height: 'auto' }} />
                                    </span>
                                    <span className="sidebar-text text-center fw-bold ms-2">SIPIKET</span>
                                </span>
                            </span>
                        </li>

                        <li role="separator" className="dropdown-divider mt-4 mb-3 border-white-700"></li>
                            {hasAnyPermission(['permissions.index']) &&
                            <li className={activeRoute[1] === "dashboard" ? "nav-item active" : "nav-item"}>
                                <Link to="/dashboard" className="nav-link d-flex justify-content-between">
                                    <span>
                                        <span className="sidebar-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-speedometer" viewBox="0 0 16 16">
                                            <path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2M3.732 3.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707M2 8a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8m9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5m.754-4.246a.39.39 0 0 0-.527-.02L7.547 7.31A.91.91 0 1 0 8.85 8.569l3.434-4.297a.39.39 0 0 0-.029-.518z"/>
                                            <path fill-rule="evenodd" d="M6.664 15.889A8 8 0 1 1 9.336.11a8 8 0 0 1-2.672 15.78zm-4.665-4.283A11.95 11.95 0 0 1 8 10c2.186 0 4.236.585 6.001 1.606a7 7 0 1 0-12.002 0"/>
                                        </svg>
                                        </span>
                                        <span className="sidebar-text">Dashboard</span>
                                    </span>
                                </Link>
                            </li>
                        }
                        <li role="separator" className="dropdown-divider mt-4 mb-3 border-white-700"></li>

                        {hasAnyPermission(['absen.index']) &&
                            <li className={activeRoute[1] === "absen" ? "nav-item mt-2 active" : "nav-item mt-2"}>
                                <Link to="/absens" className="nav-link d-flex justify-content-between">
                                    <span>
                                        <span className="sidebar-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar-check" viewBox="0 0 16 16">
                                            <path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                                        </svg>
                                        </span>
                                        <span className="sidebar-text">Murid Tidak Hadir</span>
                                    </span>
                                </Link>
                            </li>
                        }

                            {(hasAnyPermission(['surat_masuk.index']) ||  hasAnyPermission(['surat_keluar.index']) || hasAnyPermission(['surat_pulang.index'])) &&
                            <li className={
                                'nav-item ' + (
                                    activeRoute[1] === 'surat_masuk' ? ' active' : 
                                    activeRoute[1] === 'surat_keluar' ? ' active' : 
                                    activeRoute[1] === 'surat_pulang' ? ' active' : ''
                                    )
                                }>
                                <span className="nav-link d-flex justify-content-between align-items-center collapsed" data-bs-toggle="collapse" data-bs-target="#submenu-surat-izin" aria-expanded="false">
                                    <span>
                                        <span className="sidebar-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
                                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
                                        </svg>
                                        </span>
                                        <span className="sidebar-text">Surat Izin</span>
                                    </span>
                                    <span className="link-arrow">
                                        <svg className="icon icon-sm" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                    </span>
                                </span>
                                <div role="list" id="submenu-surat-izin" aria-expanded="false" className={
                                    'multi-level collapse ' + (
                                        activeRoute[1] === 'surat_masuk' ? ' show' : 
                                        activeRoute[1] === 'surat_keluar' ? ' show' : 
                                        activeRoute[1] === 'surat_pulang' ? ' show' : ''
                                        )
                                    }>
                                    <ul className="flex-column nav">
                                    {hasAnyPermission(['surat_masuk.index']) &&
                                        <li className={activeRoute[1] === "surat_masuk" ? "nav-item mt-2 active" : "nav-item mt-2"}>
                                            <Link to="/izinMasuk" className="nav-link d-flex justify-content-between">
                                                <span>
                                                    <span className="sidebar-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-arrow-down" viewBox="0 0 16 16">
                                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4.5a.5.5 0 0 1-1 0V5.383l-7 4.2-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h5.5a.5.5 0 0 1 0 1H2a2 2 0 0 1-2-1.99zm1 7.105 4.708-2.897L1 5.383zM1 4v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1"/>
                                                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-1.646a.5.5 0 0 1-.722-.016l-1.149-1.25a.5.5 0 1 1 .737-.676l.28.305V11a.5.5 0 0 1 1 0v1.793l.396-.397a.5.5 0 0 1 .708.708z"/>
                                                    </svg>
                                                    </span>
                                                    <span className="sidebar-text">Surat izin masuk</span>
                                                </span>
                                            </Link>
                                        </li>
                                    }

                                    {hasAnyPermission(['surat_keluar.index']) &&
                                        <li className={activeRoute[1] === "surat_keluar" ? "nav-item mt-2 active" : "nav-item mt-2"}>
                                            <Link to="/izinKeluar" className="nav-link d-flex justify-content-between">
                                                <span>
                                                    <span className="sidebar-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-arrow-up" viewBox="0 0 16 16">
                                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4.5a.5.5 0 0 1-1 0V5.383l-7 4.2-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h5.5a.5.5 0 0 1 0 1H2a2 2 0 0 1-2-1.99zm1 7.105 4.708-2.897L1 5.383zM1 4v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1"/>
                                                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-5.354 1.25 1.25a.5.5 0 0 1-.708.708L13 12.207V14a.5.5 0 0 1-1 0v-1.717l-.28.305a.5.5 0 0 1-.737-.676l1.149-1.25a.5.5 0 0 1 .722-.016"/>
                                                    </svg>
                                                    </span>
                                                    <span className="sidebar-text">Surat izin keluar</span>
                                                </span>
                                            </Link>
                                        </li>
                                    }

                                    {hasAnyPermission(['surat_pulang.index']) &&
                                        <li className={activeRoute[1] === "surat_pulang" ? "nav-item mt-2 active" : "nav-item mt-2"}>
                                            <Link to="/izinPulang" className="nav-link d-flex justify-content-between">
                                                <span>
                                                    <span className="sidebar-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-check" viewBox="0 0 16 16">
                                                        <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z"/>
                                                        <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686"/>
                                                    </svg>
                                                    </span>
                                                    <span className="sidebar-text">Surat izin pulang</span>
                                                </span>
                                            </Link>
                                        </li>
                                    }
                                    </ul>
                                </div>
                            </li>
                        }
                        
                        {hasAnyPermission(['tugas_guru.index']) &&
                            <li className={activeRoute[1] === "tugas_guru" ? "nav-item mt-2 active" : "nav-item mt-2"}>
                                <Link to="/forumTugas" className="nav-link d-flex justify-content-between">
                                    <span>
                                        <span className="sidebar-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-check" viewBox="0 0 16 16">
                                            <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                                            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                                            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
                                        </svg>
                                        </span>
                                        <span className="sidebar-text">Info Tugas</span>
                                    </span>
                                </Link>
                            </li>
                        }

                        <li role="separator" className="dropdown-divider mt-4 mb-3 border-white-700"></li>

                        {(hasAnyPermission(['users.index'])) &&
                            <li className={
                                'nav-item ' + (
                                    activeRoute[1] === 'roles' ? ' active' : 
                                    activeRoute[1] === 'permissions' ? ' active' : 
                                        activeRoute[1] === 'users' ? ' active' : ''
                                    )
                                }>
                                <span className="nav-link d-flex justify-content-between align-items-center collapsed" data-bs-toggle="collapse" data-bs-target="#submenu-user-manage" aria-expanded="false">
                                    <span>
                                        <span className="sidebar-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                                                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
                                            </svg>
                                        </span>
                                        <span className="sidebar-text">Users Management</span>
                                    </span>
                                    <span className="link-arrow">
                                        <svg className="icon icon-sm" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                    </span>
                                </span>
                                <div role="list" id="submenu-user-manage" aria-expanded="false" className={
                                    'multi-level collapse ' + (
                                        activeRoute[1] === 'roles' ? ' show' : 
                                        activeRoute[1] === 'permissions' ? ' show' : 
                                        activeRoute[1] === 'users' ? ' show' : ''
                                    )
                                }>
                                    <ul className="flex-column nav">

                                        {hasAnyPermission(['users.index']) &&
                                            <li className={activeRoute[1] === "users" ? "nav-item active" : "nav-item"}>
                                                <Link to="/users" className="nav-link" href="#">
                                                <span>
                                                    <span className="sidebar-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                                                    </svg>
                                                    </span>
                                                    <span className="sidebar-text">Users</span>
                                                </span>
                                                </Link>
                                            </li>
                                        }
                                    </ul>
                                </div>
                            </li>
                        }

                    </ul>
                </div>
            </nav>
        </div>
    )
}