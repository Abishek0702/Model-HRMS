import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';
import moment from 'moment';
import { fetchWrapper } from 'helpers';
import { alertService } from './alert.service';


const { publicRuntimeConfig } = getConfig();


const baseUrl = `${publicRuntimeConfig.apiUrl}`;
const DashboardSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('userlk')));

const date = new Date()
const dateformat = moment(date, "MM-DD").format("MM-DD");
// console.log('dattt',dateformat)

export const DashboardService = {
    dashboard: DashboardSubject.asObservable(),
    get userValue() { return DashboardSubject.value },
    getAllUser,
    getAllAdmin,
    getAllPie,
    getAllMonthlyReports,
    getAllBar
}

function getAllUser() {
    return fetchWrapper.get(`${baseUrl}/admin/dashboard/userDashboard`);
}
function getAllAdmin() {
    return fetchWrapper.get(`${baseUrl}/admin/dashboard/adminDashboard?date=${dateformat}`);
}
function getAllPie() {
    return fetchWrapper.get(`${baseUrl}/admin/dashboard/piecounts?date`);
}
function getAllBar() {
    return fetchWrapper.get(`${baseUrl}/admin/dashboard/barcounts?date`);
}
function getAllMonthlyReports() {
    return fetchWrapper.get(`${baseUrl}/employees/report/monthlyreports/monthlyreports`);
}
