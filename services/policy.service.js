import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';
import { fetchWrapper } from 'helpers';
import axios from 'axios';

const { publicRuntimeConfig } = getConfig();

const baseUrl = `${publicRuntimeConfig.apiUrl}/employees/policies`;
const inventorySubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('geonsusr')));

export const policyService = {
    policy: inventorySubject.asObservable(),
    get userValue() { return inventorySubject.value },
    uplaodFile,
    policyList,
    policyRemove,
    updateFile,
}

function updateFile(id, data) {
    console.log("Policy Update", id, data);
    return axios.put(`${baseUrl}/${id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${policyService.userValue.token}`
        }
    })
}

function uplaodFile(data) {
    // console.log("================", inventorySubject);
    // console.log("================", policyService.userValue.token);
    // console.log("Policy service upload", data);
    // return fetchWrapper.post(`${baseUrl}/upload`, data)  
    return axios.post(`${baseUrl}/upload`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${policyService.userValue.token}`
        }
    })
}

function policyList(page, size, search) {
    console.log("policy list", page, size, search);
    return fetchWrapper.get(`${baseUrl}?page=${page}&size=${size}&search=${search}`)
}

function policyRemove(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`)
}