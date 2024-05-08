import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { alertService } from '.';
import axios from 'axios';

//import { useSelector, useDispatch } from 'react-redux'

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/users`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('geonsusr')));

export const userService = {
    user: userSubject.asObservable(),
    get userValue() { return userSubject.value },
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    getAllPolicies,
    getAllHolidays,
    acknowledge,
    changePassword,
    getAllReports,
    getReport,
    addReport,
    Forgotpassword,
    Forgotpasswordotp,
    dropDown,
    getByBankId,
    createBank,
    updateBank,
    getByPersonalIds,
    createPersonalIds,
    updatePersonalIds,
    getByEducationId,
    createEducationData,
    educationDelete,
    getByFamilyId,
    createFamilyData,
    familyDelete,
    getAttendance,
    getAttendanceDaily,
    getAttendanceDownload,
    getByExperienceId,
    createExperienceData,
    experienceDelete,
    getByReferenceId,
    createReferenceData,
    updateReference,
    getEmployeemonth,
    EmployeeofMonthReg,
    EmployeeofMonthupdate,
    deleteEmployeemonth,
    personalDetailsUpdate,

    getByPayslipId,
    createPayslipData,
    Payslipupdate,
    PayslipDelete,

    getDesk,  // helpdesk
    getAddDesk, // helpdesk
    form, // helpdesk
    getDeskAll, // helpdesk
    updateDesk, // helpdesk
    getAllEvents, // events
    getEventId,  // events
    createEventData, // events
    updateEvent, // events
    eventDelete, // events
    formevent,

    educationUpdate, // education update 
    experinceUpdate, // experince update
    userList , // autocomplete user List
};


// autocomplete user List
function userList() {
    // console.log("###############",id,data);    
    return fetchWrapper.get(`${baseUrl}/autocomplete?name`)
}


// update personal details path
function personalDetailsUpdate(id, data) {
    // console.log("###############",id,data);    
    return fetchWrapper.put(`${baseUrl}/${id}`, data)
}

function dropDown() {
    return fetchWrapper.get(`${baseUrl}/formdata`)
}

function Forgotpassword(data) {

    return fetchWrapper.post(`${publicRuntimeConfig.apiUrl}/users/forgotpassword`, data);
}
function Forgotpasswordotp(data) {

    return fetchWrapper.put(`${publicRuntimeConfig.apiUrl}/users/forgotpassword`, data);
}


function changePassword(id, userd) {
    console.log("uo:", id, userd)
    return fetchWrapper.put(`${baseUrl}/changepassword/${id}`, userd)
        .then(
            user => {
                console.log('check status', user);
                if (user.status == 1) {
                    logout();
                } else {
                    alertService.error('Error:' + user.message);
                }
                //return user;
            }
        ).catch((err) => {
            console.log("err", err);

        });
}

function update(id, user) {
    console.log("uo:", id, user)
    return fetchWrapper.put(`${baseUrl}/${id}`, user)
        .then(
            user => {
                if (user.status == 0) {
                    // localStorage.removeItem('geonsusr');
                    // userSubject.next(null);
                    // Router.push('/account/login');
                    Router.push('/employees');
                } else {

                }
                return user;
            }
        )
}

function login(username, password) {
    return fetchWrapper.post(`${baseUrl}/authenticate`, { username, password })
        .then(user => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            var udata = JSON.stringify(user); console.log('udata:', user.status);
            if (user.status == 0) {
                localStorage.removeItem('geonsusr');
                userSubject.next(null);
                // Router.push('/account/login');
            } else {
                userSubject.next(user);
                localStorage.setItem('geonsusr', udata);
            }

            return user;
        });
}

function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('geonsusr');
    userSubject.next(null);
    // Router.push('/account/login');
    location.reload('/account/login');
}

function getAllHolidays(page, size, search) {
    // return fetchWrapper.get(baseUrl);
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/admin/holidays?page=${page}&size=${size}`);
}

function getAllReports(page, size, search) {
    // return fetchWrapper.get(baseUrl);
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/employees/report?page=${page}&size=${size}&search=${search}`);
}
function getReport() {
    // return fetchWrapper.get(baseUrl);
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/employees/report/getreport`);
}
function addReport() {
    return fetchWrapper.post(`${publicRuntimeConfig.apiUrl}/employees/report/addreport`);
}

function register(user) {
    return fetchWrapper.post(`${baseUrl}/register`, user);
}

function getAll(page, size, search) {
    // return fetchWrapper.get(baseUrl);
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/users?page=${page}&size=${size}&search=${search}`);
}

function getById(id) {
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/users/details?id=${id}`);
}

function getAllPolicies(user_id, page, size, search) {
    // console.log(page, size, search)
    // return fetchWrapper.get(baseUrl);
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/employees/policies/lists/${user_id}?page=${page}&size=${size}&search=${search}`);
}
function acknowledge(policy_id, user_id) {//With Login
    return fetchWrapper.post(`${publicRuntimeConfig.apiUrl}/employees/policies/acknowledge/${user_id}`, { "user_id": user_id, "policy_id": policy_id })
        .then(policy => {

            return policy;
        }
        );

}


// Bank Details
function getByBankId(id) {
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/employees/bankDetails/${id}`);
}
function createBank(data) {
    return fetchWrapper.post(`${publicRuntimeConfig.apiUrl}/employees/bankDetails/add`, data);
}

function updateBank(id, data) {
    return fetchWrapper.put(`${publicRuntimeConfig.apiUrl}/employees/bankDetails/${id}`, data)
}



// Personal ID's

