// FirebaseDataTable Functions
import DateBetweenFilter from "./DateBetweenFilter"
import DefaultColumnFilter from "./DefaultColumnFilter"
import FilterGreaterThan from "./FilterGreaterThan"
import SelectColumnFilter from "./SelectColumnFilter"
import DateRangeColumnFilter from "./DateRangeColumnFilter";

// Dependencies for data
import moment from "moment";
import QRCode from "../../Components/QRCode";

// Must create header data for each type of table used
export const tableData = {
    "sign-ins": {
        Header: "Sign In Data",
        columns: [
        {
            Header: "User ID",
            accessor: "userID",
            aggregate: "count",
            Aggregated: ({ value }) => `${value} Names`,
        },
        {
            Header: "Course Name",
            accessor: "courseName",
            filter: "fuzzyText",
            aggregate: "uniqueCount",
            Aggregated: ({ value }) => `${value} Unique Names`,
        },
        {
            Header: "Course ID",
            accessor: "courseID",
            filter: "fuzzyText",
            aggregate: "uniqueCount",
            Aggregated: ({ value }) => `${value} Unique Names`,
        },
        {
            Header: "Date",
            accessor: (d) => {
            return moment(d.timestampLogged.toDate())
                .local()
                .format("MM-DD-YYYY hh:mm:ss a");
            },
            Filter: DateRangeColumnFilter,
            filter: "dateBetween",
            aggregate: "sum",
            Aggregated: ({ value }) => `${value} (total)`,
        },
        {
            Header: "Archival Status",
            accessor: (d) => {
            return d.isArchived ? "True" : "False";
            },
            Filter: SelectColumnFilter,
            filter: "includes",
        },
        ],
    },

    "courses": {
        Header: "Course Data",
        columns: [
        {
            Header: "Course Name",
            accessor: "courseName",
            filter: "fuzzyText",
            aggregate: "uniqueCount",
            Aggregated: ({ value }) => `${value} Unique Names`,
        },
        {
            Header: "Course ID",
            accessor: "courseID",
            filter: "fuzzyText",
            aggregate: "uniqueCount",
            Aggregated: ({ value }) => `${value} Unique Names`,
        },
        {
            Header: "QR Code",
            accessor: (d) => {
                return <QRCode value={d.courseID.toString()} />
            },
            filter: "fuzzyText",
            aggregate: "uniqueCount",
            Aggregated: ({ value }) => `${value} Unique Names`,
        },
        {
            Header: "Time Created",
            accessor: (d) => {
                return moment(d.timeCreated.toDate())
                    .local()
                    .format("MM-DD-YYYY hh:mm:ss a");
            },
            Filter: DateRangeColumnFilter,
            filter: "dateBetween",
            aggregate: "sum",
            Aggregated: ({ value }) => `${value} (total)`,
        },
        ],
    }
}

export default tableData