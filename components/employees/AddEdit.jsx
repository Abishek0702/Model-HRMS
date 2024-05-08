import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';


import { Link } from 'components';
import { userService, alertService } from 'services';
import { useEffect, useState } from 'react';
import moment from 'moment';


export { AddEdit };

function AddEdit(props) {
    const user = props?.user;
    const isAddMode = !user;
    const router = useRouter();
    const [designation, setDesignation] = useState([]);
    const [department, setDepartment] = useState([]);

    const [selectedDate, setSelectedDate] = useState(user?.date_of_birth)
    const [selectedDateDOJ, setSelectedDateDOJ] = useState(user?.date_of_joining)
    const [selectedDateDOW, setSelectedDateDOW] = useState(user?.DateOfWedding)



    useEffect(() => {
        handleDropDown();
        return;
    }, []);
    const handleDropDown = async () => {
        await userService.dropDown().then(x => setDesignation(x.designations));
        await userService.dropDown().then(x => setDepartment(x.departments));
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Email is Invalid').required('Eamil is required'),
        name: Yup.string().required('Fullname is required'),
        phone_number: Yup.string().required('Phone number is required'),
        password: Yup.string().transform(x => x === '' ? undefined : x).concat(isAddMode ? Yup.string().required('Password is required') : null).min(6, 'Password must be at least 6 characters'),
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    if (!isAddMode) {
        formOptions.defaultValues = user;
    } else {
        formOptions.defaultValues = { designation_id: "8", department_id: "3", country: "India", state: "Tamilnadu" };
    }

    const { register, handleSubmit, reset, formState } = useForm(formOptions);

    const { errors } = formState;


    const handleDateChangeDOB = (e) => {
        setSelectedDate(e.target.value);
    }
    const handleDateChangeDOJ = (e) => {
        setSelectedDateDOJ(e.target.value);
    }
    const handleDateChangeDOW = (e) => {
        setSelectedDateDOW(e.target.value);
    }



    function onSubmit(data) {
        console.log('data:', data)
        return isAddMode 
            ? createUser(data)
            : updateUser(user.id, data);
    }

    function createUser(data) {
        console.log('emp_reg...', data);
        return userService.register(data)
            .then((res) => {
                alertService.success('User added', { keepAfterRouteChange: true });
                router.push('/employees');
            })
            .catch(alertService.error);
    }

    function updateUser(id, data) {
        console.log('update', data);
        return userService.update(id, data)
            .then(() => {
                alertService.success('User updated', { keepAfterRouteChange: true });
                router.push('/employees');
            })
            .catch(alertService.error);
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* {JSON.stringify(department)} */}
                <table className='table'>
                    <tbody>
                        {/* Full Name */}
                        <tr>
                            <th style={{ width: "35%" }}>
                                <label>Full Name <span className='text-danger '>*</span></label>
                            </th>
                            <th style={{ width: "5%" }}>
                                :
                            </th>
                            <td style={{ width: "55%" }}>
                                <input name="name" type="text" {...register('name')} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.name?.message}</div>
                            </td>
                        </tr>
                        {/* First Name */}
                        <tr>
                            <th style={{ width: "35%" }}>
                                <label className=''>First Name</label>
                            </th>
                            <th style={{ width: "5%" }}>
                                :
                            </th>
                            <td style={{ width: "60%" }}>
                                <input name="first_name" type="text" {...register('first_name')} className={`form-control ${errors.first_name ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.first_name?.message}</div>
                            </td>
                        </tr>
                        {/* Last Name */}
                        <tr>
                            <th style={{ width: "35%" }}>
                                <label>Last Name</label>
                            </th>
                            <th style={{ width: "5%" }}>
                                :
                            </th>
                            <td style={{ width: "60%" }}>
                                <input name="last_name" type="text" {...register('last_name')} className={`form-control ${errors.last_name ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.last_name?.message}</div>
                            </td>
                        </tr>
                        {/* DOJ */}
                        <tr>
                            <th style={{ width: "35%" }}>
                                <label>Date of Joining</label>
                            </th>
                            <th style={{ width: "5%" }}>
                                :
                            </th>
                            <td style={{ width: "60%" }}>
                                <input name="date_of_joining" type="date" {...register('date_of_joining')} onChange={handleDateChangeDOJ} value={moment(selectedDateDOJ).utcOffset('+5.30').format('YYYY-MM-DD')} className={`form-control ${errors.date_of_joining ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.date_of_joining?.message}</div>
                            </td>
                        </tr>
                        {/*Official Email */}
                        <tr>
                            <th style={{ width: "35%" }}>
                                <label>Email<span className='text-danger'>*</span></label>
                            </th>
                            <th style={{ width: "5%" }}>
                                :
                            </th>
                            <td style={{ width: "60%" }}>
                                <input name="email" type="email" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.email?.message}</div>
                            </td>
                        </tr>
                        {/* Password */}
                        {!isAddMode == false ? (<tr>
                            <th style={{ width: "45%" }}><label>
                                Password
                                {!isAddMode && <em className="ml-1">(Leave blank to keep the same password)</em>}
                            </label></th>
                            <th style={{ width: "5%" }}>:</th>
                            <td style={{ width: "55%" }}>
                                <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.password?.message}</div>
                            </td>
                        </tr>) : (<tr hidden>
                            <label>
                                Password
                                {!isAddMode && <em className="ml-1">(Leave blank to keep the same password)</em>}
                            </label>
                            <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </tr>)}
                        {/* Phone */}
                        <tr>
                            <th style={{ width: "35%" }}>
                                <label>Phone <span className='text-danger'>*</span></label>
                            </th>
                            <th style={{ width: "5%" }}>
                                :
                            </th>
                            <td style={{ width: "60%" }}>
                                <input name="phone_number" type="text" {...register('phone_number')} className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.phone_number?.message}</div>
                            </td>
                        </tr>
                        {/* Designation */}
                        <tr>
                            <th style={{ width: '45%' }}>
                                <label>Designation</label>
                            </th>
                            <th style={{ width: '5%' }}>:</th>
                            <td>
                                <select name='designation_id' {...register("designation_id")} className={`form-control ${errors.designation_id ? 'is-invalid' : ''}`}>
                                    <option value=''>Select..</option>
                                    {designation && designation.map(list => <option key={list.id} selected={list.id == user?.designation_id} value={list.id}>{list.designationName}</option>)}

                                </select>
                            </td>
                        </tr>
                        {/* Department */}
                        <tr>
                            <th style={{ width: '45%' }}>
                                <label>Department</label>
                            </th>
                            <th style={{ width: '5%' }}>:</th>
                            <td>
                                <select name='department_id' {...register("department_id")} className={`form-control ${errors.department_id ? 'is-invalid' : ''}`}>
                                    <option value=''>Select..</option>
                                    {department && department.map((list) => <option value={list.id} selected={list.id == user?.department_id} key={list.id}>{list.name}</option>)}
                                </select>
                            </td>
                        </tr>
                        {/* Personal Email  */}
                        <tr>
                            <th style={{ width: "35%" }}>
                                <label>Personal Email</label>
                            </th>
                            <th style={{ width: "5%" }}>
                                :
                            </th>
                            <td style={{ width: "60%" }}>
                                <input name="personalemail" type="email" {...register('personalemail')} className={`form-control ${errors.personalemail ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.personalemail?.message}</div>
                            </td>
                        </tr>
                        {/* Emergency Number */}
                        <tr>
                            <th style={{ width: "35%" }}>
                                <label>Emergency Contact</label>
                            </th>
                            <th style={{ width: "5%" }}>
                                :
                            </th>
                            <td style={{ width: "60%" }}>
                                <input name="emergency_contact" type="text" {...register('emergency_contact')} className={`form-control ${errors.emergency_contact ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.emergency_contact?.message}</div>
                            </td>
                        </tr>
                        {/* Gender */}
                        <tr>
                            <th style={{ width: "35%" }}>
                                <label>Gender</label>
                            </th>
                            <th style={{ width: "5%" }}>
                                :
                            </th>
                            <td style={{ width: "60%" }}>
                                <select name='gender' {...register('gender')} className={`form-control form-select ${errors.gender ? 'is-invalid' : ''}`} >
                                    <option value='' >Select</option>
                                    <option value='Male' >Male</option>
                                    <option value='Female' >Female</option>
                                    <option value='Others' >Others</option>
                                </select>
                                <div className="invalid-feedback">{errors.gender?.message}</div>
                            </td>
                        </tr>
                        {/* Nationality */}
                        <tr>
                            <th style={{ width: "35%" }}>
                                <label>Nationality </label>
                            </th>
                            <th style={{ width: "5%" }}>
                                :
                            </th>
                            <td style={{ width: "60%" }}>
                                <input name='nationality' {...register('nationality')} className={`form-control form-select ${errors.nationality ? 'is-invalid' : ''}`} />
                                {/* <select name='nationality' {...register('nationality')} className={`form-control form-select ${errors.nationality ? 'is-invalid' : ''}`} >
                                    <option value='' >Select</option>
                                    <option value='Indian' >Indian</option>
                                    <option value='American' >American</option>
                                    <option value='British' >British</option>
                                    <option value='others' >Others</option>
                                </select> */}
                                <div className="invalid-feedback">{errors.nationality?.message}</div>
                            </td>
                        </tr>
                        {/* DOB */}
                        <tr>
                            <th style={{ width: "35%" }}>
                                <label>Date of Birth </label>
                            </th>
                            <th style={{ width: "5%" }}>
                                :
                            </th>
                            <td style={{ width: "60%" }}>
                                <input name="date_of_birth" type="date" {...register('date_of_birth')} onChange={handleDateChangeDOB} value={moment(selectedDate).utcOffset('+5.30').format('YYYY-MM-DD')} className={`form-control ${errors.date_of_birth ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.date_of_birth?.message}</div>
                            </td>
                        </tr>
                        {/* Blood Group */}
                        <tr>
                            <th style={{ width: "35%" }}>
                                <label>Blood Group </label>
                            </th>
                            <th style={{ width: "5%" }}>
                                :
                            </th>
                            <td style={{ width: "60%" }}>
                                <input name='BloodGroup' type="text" {...register('BloodGroup')} className={`form-control ${errors.BloodGroup ? 'is-invalid' : ''}`} />
                                {/* <select name='BloodGroup' {...register('BloodGroup')} className={`form-control form-select ${errors.BloodGroup ? 'is-invalid' : ''}`} >
                                    <option value='' >Select</option>
                                    <option value='O+' >O+</option>
                                    <option value='A+' >A+</option>
                                    <option value='B+' >B+</option>
                                    <option value='O-' >O-</option>
                                    <option value='A-' >A-</option>
                                    <option value='B-' >B-</option>
                                </select> */}
                                <div className="invalid-feedback">{errors.BloodGroup?.message}</div>
                            </td>
                        </tr>
                        {/* Place Of Birth */}
                        <tr>
                            <th style={{ width: "35%" }}><label>Place of birth</label></th>
                            <th style={{ width: "5%" }}>:</th>
                            <td style={{ width: "55%" }}>
                                <input name="PlaceOfBirth" {...register('PlaceOfBirth')} className={`form-control form-select ${errors.PlaceOfBirth ? 'is-invalid' : ''}`} />
                                {/* <select name="PlaceOfBirth" {...register('PlaceOfBirth')} className={`form-control form-select ${errors.PlaceOfBirth ? 'is-invalid' : ''}`}>
                                    <option value=''>Select...</option>
                                    <option value='Madurai'>Madurai</option>
                                    <option value='Tenkasi'>Tenkasi</option>
                                    <option value='Coimbatore'>Coimbatore</option>
                                    <option value='Tiruppur'>Tiruppur</option>
                                </select> */}
                                <div className="invalid-feedback">{errors.PlaceOfBirth?.message}</div>
                            </td>
                        </tr>
                        {/* Religion */}
                        <tr>
                            <th style={{ width: "35%" }}><label>Religion</label></th>
                            <th style={{ width: "5%" }}>:</th>
                            <td style={{ width: "55%" }}>
                                <input name="religion" {...register('religion')} className={`form-control form-select ${errors.religion ? 'is-invalid' : ''}`} />
                                {/* <select name="religion" {...register('religion')} className={`form-control form-select ${errors.religion ? 'is-invalid' : ''}`}>
                                    <option value=''>Select...</option>
                                    <option value='Hindu'>Hindu</option>
                                    <option value='Muslim'>Muslim</option>
                                    <option value='Christian'>Chiristian</option>
                                    <option value='Others'>Others</option>
                                </select> */}
                                <div className="invalid-feedback">{errors.religion?.message}</div>
                            </td>
                        </tr>
                        {/* Disability */}
                        <tr>
                            <th style={{ width: "35%" }}>Disability</th>
                            <th style={{ width: "5%" }}>:</th>
                            <td style={{ width: "55%" }}>
                                <select name='disability' {...register('disability')} className={`form-control form-select ${errors.disability ? 'is-invalid' : ''}`} >
                                    <option value='' >Select</option>
                                    <option value='Yes' >Yes</option>
                                    <option value='No' >No</option>
                                </select>
                                <div className="invalid-feedback">{errors.disability?.message}</div>
                            </td>
                        </tr>
                        {/* Father Name */}
                        <tr>
                            <th style={{ width: "35%" }}>Father name</th>
                            <th style={{ width: "5%" }}>:</th>
                            <td style={{ width: "55%" }}>
                                <input name='fathersname' {...register('fathersname')} className={`form-control ${errors.fathersname ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.fathersname?.message}</div>
                            </td>
                        </tr>
                        {/* Mother Name */}
                        <tr>
                            <th style={{ width: "35%" }}><label>Mother name</label></th>
                            <th style={{ width: "5%" }}>:</th>
                            <td style={{ width: "55%" }}>
                                <input name='mothersname' {...register('mothersname')} className={`form-control ${errors.mothersname ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.mothersname?.message}</div>
                            </td>
                        </tr>
                        {/* Marital Status */}
                        <tr>
                            <th style={{ width: "35%" }}>Marital status</th>
                            <th style={{ width: "5%" }}>:</th>
                            <td style={{ width: "55%" }}>
                                <select name='MaritalStatus' {...register('MaritalStatus')} className={`form-control ${errors.MaritalStatus ? 'is-invalid' : ''}`} >
                                    <option value='' >Select</option>
                                    <option value='Single' >Single</option>
                                    <option value='Married' >Married</option>
                                    <option value='Others' >Others</option>
                                </select>
                                <div className="invalid-feedback">{errors.MaritalStatus?.message}</div>
                            </td>
                        </tr>
                        {/* DOW */}
                        <tr>
                            <th style={{ width: "35%" }}><label>Date of wedding</label></th>
                            <th style={{ width: "5%" }}>:</th>
                            <td style={{ width: "55%" }}>
                                <input name="DateOfWedding" type="date" {...register('DateOfWedding')} onChange={handleDateChangeDOW} value={moment(selectedDateDOW).utcOffset('+5.30').format('YYYY-MM-DD')} className={`form-control ${errors.DateOfWedding ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.DateOfWedding?.message}</div>
                            </td>
                        </tr>
                        {/* Spouse Name */}
                        <tr>
                            <th style={{ width: "35%" }}><label>Spouse name</label></th>
                            <th style={{ width: "5%" }}>:</th>
                            <td style={{ width: "55%" }}>
                                <input name="SpouseName" type="text" {...register('SpouseName', { min: 2, max: 25 })} className={`form-control ${errors.SpouseName ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.SpouseName?.message}</div>
                            </td>
                        </tr>
                        {/* Childrens Count */}
                        <tr>
                            <th style={{ width: "35%" }}><label>No of children</label></th>
                            <th style={{ width: "5%" }}>:</th>
                            <td style={{ width: "55%" }}>
                                <input name="NumberOfChildren" type="number" {...register('NumberOfChildren', { min: 2, max: 25 })} className={`form-control ${errors.NumberOfChildren ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.NumberOfChildren?.message}</div>
                            </td>
                        </tr>
                        {/* Address */}
                        <tr style={{ width: "100%" }}>
                            <td style={{ width: "47.5%" }}>
                                <div className="form-group">
                                    <label>Address </label>
                                    <textarea name="address" {...register('address')} cols={100} rows={4} className={`form-control  ${errors.address ? 'is-invalid' : ''}`} />
                                    <div className="invalid-feedback">{errors.address?.message}</div>
                                </div>
                            </td>
                            <td style={{ width: "5%" }}></td>
                            <td style={{ width: "47.5%" }}>
                                <div className="form-group row">
                                    <div className="col-6">
                                        <label>City </label>
                                        <input name="city" type='text' {...register('city')} className={`form-control form-select ${errors.city ? 'is-invalid' : ''}`} />
                                        <div className="invalid-feedback">{errors.city?.message}</div>
                                    </div>
                                    <div className="col-6">
                                        <label>State </label>
                                        <input name="state" {...register('state')} className={`form-control form-select ${errors.state ? 'is-invalid' : ''}`} />
                                        <div className="invalid-feedback">{errors.state?.message}</div>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <div className="col-6">
                                        <label>Country </label>
                                        <input name="country" {...register('country')} className={`form-control form-select ${errors.country ? 'is-invalid' : ''}`} />
                                        <div className="invalid-feedback">{errors.country?.message}</div>
                                    </div>
                                    <div className="col-6">
                                        <label>Pincode</label>
                                        <input name="pincode" type="text" {...register('pincode')} className={`form-control ${errors.pincode ? 'is-invalid' : ''}`} />
                                        <div className="invalid-feedback">{errors.pincode?.message}</div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="form-group d-flex justify-content-center" style={{ width: "100%" }}>
                    <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary mr-2">
                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        Save
                    </button>
                    <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button>
                    <Link href="/users" className="btn btn-link">Cancel</Link>
                </div>
            </form >
        </>
    );
}
