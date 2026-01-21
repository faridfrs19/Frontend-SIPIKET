import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Api from '../api';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import '../../public/assets/css/volt.css';
import Swal from 'sweetalert2'

export default function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(Cookies.get('user'));

    const handleLogout = async () => {
        try {
            await Api.post('/api/logout');
            Cookies.remove('user');
            Cookies.remove('token');
            Cookies.remove('permissions');
            toast.success('Logout Berhasil!', {
                position: "top-center",
                duration: 4000,
            });
            navigate('/login');
        } catch (error) {
            console.error("Logout error:", error);
            // Handle error or show an error toast
        }
    };

    const confirmLogout = () => {
        Swal.fire({
            title: "Apakah kamu yakin ingin logout?",
            text: "Kamu akan kembali ke halaman login!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, saya yakin!"
        }).then((result) => {
            if (result.isConfirmed) {
                handleLogout();
            }
        });
    };

    return (
        <nav className="navbar navbar-top navbar-expand navbar-dashboard navbar-dark navbar-theme-primary ps-0 pe-2 pb-0 mt-2" style={{ boxShadow: '0 4px 2px -2px gray' }}>
            <div className="container-fluid px-0 mb-2">
                <div className="d-flex justify-content-between w-100" id="navbarSupportedContent">
                    <div className="d-flex align-items-center ms-4">
                       
                    </div>
                    <ul className="navbar-nav align-items-center">
                        <li className="nav-item dropdown ms-lg-3">
                            <Link to="#" className="nav-link dropdown-toggle pt-1 px-3" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <div className="media d-flex align-items-center">
                                    <img className="avatar rounded-circle p-0" alt="Image placeholder" src={`https://ui-avatars.com/api/?name=${user.name}&background=31316a&color=ffffff&size=400`} />
                                    <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                                        <span className="mb-0 font-small fw-bold text-white-900">{user.name}</span>
                                    </div>
                                </div>
                            </Link>
                            <div className="dropdown-menu dashboard-dropdown dropdown-menu-end mt-2 py-1 border-0 shadow">
                                <Link to="#" onClick={confirmLogout} className="dropdown-item d-flex align-items-center text-danger">
                                    <svg className="dropdown-icon icon-shape-danger me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                    </svg>
                                    Logout
                                </Link>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
