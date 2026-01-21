import '../../../public/assets/css/main.css';
import edit from '../../assets/image/edit.svg';
import hapus from '../../assets/image/delete.svg';
import { Table, Pagination, InputGroup, FormControl, Button, Modal, Form } from 'react-bootstrap';
import search from '../../assets/image/search.svg';

// import alert
import Swal from 'sweetalert2'

// Import useState and useEffect
import { useState, useEffect } from 'react';
//import useNavigate
import { useNavigate, useParams } from 'react-router-dom';

// Import api
import Api from '../../api';

// Import layout
import LayoutDefault from "../../layouts/Default";

//import js cookie
import Cookies from 'js-cookie';

export default function Users() {
    //token from cookies
    const token = Cookies.get('token');
    // State untuk filter berdasarkan role
    const [roleFilter, setRoleFilter] = useState('');
    // State untuk hasil pencarian
    const [searchTerm, setSearchTerm] = useState('');

    // State untuk menampilkan atau menyembunyikan form tambah siswa
    const [showAddForm, setShowAddForm] = useState(false);


    // Fungsi untuk menangani perubahan nilai filter berdasarkan role
    const handleRoleFilterChange = (e) => {
        setRoleFilter(e.target.value);
    };

    // Fungsi untuk menangani perubahan nilai pencarian
    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Fungsi untuk melakukan filter berdasarkan role
    const filterByRole = (user) => {
        if (!roleFilter) {
            return true;
        }
        return user.role.toLowerCase() === roleFilter.toLowerCase();
    };

    // Fungsi untuk melakukan pencarian
    const searchFilter = (user) => {
        if (!searchTerm) {
            return true;
        }
        return (
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    document.title = "Dashboard - SIPIKET";

    // Pagination from api
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
    });

    // ambil data users dan menampilkannya + paginaton
    const fetchDataUsers = async (page = 1) => {
        Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        await Api.get(`/api/admin/users?page=${page}&search=${searchTerm}&role=${roleFilter}`)
            .then(response => {
                setUsers(response.data.data.data);
                setPagination({
                    currentPage: response.data.data.currentPage,
                    lastPage: response.data.data.lastPage,
                });
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    };
    const handlePageChange = (page) => {
      fetchDataUsers(page);
  };


    //run hook useEffect
    useEffect(() => {
        
    //call method "fetchDataUsers"
    fetchDataUsers();

    }, []);

    //  //method deletePost
    const deleteUsers = async (id) => {
        
        //delete with api
        await Api.delete(`/api/admin/users/${id}`)
            .then(() => {
                
                fetchDataUsers();

            })
    }
    const confirmDelete = (id) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
            confirmButton: "btn btn-success mx-2",
            cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: "Apakah kamu yakin ingin menghapusnya?",
            text: "Data akan terhapus!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, saya yakin!",
            cancelButtonText: "Tidak, batalakan!",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                deleteUsers(id);
            swalWithBootstrapButtons.fire({
                title: "Terhapus!",
                text: "Data berhasil di hapus.",
                icon: "success"
            });
            } else if (
            result.dismiss === Swal.DismissReason.cancel
            ) {
            swalWithBootstrapButtons.fire({
                title: "Dibatalkan",
                text: "Data tidak jadi dihapus :)",
                icon: "error"
            });
            }
        });
    };
    
    // menambahkan users dan menyimpan di table
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [kelas, setKelas] = useState('');
    const [subject, setSubject] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    // State for validation errors
    const [errors, setErrors] = useState([]);

    // useNavigate hook
    const navigate = useNavigate();

    // Handle form submit
    const storeUsers = async (e) => {
        e.preventDefault();

        // Initialize FormData
        const formData = new FormData();

        // Append data
        formData.append('name', name);
        formData.append('username', username);
        formData.append('kelas', kelas);
        formData.append('subject', subject);
        formData.append('password', password);
        formData.append('email', email);
        formData.append('role', role);
    try {
        await Api.post('/api/admin/users', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
  
        fetchDataUsers(); // Menjalankan ulang pengambilan data untuk memperbarui tabel
        setShowAddForm(false); // Menyembunyikan form setelah berhasil menambahkan pengguna
  
        // Menampilkan notifikasi SweetAlert
        Swal.fire({
          title: 'Berhasil!',
          text: 'Data user berhasil ditambahkan.',
          icon: 'success',
        });
      } catch (error) {
        // Menampilkan notifikasi SweetAlert jika terjadi kesalahan
        Swal.fire({
          title: 'Gagal!',
          text: 'Data user errorr.',
          icon: 'error',
        });
      }
    };

    // membuat fungsi edit menggunakan api berdasarkan id
    const [editUserId, setEditUserId] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
  
    const findUserById = (id) => {
      return users.find((user) => user.id === id);
    };
  
        // Fungsi untuk mengatur data pengguna yang akan diedit
        const handleEdit = (id) => {
            const userToEdit = findUserById(id);
            setEditUserId(id);
        
            // Fill the form with existing user data
            setName(userToEdit.name);
            setUsername(userToEdit.username);
            setKelas(userToEdit.kelas);
            setSubject(userToEdit.subject);
            setPassword(userToEdit.password);
            setEmail(userToEdit.email);
            setRole(userToEdit.role);
        
            setShowEditForm(true);
          };
      
          // Fungsi untuk menangani submit form edit pengguna
          const handleEditFormSubmit = async (e) => {
            e.preventDefault();

            const formData = new FormData();
            formData.append('name', name);
            formData.append('username', username);
            formData.append('kelas', kelas);
            formData.append('subject', subject);
            formData.append('password', password);
            formData.append('email', email);
            formData.append('role', role);

            try {
              await Api.put(`/api/admin/users/${editUserId}`, formData, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              fetchDataUsers(); // Ambil data ulang untuk memperbarui tabel
              setShowEditForm(false); // Sembunyikan form edit

              // Tampilkan notifikasi SweetAlert
              Swal.fire({
                title: 'Berhasil!',
                text: 'Data pengguna berhasil diperbarui.',
                icon: 'success',
              });
            } catch (error) {
              // Tampilkan notifikasi SweetAlert untuk error
              Swal.fire({
                title: 'Gagal!',
                text: 'Terjadi kesalahan saat memperbarui pengguna.',
                icon: 'error',
              });
            }
          };
          // Membedakan warna dari setiap role
          const getRoleColor = (role) => {
            switch (role) {
              case 'Admin':
                return 'blue'; // Ganti dengan warna yang diinginkan untuk Admin
              case 'Guru piket':
                return 'green'; // Ganti dengan warna yang diinginkan untuk Guru Piket
              case 'Guru pelajaran':
                return 'orange'; // Ganti dengan warna yang diinginkan untuk Guru Pelajaran
              case 'Sekertaris':
                return 'purple'; // Ganti dengan warna yang diinginkan untuk Sekertaris
              case 'Murid':
                return 'red'; // Ganti dengan warna yang diinginkan untuk Murid
              default:
                return 'gray'; // Warna default jika peran tidak sesuai
            }
          };
    
    return (
        <LayoutDefault>

            
            <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
                {/* Tombol untuk menampilkan form tambah data */}
            <Button  style={{background: '#4570de'}} onClick={() => setShowAddForm(true)}>
                Tambah User
            </Button>

            {/* Modal Form Tambah User */}
            <Modal show={showAddForm} onHide={() => setShowAddForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Tambah User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={storeUsers}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Name</label>
                                    <input type="text" className="form-control" onChange={(e) => setName(e.target.value)} placeholder="Masukan name" />
                                    {errors.name && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.name[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Username</label>
                                    <input type="text" className="form-control" onChange={(e) => setUsername(e.target.value)} placeholder="Masukan username" />
                                    {errors.username && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.username[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Kelas</label>
                                    <select className="form-select" onChange={(e) => setKelas(e.target.value)}>
                                        <option value=""style={{color: 'black'}}>Pilih kelas</option>
                                        <option value="10 PPLG 1" style={{color: 'black'}}>10 PPLG 1</option>
                                        <option value="10 PPLG 2" style={{color: 'black'}}>10 PPLG 2</option>
                                        <option value="10 PPLG 3" style={{color: 'black'}}>10 PPLG 3</option>
                                        <option value="10 BCF 1" style={{color: 'black'}}>10 BCF 1</option>
                                        <option value="10 BCF 2" style={{color: 'black'}}>10 BCF 2</option>
                                        <option value="10 ANIMASI 1" style={{color: 'black'}}>10 ANIMASI 1</option>
                                        <option value="10 ANIMASI 2" style={{color: 'black'}}>10 ANIMASI 2</option>
                                        <option value="10 TO 1" style={{color: 'black'}}>10 TO 1</option>
                                        <option value="10 TO 2" style={{color: 'black'}}>10 TO 2</option>
                                        <option value="10 TPL 1" style={{color: 'black'}}>10 TPL 1</option>
                                        <option value="10 TPL 2" style={{color: 'black'}}>10 TPL 2</option>
                                        <option value="11 PPLG 1" style={{color: 'black'}}>11 PPLG 1</option>
                                        <option value="11 PPLG 2" style={{color: 'black'}}>11 PPLG 2</option>
                                        <option value="11 PPLG 3" style={{color: 'black'}}>11 PPLG 3</option>
                                        <option value="11 BCF 1" style={{color: 'black'}}>11 BCF 1</option>
                                        <option value="11 BCF 2" style={{color: 'black'}}>11 BCF 2</option>
                                        <option value="11 ANIMASI 1" style={{color: 'black'}}>11 ANIMASI 1</option>
                                        <option value="11 ANIMASI 2" style={{color: 'black'}}>11 ANIMASI 2</option>
                                        <option value="11 TO 1" style={{color: 'black'}}>11 TO 1</option>
                                        <option value="11 TO 2" style={{color: 'black'}}>11 TO 2</option>
                                        <option value="11 TPL 1" style={{color: 'black'}}>11 TPL 1</option>
                                        <option value="11 TPL 2" style={{color: 'black'}}>11 TPL 2</option>
                                        <option value="12 PPLG 1" style={{color: 'black'}}>12 PPLG 1</option>
                                        <option value="12 PPLG 2" style={{color: 'black'}}>12 PPLG 2</option>
                                        <option value="12 PPLG 3" style={{color: 'black'}}>12 PPLG 3</option>
                                        <option value="12 BCF 1" style={{color: 'black'}}>12 BCF 1</option>
                                        <option value="12 BCF 2" style={{color: 'black'}}>12 BCF 2</option>
                                        <option value="12 ANIMASI 1" style={{color: 'black'}}>12 ANIMASI 1</option>
                                        <option value="12 ANIMASI 2" style={{color: 'black'}}>12 ANIMASI 2</option>
                                        <option value="12 TO 1" style={{color: 'black'}}>12 TO 1</option>
                                        <option value="12 TO 2" style={{color: 'black'}}>12 TO 2</option>
                                        <option value="12 TPL 1" style={{color: 'black'}}>12 TPL 1</option>
                                        <option value="12 TPL 2" style={{color: 'black'}}>12 TPL 2</option>
                                    </select>
                                    {errors.kelas && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.kelas[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Mapel</label>
                                    <select className="form-select" onChange={(e) => setSubject(e.target.value)}>
                                        <option value=""style={{color: 'black'}}>Pilih mapel</option>
                                        <option value="PPLG" style={{color: 'black'}}>PPLG</option>
                                        <option value="BCF" style={{color: 'black'}}>BCF</option>
                                        <option value="TPL" style={{color: 'black'}}>TPL</option>
                                        <option value="TO" style={{color: 'black'}}>TO</option>
                                        <option value="ANIMASI" style={{color: 'black'}}>ANIMASI</option>
                                        <option value="JEPANG" style={{color: 'black'}}>JEPANG</option>
                                        <option value="PAI" style={{color: 'black'}}>PAI</option>
                                        <option value="MTK" style={{color: 'black'}}>MTK</option>
                                        <option value="PPKN" style={{color: 'black'}}>PPKN</option>
                                        <option value="SEJARAH" style={{color: 'black'}}>SEJARAH</option>
                                        <option value="PJOK" style={{color: 'black'}}>PJOK</option>
                                        <option value="B.INDO" style={{color: 'black'}}>B.INDO</option>
                                        <option value="B.SUNDA" style={{color: 'black'}}>B.SUNDA</option>
                                        <option value="IPAS" style={{color: 'black'}}>IPAS</option>
                                        <option value="INFORMATIKA" style={{color: 'black'}}>INFORMATIKA</option>
                                        <option value="ENGLISH" style={{color: 'black'}}>ENGLISH</option>
                                        <option value="PKWU" style={{color: 'black'}}>PKWU</option>
                                    </select>
                                    {errors.subject && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.subject[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Password</label>
                                    <input type="password" className="form-control" onChange={(e) => setPassword(e.target.value)} placeholder="Masuk password" />
                                    {errors.password && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.password[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Email</label>
                                    <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} placeholder="Masukan email" />
                                    {errors.email && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.email[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Role</label>
                                    <select className="form-select" onChange={(e) => setRole(e.target.value)}>
                                        <option value=""style={{color: 'black'}}>pilih role</option>
                                        <option value="Admin" style={{color: 'black'}}>Admin</option>
                                        <option value="Guru Piket" style={{color: 'black'}}>Guru Piket</option>
                                        <option value="Guru Pelajaran" style={{color: 'black'}}>Guru Pelajaran</option>
                                        <option value="Sekertaris" style={{color: 'black'}}>Sekertaris</option>
                                        <option value="Murid" style={{color: 'black'}}>Murid</option>
                                    </select>
                                    {errors.role && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.role[0]}
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="btn btn-md btn-success rounded-sm shadow border-0 mx-2" style={{color: 'white'}}>Simpan</button>
                            </form>

                </Modal.Body>
            </Modal>
            {/* Modal Form Tambah User */}
            <Modal show={showEditForm} onHide={() => setShowEditForm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form onSubmit={handleEditFormSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Name</label>
                                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukan name" />
                                    {errors.name && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.name[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Username</label>
                                    <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Masukan username" />
                                    {errors.username && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.username[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Kelas</label>
                                    <select className="form-select" value={kelas} onChange={(e) => setKelas(e.target.value)}>
                                        <option value=""style={{color: 'black'}}>Pilih kelas</option>
                                        <option value="10 PPLG 1" style={{color: 'black'}}>10 PPLG 1</option>
                                        <option value="10 PPLG 2" style={{color: 'black'}}>10 PPLG 2</option>
                                        <option value="10 PPLG 3" style={{color: 'black'}}>10 PPLG 3</option>
                                        <option value="10 BCF 1" style={{color: 'black'}}>10 BCF 1</option>
                                        <option value="10 BCF 2" style={{color: 'black'}}>10 BCF 2</option>
                                        <option value="10 ANIMASI 1" style={{color: 'black'}}>10 ANIMASI 1</option>
                                        <option value="10 ANIMASI 2" style={{color: 'black'}}>10 ANIMASI 2</option>
                                        <option value="10 TO 1" style={{color: 'black'}}>10 TO 1</option>
                                        <option value="10 TO 2" style={{color: 'black'}}>10 TO 2</option>
                                        <option value="10 TPL 1" style={{color: 'black'}}>10 TPL 1</option>
                                        <option value="10 TPL 2" style={{color: 'black'}}>10 TPL 2</option>
                                        <option value="11 PPLG 1" style={{color: 'black'}}>11 PPLG 1</option>
                                        <option value="11 PPLG 2" style={{color: 'black'}}>11 PPLG 2</option>
                                        <option value="11 PPLG 3" style={{color: 'black'}}>11 PPLG 3</option>
                                        <option value="11 BCF 1" style={{color: 'black'}}>11 BCF 1</option>
                                        <option value="11 BCF 2" style={{color: 'black'}}>11 BCF 2</option>
                                        <option value="11 ANIMASI 1" style={{color: 'black'}}>11 ANIMASI 1</option>
                                        <option value="11 ANIMASI 2" style={{color: 'black'}}>11 ANIMASI 2</option>
                                        <option value="11 TO 1" style={{color: 'black'}}>11 TO 1</option>
                                        <option value="11 TO 2" style={{color: 'black'}}>11 TO 2</option>
                                        <option value="11 TPL 1" style={{color: 'black'}}>11 TPL 1</option>
                                        <option value="11 TPL 2" style={{color: 'black'}}>11 TPL 2</option>
                                        <option value="12 PPLG 1" style={{color: 'black'}}>12 PPLG 1</option>
                                        <option value="12 PPLG 2" style={{color: 'black'}}>12 PPLG 2</option>
                                        <option value="12 PPLG 3" style={{color: 'black'}}>12 PPLG 3</option>
                                        <option value="12 BCF 1" style={{color: 'black'}}>12 BCF 1</option>
                                        <option value="12 BCF 2" style={{color: 'black'}}>12 BCF 2</option>
                                        <option value="12 ANIMASI 1" style={{color: 'black'}}>12 ANIMASI 1</option>
                                        <option value="12 ANIMASI 2" style={{color: 'black'}}>12 ANIMASI 2</option>
                                        <option value="12 TO 1" style={{color: 'black'}}>12 TO 1</option>
                                        <option value="12 TO 2" style={{color: 'black'}}>12 TO 2</option>
                                        <option value="12 TPL 1" style={{color: 'black'}}>12 TPL 1</option>
                                        <option value="12 TPL 2" style={{color: 'black'}}>12 TPL 2</option>
                                    </select>
                                    {errors.kelas && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.kelas[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Mapel</label>
                                    <select className="form-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
                                        <option value=""style={{color: 'black'}}>Pilih mapel</option>
                                        <option value="PPLG" style={{color: 'black'}}>PPLG</option>
                                        <option value="BCF" style={{color: 'black'}}>BCF</option>
                                        <option value="TPL" style={{color: 'black'}}>TPL</option>
                                        <option value="TO" style={{color: 'black'}}>TO</option>
                                        <option value="ANIMASI" style={{color: 'black'}}>ANIMASI</option>
                                        <option value="JEPANG" style={{color: 'black'}}>JEPANG</option>
                                        <option value="PAI" style={{color: 'black'}}>PAI</option>
                                        <option value="MTK" style={{color: 'black'}}>MTK</option>
                                        <option value="PPKN" style={{color: 'black'}}>PPKN</option>
                                        <option value="SEJARAH" style={{color: 'black'}}>SEJARAH</option>
                                        <option value="PJOK" style={{color: 'black'}}>PJOK</option>
                                        <option value="B.INDO" style={{color: 'black'}}>B.INDO</option>
                                        <option value="B.SUNDA" style={{color: 'black'}}>B.SUNDA</option>
                                        <option value="IPAS" style={{color: 'black'}}>IPAS</option>
                                        <option value="INFORMATIKA" style={{color: 'black'}}>INFORMATIKA</option>
                                        <option value="ENGLISH" style={{color: 'black'}}>ENGLISH</option>
                                        <option value="PKWU" style={{color: 'black'}}>PKWU</option>
                                    </select>
                                    {errors.subject && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.subject[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Password</label>
                                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukan password" />
                                    {errors.password && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.password[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Email</label>
                                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukan email" />
                                    {errors.email && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.email[0]}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold" style={{color: 'black'}}>Role</label>
                                    <select className="form-select" onChange={(e) => setRole(e.target.value)}>
                                        <option value=""style={{color: 'black'}}>Pilih role</option>
                                        <option value="Admin" style={{color: 'black'}}>Admin</option>
                                        <option value="Guru Piket" style={{color: 'black'}}>Guru Piket</option>
                                        <option value="Guru Pelajaran" style={{color: 'black'}}>Guru Pelajaran</option>
                                        <option value="Sekertaris" style={{color: 'black'}}>Sekertaris</option>
                                        <option value="Murid" style={{color: 'black'}}>Murid</option>
                                    </select>
                                    {errors.role && (
                                        <div className="alert alert-danger mt-2">
                                            {errors.role[0]}
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="btn btn-md btn-success rounded-sm shadow border-0 mx-2" style={{color: 'white'}}>Simpan</button>
                            </form>

                </Modal.Body>
            </Modal>
            <InputGroup style={{ width: '20rem', height: '45px', borderRadius: '40px' }}>
    <FormControl
        className='shadow'
        placeholder="ketik untuk mencari..."
        value={searchTerm}
        onChange={handleSearchTermChange}
        style={{
            borderRadius: '40px',
            boxShadow: 'none',
            background: `url(${search}) no-repeat 10px center/20px`,
            paddingLeft: '40px',
        }}
        />
    </InputGroup>


                <div className="ms-3 shadow">
                    <select className="form-select" onChange={handleRoleFilterChange} value={roleFilter}>
                        <option value="" style={{color: 'black'}}>Semua</option>
                        <option value="Admin" style={{color: 'black'}}>Admin</option>
                        <option value="Guru Piket" style={{color: 'black'}}>Guru Piket</option>
                        <option value="Guru Pelajaran" style={{color: 'black'}}>Guru Pelajaran</option>
                        <option value="Sekertaris" style={{color: 'black'}}>Sekertaris</option>
                        <option value="Murid" style={{color: 'black'}}>Murid</option>
                    </select>
                </div>
            </div>

            <div className="table-responsive" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                <table className="table align-middle mb-0 bg-white">
                    <thead style={{background: '#4570de'}}>
                        <tr>
                            <th scope="col" style={{color: 'white'}}>No</th>
                            <th scope="col" style={{color: 'white'}}>Name</th>
                            <th scope="col" style={{color: 'white'}}>Username</th>
                            <th scope="col" style={{color: 'white'}}>Kelas</th>
                            <th scope="col" style={{color: 'white'}}>Mapel</th>
                            <th scope="col" style={{color: 'white'}}>Email</th>
                            <th scope="col" style={{color: 'white'}}>Role</th>
                            <th scope="col" style={{color: 'white'}}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody className='table-group-divider'>
                    {users
                      .filter((user) => filterByRole(user) && searchFilter(user))
                      .map((user, index, array) => (
                      <tr key={user.id}>
                        <td>{array.length - index}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="ms-3">
                              <p className="fw-bold mb-1" style={{ color: 'black' }}>
                                {user.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="fw-bold mb-1" style={{ color: 'black' }}>
                            {user.username}
                          </p>
                        </td>
                        <td>{user.kelas}</td>
                        <td>{user.subject}</td>
                        <td>{user.email}</td>
                        <td>
                          <span
                            className="badge rounded-pill"
                            style={{
                              color: 'white',
                              backgroundColor: getRoleColor(user.role),
                            }}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <button
                              onClick={() => handleEdit(user.id)}
                              type="button"
                              className="btn-edit btn-link btn-sm btn-rounded border-0 mx-2"
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              <img src={edit} alt="" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                            </button>
                            <button
                              onClick={() => confirmDelete(user.id)}
                              type="button"
                              className="btn-delete btn-link btn-sm btn-rounded border-0"
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              <img src={hapus} alt="" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <Pagination className="mt-3 d-flex justify-content-end">
                <Pagination.First onClick={() => handlePageChange(1)} />
                <Pagination.Prev onClick={() => handlePageChange(pagination.currentPage - 1)} />

                {[...Array(pagination.lastPage).keys()].map((page) => (
                    <Pagination.Item
                        key={page + 1}
                        active={page + 1 === pagination.currentPage}
                        onClick={() => handlePageChange(page + 1)}
                    >
                        {page + 1}
                    </Pagination.Item>
                ))}

                <Pagination.Next onClick={() => handlePageChange(pagination.currentPage + 1)} />
                <Pagination.Last onClick={() => handlePageChange(pagination.lastPage)} />
            </Pagination>            
            
        </LayoutDefault>
    );
}
