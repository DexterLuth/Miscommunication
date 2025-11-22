import {useState, useEffect, useMemo} from 'react';
import DataTable, { createTheme } from "react-data-table-component";

export default function StatsTable({stats}) {
    //stats format
    // const [stats, setStats] = useState([{
    //     agent_id: null,
    //     first_name: null,
    //     last_name: null,
    //     interaction_count: null,
    //     average_score: null
    // }]);

    const columns = useMemo(() => [
      
        {
            name: 'First Name',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: row => row.last_name,
            sortable: true,
        },
        {
            name: 'Interaction Count',
            selector: row => row.interaction_count,
            sortable: true,
        },
        {   
            name: 'Average Score',
            selector: row => row.average_score,
            sortable: true,
        },
    ], []);

  

    createTheme("nice", {
        text: {
        primary: "#212529",
        secondary: "#6c757d",
        },
        background: {
        default: "#ffffff",
        context: {
            background: "#e3f2fd",
            text: "#212529",
        },
        divider: {
            default: "#dee2e6",
        },
        button: {
            default: "#e0e0e0",
            hover: "#cfcfcf",
            focus: "#bdbdbd",
            disabled: "#f5f5f5",
        },
        sortFocus: {
            default: "#007bff",
        },
        highlightOnHover: {
            default: "#f1f1f1",
            text: "#212529",
        },
        striped: {
            default: "#f9f9f9ff",
            text: "#212529",
        },
        },
    });

    return (
        <>
        <DataTable
            columns={columns}
            data={stats}
            theme="nice"
            highlightOnHover
            striped
        />
        </>
    );
}
