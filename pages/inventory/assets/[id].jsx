import { Tab, Tabs } from 'react-bootstrap';
import { Layout } from 'components/employees';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ViewAssets from 'components/inventory/assets/ViewAssets';

export default Index;

function Index(props) {
    const router = useRouter();

    var page = router.query.page || 1;
    var size = router.query.size || 10;

    const [ActiveKey, setActiveKey] = useState('inventory');
    useEffect(() => {
        setActiveKey(props.section);
    }, [])


    async function setActiveKeynew(section) {
        setActiveKey(section);
        if (section == 'IT') {
            router.push(`/inventory/assets/1?page=${page}&size=${size}&section=IT`);
        } else if (section == 'NonIT') {
            router.push(`/inventory/assets/2?page=${page}&size=${size}&section=NonIT`);
        }
         else {
            router.push(`/inventory/assets/1?page=${page}&size=${size}&section=${"IT"}`);
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
                        <Tab eventKey="IT" title="IT">
                         <ViewAssets/>
                        </Tab>
                        <Tab eventKey="NonIT" title="NonIT">
                        <ViewAssets/>
                        </Tab>
                       

                    </Tabs>
                </Layout >
            }
        </>
    );
}


export async function getServerSideProps({ params, query }) {
    return {
        props: { section: query.section || 'IT' }
    }
}

