import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';
import { alertService } from './alert.service';


const { publicRuntimeConfig } = getConfig();


const baseUrl = `${publicRuntimeConfig.apiUrl}/inventory`;
const inventorySubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('userlk')));


export const inventoryService = {
    user: inventorySubject.asObservable(),
    get userValue() { return inventorySubject.value },
    getAll,
    register,
    deleteType,
    update,
    getStatus,
    addStatus,
    deleteStatus,
    statusUpdate,
    getVendor,
    deleteVendor,
    addVendor,
    vendorUpdate,
    getAllAssets,
    insertDate,
    dropdownList,
    assetsDelete,
    updateData,
}
// VIEWTYPES
function getAll(page, size, search) {
    console.log('inventoryservice', page, size, search)
    return fetchWrapper.get(`${baseUrl}/types?page=${page}&size=${size}&search=${search}`);
}

function register(data) {
    return fetchWrapper.post(`${baseUrl}/types/add`, data)
       
}

function deleteType(id) {
    console.log("logID", id)
    return fetchWrapper.delete(`${baseUrl}/types/${id}`)
        
}

function update(id, name) {
    console.log("update", id, name);
    return fetchWrapper.put(`${baseUrl}/types/${id}`, name)
        
}
// VIEWSTATUS
function getStatus(page, size) {
    console.log('inventoryservice', page, size)
    return fetchWrapper.get(`${baseUrl}/status?page=${page}&size=${size}`);
}


function addStatus(data) {
    return fetchWrapper.post(`${baseUrl}/status/add`, data)
        
}
function deleteStatus(id) {
    return fetchWrapper.delete(`${baseUrl}/status/${id}`)
       
}
function statusUpdate(id, name) {
    console.log("update", id, name);
    return fetchWrapper.put(`${baseUrl}/status/${id}`, name)

       
}


//ViewVendor

function getVendor(page, size, search) {
    console.log('inventoryservice', page, size, search)
    return fetchWrapper.get(`${baseUrl}/vendors?page=${page}&size=${size}&search=${search}`)

}

function deleteVendor(id) {
    return fetchWrapper.delete(`${baseUrl}/vendors/${id}`)
      
}

function addVendor(data) {
    return fetchWrapper.post(`${baseUrl}/vendors/add`, data)
        

}
function vendorUpdate(id, data) {
    console.log("update", id, data);
    return fetchWrapper.put(`${baseUrl}/vendors/${id}`, data)

       
}

// Assets
function getAllAssets(it_id, page, size, search) {
    console.log("getAllAssets", it_id, page, size, search);
    return fetchWrapper.get(`${baseUrl}/assets/${it_id}?page=${page}&size=${size}&search=${search}`)
}

function insertDate(data) {
    console.log("insertDate", data);
    return fetchWrapper.post(`${baseUrl}/assets/add`, data)
}

function updateData(id, data) {
    console.log("updateDate", id, data);
    return fetchWrapper.put(`${baseUrl}/assets/${id}`, data)
}

function dropdownList() {
    return fetchWrapper.get(`${baseUrl}/formdata`)
}

function assetsDelete(id) {
    console.log("Assets Delete ID", id);
    return fetchWrapper.delete(`${baseUrl}/assets/${id}`)
}
