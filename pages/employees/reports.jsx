import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Router from 'next/router';
import { Layout, ViewUser } from 'components/employees';
import { Spinner } from 'components';
import Policies from 'components/employees/Policies';
import ChangePassword from 'components/employees/ChangePassword';
import { userService, alertService } from 'services';
import Reports  from 'components/employees/Reports';




export default Myprofile;

function Myprofile({ id ,section }) {
     
    const router = useRouter();
    const [state, setState] = useState({});
    const [Reportdata, setReportdata] = useState({})

    //var id=16;

    useEffect(() => {
        // fetch user and set default form values if in edit mode
        console.log('j:-');

        handleList();
 
        return () => {
            setState({}); // This worked for me
        };

    }, []);

    const handleList = () => {
        userService.getReport().then((x) => {
            	
            console.log('x:-',x);
            
            if (typeof x !== 'undefined') { setReportdata(x); }
           
        });
    }



     
   
    return (
        <Layout>
 {/* {JSON.stringify(Reportdata)} */}

                {Reportdata ? <Reports Reportdata={Reportdata}  /> : <Spinner /> }
        </Layout>

    );
}


export async function getServerSideProps({ params,query }) {
    return {
        props: { id: 1,section: query.section || 'home' }
    }
}








