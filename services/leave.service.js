import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
// import Router from 'next/router';

import { fetchWrapper } from 'helpers';
// import { alertService } from './alert.service';
//import { useSelector, useDispatch } from 'react-redux'

const { publicRuntimeConfig } = getConfig();

const baseUrl = `${publicRuntimeConfig.apiUrl}/leavemanagement`;
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('userlk')));

export const leaveService = {
    user: userSubject.asObservable(),
    get userValue() { return userSubject.value },
    addRequest,
    getAll,
    update,
    getByUser,
    getAllLeaveTypes,
    
    getAllStatusDrop,
    getAllApproveDrop
};

function addRequest(user) {
    console.log("user", user);
    return fetchWrapper.post(`${baseUrl}/request/add`, user)
        .then(user => {
            var udata = JSON.stringify(user);
            console.log('udata:', udata);
            console.log('udata status:', user.status);
            if (user.status == 0) {
                return user
            }
            return user;
        }
        );
}

function update(id, user) {
    console.log("uo:", id, user)
    return fetchWrapper.put(`${baseUrl}/approve/${id}`, user)
        .then(
            user => {
                if (user.status == 0) {
                    return user;
                }
                return user;
            }
        )
}

function getAll(page, size, search, userid) {
    // console.log('leaveService', page, size, search, userid)
    return fetchWrapper.get(`${baseUrl}/adminlist?page=${page}&size=${size}&search=${search}&id=${userid}`)
    // .then(
    //     data => {
    //         if (data.status == 0) {
    //             return data;
    //         }
    //         return data;
    //     }
    // )
}

function getByUser(userid, page, size, sortbyfield, sortOrder) {
    // console.log('leaveService user', userid, page, size)
    return fetchWrapper.get(`${baseUrl}/userlist/${userid}?page=${page}&size=${size}&sortbyfield=${sortbyfield}&sort=${sortOrder}`);
}

function getAllLeaveTypes() {
    // console.log('leaveService', page, size, search, userid)
    return fetchWrapper.get(`${baseUrl}/types`);
}

 

function getAllStatusDrop() {
    return fetchWrapper.get(`${baseUrl}/status`,)
}

function getAllApproveDrop() {
    return fetchWrapper.get(`${baseUrl}/formdata`,)
}