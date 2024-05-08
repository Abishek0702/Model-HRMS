import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout, AddEdit, Bank, PersonalId, EducationDetails, FamilyDetails, ExperienceDetails, Address, ReferenceDetail,PayslipListing } from 'components/employees';

import { Spinner } from 'components';
import { userService, alertService } from 'services';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export default Edit;

function Edit({ id, section }) {
    const [user, setUser] = useState(null);
    const [bank, setBank] = useState(null);
    const [p_id, setP_id] = useState(null);
    const [reference, setReference] = useState(null);
    const [education, setEducation] = useState(null)
    const [active, setActive] = useState('p_details');
    const Router = useRouter();

    useEffect(() => {
        setActive(section)
        userService.getByBankId(id)
            .then(x => {
                console.log(x)
                if (x.status !== 0) {
                    setBank(x)
                }
            })

        userService.getByPersonalIds(id)
            .then(x => {
                console.log(x)
                if (x.status !== 0) {
                    setP_id(x)
                }
            })

            userService.getByReferenceId(id).then(x => {
                console.log(x)
                if (x.status !== 0) {
                    setReference(x)
                }
            })

        userService.getById(id)
            .then(x => setTimeout(() => setUser(x), 500))
            .catch(alertService.error)

    }, [""]);


    async function handleActiveKey(section) {
        setActive(section);
        // if (section == 'p_details') {
        //     Router.push(`/employees/edit/${id}?section=p_details`)
        // }
        // else if (section == 'bankDetails') {
        //     Router.push(`/employees/edit/${id}?section=bankDetails`)
        // }
        // else if (section == 'p_id') {
        //     Router.push(`/employees/edit/${id}?section=p_id`)
        // }
        // else {
        //     Router.push(`/employees/edit/${id}?section=${section}`)
        // }
    }

    return (
        <Layout>
            <h1>Edit User #GL10{id}</h1>
            <Tabs id='controlled-tab-example' activeKey={active} onSelect={(k => { handleActiveKey(k) })} className='mb-3'>

                <Tab eventKey='p_details' title="Personal Info" >
                    {user ? <AddEdit user={user} /> : <Spinner />}
                </Tab>

                <Tab eventKey='bankDetails' title="Bank Info" >
                    {user && bank ? <Bank user_id={user.id} bank={bank} /> : user && !bank ? <Bank user_id={user.id} /> : <Spinner />}
                </Tab>

                <Tab eventKey='address' title="Address" >
                    {user ? <Address user_id={user.id} user={user} /> : <Spinner />}
                </Tab>

                <Tab eventKey='p_id' title="Personal ID" >
                    {user && p_id ? <PersonalId user_id={user.id} p_id={p_id} /> : user && !p_id ? <PersonalId user_id={user.id} /> : <Spinner />}
                </Tab>

                <Tab eventKey='educationInfo' title="Education Details" >
                    {user ? <EducationDetails user_id={user.id} /> : <Spinner />}
                </Tab>

                <Tab eventKey="experience" title="Experience Details"  >   {user ? <ExperienceDetails user_id={user.id} type="employee" /> : <Spinner />}  </Tab>

                <Tab eventKey='familyInfo' title="Family Info" >
                    {user ? <FamilyDetails user_id={user.id} /> : <Spinner />}
                </Tab>

                <Tab eventKey='reference' title="Reference Detail" >
                    {user && reference ? <ReferenceDetail user_id={user.id} reference={reference} /> : user && !reference ? <ReferenceDetail user_id={user.id} /> : <Spinner />}
                </Tab>

               {id==44 &&  <Tab eventKey='payslip' title="Payslip Info" >
                    {user ? <PayslipListing user_id={user.id} /> : <Spinner />}
                </Tab> }

            </Tabs>
        </Layout>
    );
}

export async function getServerSideProps({ params, query }) {
    return {
        props: { id: params.id, section: query.section || 'p_details' }
    }
}

