import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Router from 'next/router';
import { Layout, ViewBankUser, ViewUser, ViewPersonalIds, ViewFamily, ViewEducation, ViewExperience, ViewReference, ViewAddress } from 'components/employees';
import { Spinner } from 'components';
//import Policies from 'components/employees/Policies';
//import ChangePassword from 'components/employees/ChangePassword';
import { userService, alertService } from 'services';
 
//import RequestLeave from 'components/leaveManagement/ViewUser';


import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';



export default Myprofile;

function Myprofile({  section }) {
    const [user, setUser] = useState(null);
    const [user_id, setUserid] = useState(null);
    const router = useRouter();
    const [ActiveKey, setActiveKey] = useState('policy')
    const [bank, setBank] = useState(null)
    const [p_id, setP_id] = useState(null)

    //var id=16;

    useEffect(() => {
        // fetch user and set default form values if in edit mode
        setActiveKey(section); 

        const subscription = userService.user.subscribe(x => {
            console.log('x:',x)
			if (x != null) {
                setUserid(x.id)
				// userService.getById(x.id).then(x => setUser(x)).catch(alertService.error)
                EmployeesList(x.id)


                userService.getByBankId(x.id)
                .then(x => {
                    console.log(x)
                    if (x.status !== 0) {
                        setBank(x)
                    }
                })
    
    
            userService.getByPersonalIds(x.id)
                .then(x => {
                    if (x.status !== 0) {
                        setP_id(x)
                    }
                })
    


                
			}
		});


       


        // eslint-disable-next-line react-hooks/exhaustive-deps
        return () => subscription.unsubscribe();
	}, []);


    //setActiveKeynew
	async function setActiveKeynew(section){
        setActiveKey(section); 
        // console.log('setActiveKeynew:',section);
        // if(section=='home'){
        //       router.push(`/employees/myprofile?section=home`);
        // }else if(section=='policy'){
        //       router.push(`/employees/myprofile?page=1&size=12&section=policy`);
        // }else if(section=='leave'){
        //       router.push(`/employees/myprofile?page=1&size=12&section=leave`);
        // }else{
        //     router.push(`/employees/myprofile?section=${section}`); 
        // }
   }

   function EmployeesList(id) { userService.getById(id).then(x => setUser(x)).catch(alertService.error); }

    const reloadFun = (id) => { EmployeesList(id) }
   
    return (
        <Layout>


<Tabs  id="controlled-tab-example"  activeKey={ActiveKey}    onSelect={(k) => setActiveKeynew(k)}   className="mb-3"  >
                   
                   
            <Tab eventKey="home" title="Personal info">  {user && user_id ? <ViewUser user={user} user_id={user_id} type="employee"  reloadFun={reloadFun} /> : <Spinner />}  </Tab>

            <Tab eventKey="address" title="Address"  > {user && user_id ? < ViewAddress user_id={user_id} type="employee" /> : <Spinner />}  </Tab>

            <Tab eventKey="bank" title="Bank"  >  {user && user_id ? <ViewBankUser user={bank} user_id={user_id} type="employee" /> : <Spinner />}  </Tab>

            <Tab eventKey="ids" title="Personal Id's"  >  {user && user_id ? <ViewPersonalIds user={p_id} user_id={user_id} type="employee" /> : <Spinner />}  </Tab>

            <Tab eventKey="family" title="Family"  >  {user && user_id ? <ViewFamily user_id={user_id} type="employee" /> : <Spinner />}  </Tab>

            <Tab eventKey="education" title="Education"  >  {user && user_id ? <ViewEducation user_id={user_id} type="employee" /> : <Spinner />}  </Tab>

            <Tab eventKey="experience" title="Experience"  >  {user && user_id ? <ViewExperience user_id={user_id} type="employee" /> : <Spinner />}  </Tab>

            <Tab eventKey="reference" title="Reference"  > {user && user_id ? <ViewReference user_id={user_id} type="employee" /> : <Spinner />}  </Tab>

            </Tabs>


        </Layout>

    );
}


export async function getServerSideProps({ params,query }) {
    return {
        props: {  section: query.section || 'home' }
    }
}








