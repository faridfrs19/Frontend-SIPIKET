
//import useState from react
import { useState } from 'react';

//import API
import Api from '../../api';

//import js cookie
import Cookies from 'js-cookie';

//import react router dom
import { useNavigate } from "react-router-dom";

//import toast
import toast from 'react-hot-toast';

import back from '../../assets/image/back.svg'
import logo from '../../assets/image/logo2.svg'

export default function Login() {
    // show pw
    const [showPassword, setShowPassword] = useState(false);

    //title page
    document.title = "Login - SIPIKET";

    //navigate
    const navigate = useNavigate();

    //define state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //define state errors
    const [errors, setErrors] = useState([]);

    //method login
    const login = async (e) => {
        e.preventDefault();

        await Api.post('/api/login', {

            //data
            email: email,
            password: password
        })
            .then(response => {

                //set token to cookies
                Cookies.set('token', response.data.token);

                //set user to cookies
                Cookies.set('user', JSON.stringify(response.data.user));

                //set permissions to cookies
                Cookies.set('permissions', JSON.stringify(response.data.permissions));

                //show toast
                toast.success('Login Berhasil!', {
                    position: "top-center",
                    duration: 4000, 
                });

                //redirect dashboard page
                navigate("/dashboard");

            })
            .catch(error => {

                //set response error to state
                setErrors(error.response.data);
            })

    }


    //check if cookie already exists
    if (Cookies.get("token")) {

        //redirect dashboard page
        return navigate("/dashboard");
    }

    return (
        <div className="login-page">
            <div className="container">
                <div className="row">
                    <div className="col-sm-6 mb-5 col-6 mt-2">
                    <a href="/" className="back btn btn-primary px-4 me-2 mt-4"><img src={back} alt="" />Kembali</a>
                    </div>
                    <div className="col-lg-10 offset-lg-1" style={{ marginTop: '0px' }}>
                        <div className="bg-form shadow rounded">
                            <div className="row">
                            <div className="col-md-5 d-flex">
                                    <div className="form-left h-100 text-white text-center pt-5">
                                        <img src={logo} className="w-50 mb-1" />
                                        <h5 className="fs-3">SIPIKET</h5>
                                    </div>
                                </div>
                                <div className="col-md-7 pe-0">
                                    <div className="form-right h-100 py-5 px-5">
                                        {errors.message && (
                                            <div className="alert alert-danger">
                                                {errors.message}
                                            </div>
                                        )}
                                        <form onSubmit={login} className="row g-4">
                                            <div className="col-12">
                                                <label>Alamat Email</label>
                                                <div className="input-group">
                                                    <div className="input-group-text"><i className="fa fa-envelope"></i></div>
                                                    <input type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukan Alamat Email" />
                                                </div>
                                                {errors.email && (
                                                    <div className="alert alert-danger mt-2">
                                                        {errors.email[0]}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-12">
                                                <label>Password</label>
                                                <div className="input-group">
                                                    <div className="input-group-text"><i className="fa fa-lock"></i></div>
                                                    <input
                                                        type={showPassword ? 'text' : 'password'}
                                                        className="form-control"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        placeholder="Masukan Password"
                                                    />
                                                    <button
                                                        className="btn btn-light"
                                                        style={{ boxShadow: "0 2px 0 0 rgba(0, 0, 0, 0.5)" }}
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i>}
                                                    </button>
                                                </div>
                                                {errors.password && (
                                                    <div className="alert alert-danger mt-2">
                                                        {errors.password[0]}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-sm-6 col-6">
                                                <button type="submit" className="btn btn-primary px-4">Kirim</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}