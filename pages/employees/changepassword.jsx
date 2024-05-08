import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Router from 'next/router';
import { Layout, ViewUser } from 'components/employees';
import { Spinner } from 'components';
import ChangePassword from 'components/employees/ChangePassword';
import { userService, alertService } from 'services';
 




export default Myprofile;

function Myprofile({ id ,section }) {
     
    const [user, setUser] = useState(null);
    const [user_id, setUserid] = useState(null);
    
    

    //var id=16;

    useEffect(() => {
        
        const subscription = userService.user.subscribe(x => {
            console.log('x:',x)
			if (x != null) {
                setUserid(x.id)
				userService.getById(x.id).then(x => setUser(x)).catch(alertService.error)
			}
		});

 

        // eslint-disable-next-line react-hooks/exhaustive-deps
        return () => subscription.unsubscribe();
	}, []);



     
   
    return (
        <Layout>
 {/* {JSON.stringify(Reportdata)} */}

 {user && user_id ? <ChangePassword user={user} user_id={user_id} type="employee" /> : <Spinner /> } 
        </Layout>

    );
}


export async function getServerSideProps({ params,query }) {
    return {
        props: { id: 1,section: query.section || 'home' }
    }
}








