import Attendance from "../../components/attendance/Attendance";
import { Tab, Tabs } from 'react-bootstrap';
import { Layout } from 'components/employees';
import AttendanceDaily from "components/attendance/AttendanceDaily";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
export default Index;

function Index(props) {
    const router = useRouter();

    var page = router.query.page || 1;
    var size = router.query.size || 6;

    const [ActiveKey, setActiveKey] = useState('DailyReport');
    useEffect(() => {
        setActiveKey(props.section);
    }, [])


    async function setActiveKeynew(section) {
        setActiveKey(section);
        if (section == 'AllReport') {
            router.push(`/attendance?page=${page}&size=${size}&section=AllReport`);
        } else if (section == 'DailyReport') {
            router.push(`/attendance?page=${page}&size=${size}&section=DailyReport`);
        } else {
            router.push(`/attendance?page=${page}&size=${size}&section=${"AllReport"}`);
        }
    }



    return (
        <>
            {props.userdata.designation == "employee" && <div className="card">
                <div className="card-header   shadow-none text-info text-center">
                    Cant Able to Access This page , Only Admin can access this page
                </div>
            </div>}

            {props.userdata.designation != "employee" &&
                <Layout>
                    <Tabs activeKey={ActiveKey} onSelect={(k) => setActiveKeynew(k)}>
                       
                        <Tab eventKey="DailyReport" title="Daily Report">
                            <AttendanceDaily />
                        </Tab>
                        <Tab eventKey="AllReport" title="Attendance Logs">
                            <Attendance />
                        </Tab>
                       

                    </Tabs>
                </Layout >
            }
        </>
    );
}


export async function getServerSideProps({ params, query }) {
    return {
        props: { section: query.section || 'DailyReport' }
    }
}