function getByPersonalIds(id) {
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/employees/personalids/${id}`)
}

function createPersonalIds(data) {
    return fetchWrapper.post(`${publicRuntimeConfig.apiUrl}/employees/personalids/add`, data);
}

function updatePersonalIds(id, data) {
    return fetchWrapper.put(`${publicRuntimeConfig.apiUrl}/employees/personalids/${id}`, data)
}


// Education Details

function getByEducationId(id) {
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/employees/educationalDetails/${id}`);
}

function createEducationData(data) {
    return fetchWrapper.post(`${publicRuntimeConfig.apiUrl}/employees/educationalDetails/add`, data);
}

function educationDelete(id) {
    return fetchWrapper.delete(`${publicRuntimeConfig.apiUrl}/employees/educationalDetails/${id}`);
}

function educationUpdate(id, data) {
    return fetchWrapper.put(`${publicRuntimeConfig.apiUrl}/employees/educationalDetails/${id}`, data);
}

// Family Details

function getByFamilyId(id) {
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/employees/familydetails/${id}`);
}

function createFamilyData(data) {
    return fetchWrapper.post(`${publicRuntimeConfig.apiUrl}/employees/familydetails/add`, data);
}

function familyDelete(id) {
    return fetchWrapper.delete(`${publicRuntimeConfig.apiUrl}/employees/familydetails/${id}`);
}



// Experience Details

function getByExperienceId(id) {
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/employees/experienceDetails/${id}`);
}

function createExperienceData(data) {
    return fetchWrapper.post(`${publicRuntimeConfig.apiUrl}/employees/experienceDetails/add`, data);
}

function experienceDelete(id) {
    return fetchWrapper.delete(`${publicRuntimeConfig.apiUrl}/employees/experienceDetails/${id}`);
}

function experinceUpdate(id, data) {
    return fetchWrapper.put(`${publicRuntimeConfig.apiUrl}/employees/experienceDetails/${id}`, data);
}

// Reference Details

function getByReferenceId(id) {
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/employees/referenceDetails/${id}`);
}

function createReferenceData(data) {
    return fetchWrapper.post(`${publicRuntimeConfig.apiUrl}/employees/referenceDetails/add`, data);
}

function updateReference(id, data) {
    return fetchWrapper.put(`${publicRuntimeConfig.apiUrl}/employees/referenceDetails/${id}`, data);
}

//employee month
function getEmployeemonth(page, size, search) {
    console.log('EmployeeofMonth', page, size, search)
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/admin/employeeofmonth/employeemonth?page=${page}&size=${size}&search=${search}`);
}

function EmployeeofMonthReg(data) {
    return fetchWrapper.post(`${publicRuntimeConfig.apiUrl}/admin/employeeofmonth/add`, data)
}

function EmployeeofMonthupdate(id, data) {
    console.log("uo:", id, data)
    return fetchWrapper.put(`${publicRuntimeConfig.apiUrl}/admin/employeeofmonth/${id}`, data)
}
function deleteEmployeemonth(id) {
    return fetchWrapper.delete(`${publicRuntimeConfig.apiUrl}/admin/employeeofmonth/${id}`)
}


//Attendance

function getAttendance(page, size, date) {
    // console.log('Attendance', page, size,date)
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/admin/reports/allreports?page=${page}&size=${size}&date=${date}`);
}

function getAttendanceDaily(page, size, date, id) {
    // console.log('----------------Attendance', page, size,date,id)
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/admin/reports/dailyreports?page=${page}&size=${size}&id=${55}&date=${date}`);
}

function getAttendanceDownload(date) {
    // console.log('Attendance',date)
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/admin/reports/downloadreport`);
}



// Helpdesk
function getDesk(page, size, search, userid) {
    console.log("idddddd", userid);
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/admin/helpdesk/user/${userid}?page=${page}&size=${size}&search=${search}`);
}


function getAddDesk(data) {
    return fetchWrapper.post(`${publicRuntimeConfig.apiUrl}/admin/helpdesk/user/add`, data);
}
function form() {
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/admin/helpdesk/formdata/formdata`);
}


// helpdesk Admin

function getDeskAll(page, size, search) {
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/admin/helpdesk/admin/?search=${search}&page=${page}&size=${size}`);
}

function updateDesk(id, data) {
    return fetchWrapper.put(`${publicRuntimeConfig.apiUrl}/admin/helpdesk/admin/${id}`, data);
}



// Events

function getAllEvents(page, size, search) {
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/admin/events?page=${page}&size=${size}&search=${search}`);
}

function getEventId(id) {
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/admin/events/${id}`);
}

function createEventData(data) {
    console.log(data)
    return (
        axios.post(`${publicRuntimeConfig.apiUrl}/admin/events/add`, data, {
            headers: {
                'Authorization': `Bearer ${userService.userValue.token}`,
                'Content-Type': 'multipart/form-data'
            }
        }))
}

function updateEvent(id, data) {
    return fetchWrapper.put(`${publicRuntimeConfig.apiUrl}/admin/events/${id}`, data);
}

function eventDelete(id) {
    return fetchWrapper.delete(`${publicRuntimeConfig.apiUrl}/admin/events/${id}`);
}
function formevent() {
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/admin/events/formdata`);
}












// Payslip Details
function getByPayslipId(id) {
    return fetchWrapper.get(`${publicRuntimeConfig.apiUrl}/employees/payslips/${id}`);
}

function createPayslipData(data) {
    return fetchWrapper.post(`${publicRuntimeConfig.apiUrl}/employees/payslips/add`, data);
}



function Payslipupdate(id, data) {
    return fetchWrapper.put(`${publicRuntimeConfig.apiUrl}/employees/payslips/${id}`, data)
}

function PayslipDelete(id) {
    return fetchWrapper.delete(`${publicRuntimeConfig.apiUrl}/employees/payslips/${id}`);
}