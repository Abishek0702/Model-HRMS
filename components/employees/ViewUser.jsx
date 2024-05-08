export { ViewUser };
import moment from 'moment'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { alertService, userService } from 'services';
import { useEffect, useState } from 'react';


function ViewUser(props) {
    const user = props?.user;
    const [image, setImage] = useState("All data is verified")

    const validationSchema = Yup.object().shape({
        acknowledge: Yup.boolean()
            .oneOf([true], "You must accept the acknowledge")
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, formState } = useForm(formOptions);

    const { errors } = formState;

    function onSubmit(data) {
        if (confirm("Are You Verified All Details")) {
            return userService.personalDetailsUpdate(props.user.id, data)
                .then((x) => {
                    props?.reloadFun(props.user.id)
                })
        }
    }

    const profileImgChange = (e) => {
        // console.log(e.target.value);

        if (e.target.files[0] && image != e.target.files[0]) {
            // console.log(URL.createObjectURL(e.target.files[0]))
            setImage(URL.createObjectURL(e.target.files[0]))
        }
    }


    return (
        <div>
            <div className="container-fluid">
                <div className="main-body overflow-hidden">
                    <div className="row overflow-hidden">
                        <div className="col-lg-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex flex-column align-items-center text-center">
                                        <div className='img-wrapper'>
                                            {user.gender == "Male" && <img src={image} alt="Admin" className="rounded-circle border border-dark border-1" width="110" height="110" onError={(event) => event.currentTarget.src = '/img_avatar.png'} />}
                                            {user.gender == "Female" && <img src="/avatar2.png" alt="Admin" className="rounded-circle border border-dark border-1" width="110" />}

                                            <div className='addImg-wrapper'>
                                                <label className='addImg text-' htmlFor="profile-img"><i className="fas fa-camera"></i></label>
                                                <input type='file' id='profile-img' name='profile-img' className='d-none' onChange={profileImgChange} />
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <h4>{user.name}</h4>
                                            <p className="text-secondary mb-1">{user.designationName}</p>
                                            {/* <p className="text-muted font-size-sm">Geons Logix,Madurai</p> */}
                                        </div>
                                    </div>
                                    <hr className="my-4" />
                                    <ul className="list-group list-group-flush">

                                        {/* <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <i className="fas fa-calendar-alt   text-warning"></i>
                                            <p className="mb-0 text-small" style={{ width: "80%" }}>{moment(user.date_of_birth).format('DD MMM')}</p>
                                        </li> */}

                                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <i className="fas fa-phone   text-success"></i>
                                            <p className="mb-0 text-small" style={{ width: "80%" }}>{user.phone_number}</p>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <i className="fas fa-at   text-success"></i>
                                            <p className="mb-0 text-small" style={{ width: "80%" }}>{user.email}</p>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <i className="fas fa-calendar-alt text-dark"></i>
                                            <p className="mb-0 text-small" style={{ width: "80%" }}>{moment(user.date_of_joining).format('DD MMM, YYYY')} [DOJ]</p>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <i className="fas fa-tint   text-dark"></i>
                                            <p className="mb-0 text-small" style={{ width: "80%" }}>{user.BloodGroup}</p>
                                        </li>
                                        <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            <i className="fas fa-graduation-cap   text-dark"></i>
                                            <p className="mb-0 text-small" style={{ width: "80%" }}>{user.depname}</p>
                                        </li>
                                        {/* <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                                            {user.acknowledge == 0 ? <i className="fas fa-info-circle text-danger"></i> : <i className="fas fa-check-circle text-success"></i>}
                                            <p className="mb-0 text-small" style={{ width: "80%" }}>{user.acknowledge == 0 ? <span className='text-danger fw-bolder'>Not Yet Acknowledged</span> : <span className='text-success fw-bolder'>Acknowledged</span>}</p>
                                        </li> */}

                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="ack-wrapper">
                                <div className={`ack-badge-wrapper ${user.acknowledge == 0 ? "not-acknowledged " : "acknowledged"}`}>
                                    <span className="badge">{user.acknowledge == 0 ? "Not Yet Acknowledged" : "Acknowledged"}</span>
                                </div>
                            </div>
                            <div className="card pl-4">
                                <div className="card-body list-group">
                                    <div className="row " >

                                        <div className="table-responsive">
                                            <table className="table table-striped">
                                                <tr> <td style={{ width: '30%' }}><i className="fas fa-user"></i> Name (in Full)</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user.name}</td></tr>
                                                <tr> <td style={{ width: '30%' }}><i className="fas fa-user"></i> First Name</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user.first_name}</td></tr>
                                                <tr> <td style={{ width: '30%' }}><i className="fas fa-user"></i> Last Name</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user.last_name}</td></tr>
                                                {user.date_of_joining && <tr> <td style={{ width: '30%' }}><i className="fas fa-calendar-alt"></i> Date of Joining</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{moment(user.date_of_joining).format('YYYY-MM-DD')}</td></tr>}
                                                <tr> <td style={{ width: '30%' }}><i className="fas fa-at text-success"></i> Official Mail-Id</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }} className="text-small"><span style={{ width: '80%' }}>{user.email}</span></td></tr>
                                                <tr> <td style={{ width: '30%' }}> <i className="fas fa-phone text-success"></i> Contact </td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user.phone_number}</td></tr>
                                                <tr> <td style={{ width: '30%' }}><i className="fas fa-at"></i> Personal Mail-Id</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }} className="text-small"><span style={{ width: '80%' }}>{user.personalemail}</span></td></tr>
                                                <tr> <td style={{ width: '30%' }}> <i className="fas fa-phone"></i> Emergency-Contact</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user.emergency_contact}</td></tr>
                                                <tr> <td style={{ width: '30%' }}><i className="fas fa-venus-mars"></i> Gender</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user.gender}</td></tr>
                                                <tr> <td style={{ width: '30%' }}><i className="fas fa-birthday-cake "></i> Date of Birth</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{moment(user.date_of_birth).format('DD, MMM ')}</td></tr>
                                                <tr> <td style={{ width: '30%' }}><i className="fas fa-flag"></i> Nationality</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user.nationality}</td></tr>
                                                <tr> <td style={{ width: '30%' }}><i className="fas fa-tint "></i> Blood Group</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{user.BloodGroup}</td></tr>
                                                <tr> <td style={{ width: '30%' }}><i className="fas fa-map-marker-alt"></i> Address</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}><span style={{ width: '80%' }}>{user.address}</span></td></tr>

                                                <tr> <td style={{ width: '30%' }}><i className="fas fa-city"></i> City</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}><span style={{ width: '80%' }}>{user.city}</span></td></tr>
                                                <tr> <td style={{ width: '30%' }}><i className="fas fa-map-marker-alt"></i> State</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}><span style={{ width: '80%' }}>{user.state}</span></td></tr>
                                                <tr> <td style={{ width: '30%' }}><i className="fas fa-solid fa-flag"></i> Country</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}><span style={{ width: '80%' }}>{user.country}</span></td></tr>
                                                <tr> <td style={{ width: '30%' }}><i className="fas fa-life-ring"></i> Marital Status</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}><span style={{ width: '80%' }}>{user.MaritalStatus}</span></td></tr>
                                                <tr> <td style={{ width: '30%' }}><i className="fas fa-solid fa-user"></i> Father name</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}><span style={{ width: '80%' }}>{user.fathersname}</span></td></tr>
                                                <tr> <td style={{ width: '30%' }}><i className="fas fa-solid fa-user"></i> Mother name</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}><span style={{ width: '80%' }}>{user.mothersname}</span></td></tr>
                                                <tr> <td style={{ width: '30%' }}><i className="fas fa-solid fa-user"></i> Spouse name</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}><span style={{ width: '80%' }}>{user.SpouseName}</span></td></tr>
                                                <tr> <td style={{ width: '30%' }}><i className="fas fa-calendar-alt"></i> Date of wedding</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}><span style={{ width: '80%' }}>{moment(user.DateOfWedding).format('DD-MM-YYYY ')}</span></td></tr>

                                                {user.acknowledge == 0 &&
                                                    <tr>
                                                        <td style={{ width: '50%' }} colSpan="3">
                                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                                <label className='form-labe'>Verifiy Your Details</label>
                                                                <div className="form-check mb-2">
                                                                    <input {...register("acknowledge")} className={`form-check-input ${errors.acknowledge ? 'is-invalid' : ''} `} type="checkbox" id="flexCheckDefault" />
                                                                    <label className="form-check-label" for="flexCheckDefault">All Details are cleared you must Acknowledge</label>
                                                                </div>
                                                                <button className='btn btn-sm btn-primary' type='submit'>Acknowledge</button>
                                                            </form>
                                                        </td>
                                                    </tr>}
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

