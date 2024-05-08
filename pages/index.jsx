import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Router from 'next/router';
import { userService } from 'services';
import { Link } from 'components';
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { Spinner } from 'components';

import Reports from 'components/employees/Reports';
import Holidays from 'components/employees/Holidays';


import DashboardAdmin from 'components/dashboard/DashboardAdmin';
import DashboardUser from 'components/dashboard/DashboardUser';
import { initializeStore } from 'store';


export default Home;

function Home() {
    const boss = useSelector(state => state.boss);
    const countvalue = useSelector(state => state.countvalue);

    const data = useSelector(state => state.userList)

    const router = useRouter();
    const [state, setState] = useState({});
    const [Reportdata, setReportdata] = useState({})
    const [usersList, setUserList] = useState(null)

    //var id=16;

    useEffect(() => {
        // fetch user and set default form values if in edit mode
        console.log('j:-');

        // handleList();

        userListCreate()

        return () => {
            setState({}); // This worked for me
        };

    }, []);

    const handleList = () => {
        userService.getReport().then((x) => {

            console.log('x:-', x);

            if (typeof x !== 'undefined') { setReportdata(x); }

        });
    }

    const dispatch = useDispatch()

    const da = useSelector(state => state.boss)
    const userListCreate = () => {
        userService.userList().then(x => {
            console.log(x)
            dispatch({type:'MASS',userList:x})
            // initializeStore({type:'MASS',userList:x})
        })
    }

    console.log("REDUX",data);   
    const close = useSelector(state => state.close);


    return (
        <div className="p-4 dashboard">
            <div className="container-fluid">
                {/* <h1>Hi {userService.userValue?.username}!</h1>

                <h1>department_id: {userService.userValue?.department_id}!</h1>
                
star */}

                {userService.userValue?.department_id == 2 && <DashboardAdmin />}
                {userService.userValue?.department_id !== 2 && <DashboardUser />}




            </div>
        </div>
    );
}
