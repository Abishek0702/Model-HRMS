import { Tab, Tabs } from 'react-bootstrap';
import { Layout } from 'components/employees';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ViewType from "components/inventory/settings/types/ViewType"
import ViewStatus from "components/inventory/settings/status/ViewStatus"
import ViewVendor from "components/inventory/settings/vendor/ViewVendor"

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
        if (section == 'Type') {
            router.push(`/inventory/settings?page=${page}&size=${size}&section=Type`);
        } else if (section == 'Status') {
            router.push(`/inventory/settings?page=${page}&size=${size}&section=Status`);
        }
        else if(section == 'Vendor'){
            router.push(`/inventory/settings?page=${page}&size=${size}&section=Vendor`);   
        }
         else {
            router.push(`/inventory/settings?page=${page}&size=${size}&section=${"Type"}`);
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
                        <Tab eventKey="Type" title="Type">
                          <ViewType/>
                        </Tab>
                        <Tab eventKey="Status" title="Status">
                        <ViewStatus/>
                        </Tab>
                        <Tab eventKey="Vendor" title="Vendor">
                        <ViewVendor/>
                        </Tab>

                    </Tabs>
                </Layout >
            }
        </>
    );
}


export async function getServerSideProps({ params, query }) {
    return {
        props: { section: query.section || 'Type' }
    }
}

