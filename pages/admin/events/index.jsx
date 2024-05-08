 
import EventListing from "components/events/events";



export default Index;

function Index(props) {
    return (
        <>
            {props.userdata.designation == "employee" &&
                <div className="card">
                    <div className="card-header   shadow-none text-info text-center">
                        Cant Able to Access This page , Only Admin can access this page
                    </div>
                </div>}

            {props.userdata.designation != "employee" &&

                <EventListing />

            }
        </>
    );
}
