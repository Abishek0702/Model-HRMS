import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Router from 'next/router';
import { Layout, ViewBankUser, ViewUser, ViewPersonalIds, ViewFamily, ViewEducation, ViewExperience, ViewReference, ViewAddress } from 'components/employees';
import { Spinner } from 'components';
import { userService, alertService } from 'services';
//import Policies from 'components/employees/Policies';
import RequestLeave from 'components/leaveManagement/ViewUser';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export default View;

function View({ id, section }) {
    const [state, setState] = useState({});
    const [user, setUser] = useState(null);
    const [ActiveKey, setActiveKey] = useState('home')
    const [user_id, setUserid] = useState(null);
    const [designation, setDesignation] = useState("-");
    const [bank, setBank] = useState(null)
    const [p_id, setP_id] = useState(null)
    const [reference, setReference] = useState(null);
    const [address, setAddress] = useState(null);
    const [education, setEducation] = useState(null);
    const [experience, setExperince] = useState(null);
    const [exp, setExp] = useState(null);
    const router = useRouter();

    useEffect(() => {
        setActiveKey(section);  //alert(section);

        // fetch user and set default form values if in edit mode
        const subscription = userService.user.subscribe(x => {
            console.log('x:', x.designation)
            if (x != null) {
                setDesignation(x.designation);
                // userService.getById(id).then(x => setUser(x)).catch(alertService.error);

                EmployeesList(id);

                EmployeeBankList(id)

                EmployeePersonalIdList(id)

                EmployeeReferenceList(id)

                EmployeeAddressList(id)

                EmploeeEducationList(id);

                EmployeeExperinceList(id);
            }
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
        setState({});
        return () => subscription.unsubscribe();
    }, []);

    //setActiveKeynew
    async function setActiveKeynew(section) {
        setActiveKey(section);
        // console.log('setActiveKeynew:', section);
        // if (section == 'home') {
        //     router.push(`/employees/view/${id}?section=home`);
        // } else if (section == 'policy') {
        //     router.push(`/employees/view/${id}?page=1&size=12&section=policy`);
        // } else if (section == 'leave') {
        //     router.push(`/employees/view/${id}?page=1&size=12&section=leave`);
        // } else {
        //     router.push(`/employees/view/${id}?section=${section}`);
        // }
    }

    function EmployeesList(id) {
        userService.getById(id).then(x => setUser(x)).catch(alertService.error);
    }

    function EmployeeBankList(id) {
        userService.getByBankId(id).then(x => {
            if (x.status !== 0) {
                setBank(x)
            }
        })
    }

    function EmployeePersonalIdList(id) {
        userService.getByPersonalIds(id)
            .then(x => {
                if (x.status !== 0) {
                    setP_id(x)
                }
            })
    }

    function EmployeeReferenceList(id) {
        userService.getByReferenceId(id)
            .then((x) => {
                if (x.status === 1) {
                    setReference(x)
                }
            })
    }

    function EmployeeAddressList(id) {
        userService.getById(id).then(x => {
            if (x.status == 1) {
                setAddress(x)
            }
        })
    }

    const EmploeeEducationList = (id) => {
        userService.getByEducationId(id).then(x => {
            if (x.status != 0) {
                setEducation(x)
            }
        });
    }

    const EmployeeExperinceList = (id) => {
        userService.getByExperienceId(id).then(x => {
            if (x.status != 0) {
                setExperince(x.posts)
                setExp(x.summary[0])
            }
        });
    }

    const reloadFun = () => {
        EmployeesList(id)
        EmployeeAddressList(id)
    }

    const reloadBankFun = () => {
        EmployeeBankList(id)
    }

    const reloadPersonalIDFun = () => {
        EmployeePersonalIdList(id)
    }

    const reloadReference = () => {
        EmployeeReferenceList(id)
    }

    const reloadAddress = () => {
        EmployeeAddressList(id)
    }

    const reloadEducation = () => {
        EmploeeEducationList(id)
    }

    const reloadExperince = () => {
        EmployeeExperinceList(id)
    }

    return (
        <Layout>
            {designation == "employee" && <div className="card">
                <div className="card-header   shadow-none text-info text-center">
                    Cant Able to Access This page , Only Admin can access this page
                </div>
            </div>}

            {designation != "employee" && <>


                <Tabs id="controlled-tab-example" activeKey={ActiveKey} onSelect={(k) => setActiveKeynew(k)} className="mb-3"  >


                    <Tab eventKey="home" title="Personal">  {user && id && user ? <ViewUser user={user} user_id={id} type="admin" reloadFun={reloadFun} /> : <Spinner />}  </Tab>

                    <Tab eventKey="bank" title="Bank"  >  {user && id && bank ? <ViewBankUser user={bank} user_id={id} type="employee" reloadFun={reloadBankFun} /> : <Spinner />}  </Tab>

                    <Tab eventKey="ids" title="Personal"  >  {user && id && p_id ? <ViewPersonalIds user={p_id} user_id={id} type="employee" reloadFun={reloadPersonalIDFun} /> : <Spinner />}  </Tab>

                    <Tab eventKey="family" title="Family"  >  {user && id ? <ViewFamily user_id={id} type="employee" reloadFun={reloadPersonalIDFun} /> : <Spinner />}  </Tab>

                    <Tab eventKey="education" title="Education"  >  {user && id && education ? <ViewEducation user={education} user_id={id} type="employee" reloadFun={reloadEducation} /> : <Spinner />}  </Tab>

                    <Tab eventKey="experience" title="Experience"  >  {user && id && experience ? <ViewExperience user={experience} exp={exp} user_id={id} type="employee" reloadFun={reloadExperince} /> : <Spinner />}  </Tab>



                    <Tab eventKey="reference" title="Reference"  > {user && id && reference ? <ViewReference user={reference} user_id={id} type="employee" reloadFun={reloadReference} /> : <Spinner />}  </Tab>

                    <Tab eventKey="address" title="Address"  > {user && id && address ? < ViewAddress user={address} user_id={id} type="employee" reloadFun={reloadAddress} /> : <Spinner />}  </Tab>

                    {/* <Tab eventKey="experience" title="Experience Details"  >  {user && id ? <ViewExperience user_id={id} type="employee" /> : <Spinner />}  </Tab> */}


                    {/* <Tab eventKey="policy" title="Policy Status">  {user && id ? <Policies user={user} user_id={id} type="admin" /> : <Spinner /> }  </Tab> */}
                    <Tab eventKey="leave" title="Leave"  >  {user && id ? <RequestLeave user={user} user_id={id} type="admin" /> : <Spinner />}  </Tab>
                    {/* <Tab eventKey="bank" title="Bank Details"  >   Bank Details   </Tab> */}
                </Tabs>

            </>}
        </Layout>

    );
}


export async function getServerSideProps({ params, query }) {
    return {
        props: { id: params.id, section: query.section || 'home' }
    }
}








