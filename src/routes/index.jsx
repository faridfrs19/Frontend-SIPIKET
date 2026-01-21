//import react
import React, { lazy, Suspense } from 'react';

//import react router dom
import { Routes, Route } from "react-router-dom";

//import loader component
const Loader = lazy(() => import('../components/Loader.jsx'));

//import view Login
const Login = lazy(() => import('../views/Auth/Login.jsx'));

//import private routes
import PrivateRoutes from "./privateRoutes";

//import view dashboard
const Dashboard = lazy(() => import('../views/Dashboard/index.jsx'));

// users absens
const Users = lazy(() => import('../views/Dashboard/users.jsx'));
const Absens = lazy(() => import('../views/Dashboard/absens.jsx'));
const SuratMasuk = lazy(() => import('../views/Dashboard/surat_masuk.jsx'));
const SuratKeluar = lazy(() => import('../views/Dashboard/surat_keluar.jsx'));
const SuratPulang = lazy(() => import('../views/Dashboard/surat_pulang.jsx'));
const ForumTugas = lazy(() => import('../views/Dashboard/forum_tugas.jsx'));

import Home from "../views/pages/HomePage.jsx"

export default function RoutesIndex() {

    return (
        <Routes>

            {/* route "/" */}
            <Route
                path="/"
                element={
                    <Suspense fallback={<Loader />}>
                        <Home />
                    </Suspense>
                }
            />

            {/* route "/login" */}
            <Route
                path="/login"
                element={
                    <Suspense fallback={<Loader />}>
                        <Login />
                    </Suspense>
                }
            />

            {/* private route "/dashboard" */}
            <Route
                path="/dashboard"
                element={
                    <Suspense fallback={<Loader />}>
                        <PrivateRoutes>
                            <Dashboard />
                        </PrivateRoutes>
                    </Suspense>
                    
                }
            />

            <Route
                path="/users"
                element={
                    <Suspense fallback={<Loader />}>
                        <PrivateRoutes>
                            <Users />
                        </PrivateRoutes>
                    </Suspense>
                    
                }
            />

            <Route
                path="/absens"
                element={
                    <Suspense fallback={<Loader />}>
                        <PrivateRoutes>
                            <Absens />
                        </PrivateRoutes>
                    </Suspense>
                    
                }
            />

            <Route
                path="/izinMasuk"
                element={
                    <Suspense fallback={<Loader />}>
                        <PrivateRoutes>
                            <SuratMasuk />
                        </PrivateRoutes>
                    </Suspense>
                    
                }
            />

            <Route
                path="/izinKeluar"
                element={
                    <Suspense fallback={<Loader />}>
                        <PrivateRoutes>
                            <SuratKeluar/>
                        </PrivateRoutes>
                    </Suspense>
                    
                }
            />

            <Route
                path="/izinPulang"
                element={
                    <Suspense fallback={<Loader />}>
                        <PrivateRoutes>
                            <SuratPulang/>
                        </PrivateRoutes>
                    </Suspense>
                    
                }
            />

            <Route
                path="/forumTugas"
                element={
                    <Suspense fallback={<Loader />}>
                        <PrivateRoutes>
                            <ForumTugas/>
                        </PrivateRoutes>
                    </Suspense>
                    
                }
            />

            
            
        </Routes>
    )
}