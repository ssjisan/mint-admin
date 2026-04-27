import {
  Stack,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import NoData from "../../../assets/NoData";

export default function Body({ referralUsers }) {
  if (!referralUsers.length) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5}>
            <Stack
              sx={{ width: "100%", mt: "32px", mb: "32px" }}
              gap="8px"
              alignItems="center"
            >
              <NoData />
              <Typography variant="body1" color="text.secondary">
                No referral users found!
              </Typography>
            </Stack>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {referralUsers.map((user) => (
        <TableRow hover key={user._id}>
          <TableCell>{user.name}</TableCell>
          <TableCell>{user.phone}</TableCell>
          <TableCell>{user.referralId}</TableCell>
          <TableCell>{user.totalRequests}</TableCell>
          <TableCell>{user.successfulConnections}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
