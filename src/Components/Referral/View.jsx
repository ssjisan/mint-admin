import { useEffect, useState, useRef } from "react";
import axios from "../../api/axios";
import { Box, Table } from "@mui/material";
import CustomeHeader from "../../Components/Common/Table/CustomeHeader";
import CustomePagination from "../../Components/Common/Table/CustomePagination";
import toast from "react-hot-toast";
import Body from "./View/Body";

export default function View() {
  const columns = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Mobile" },
    { key: "referralId", label: "Referral Id" },
    { key: "totalRequests", label: "Total Requests" },
    { key: "successfulConnections", label: "Successful Connections" },
  ];

  const [referralUsers, setReferralUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const tableRef = useRef(null);
  const [tableWidth, setTableWidth] = useState("auto");

  const loadReferralUsers = async () => {
    try {
      const res = await axios.get("/referral");
      setReferralUsers(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load referral users");
    }
  };

  useEffect(() => {
    loadReferralUsers();
  }, []);

  useEffect(() => {
    if (tableRef.current) setTableWidth(tableRef.current.scrollWidth);
  }, [rowsPerPage, page]);

  const paginatedData = referralUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <Box
      sx={{
        boxShadow:
          "0px 0px 2px rgba(145, 158, 171, 0.2),0px 12px 24px -4px rgba(145,158,171,0.12)",
        borderRadius: "16px",
        p: 2,
        mt: 3,
      }}
    >
      <Box sx={{ overflowX: "auto", maxWidth: "100%", mb: 1 }} ref={tableRef}>
        <Table>
          <CustomeHeader
            columns={columns}
            includeActions={false}
            includeDrag={false}
          />
          <Body referralUsers={paginatedData} columns={columns} />
        </Table>
      </Box>

      <Box sx={{ overflowX: "auto", maxWidth: "100%", width: tableWidth }}>
        <CustomePagination
          count={referralUsers.length}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </Box>
    </Box>
  );
}
