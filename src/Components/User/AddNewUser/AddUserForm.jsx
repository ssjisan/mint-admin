import {
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { useState } from "react";

import toast from "react-hot-toast";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";
export default function AddUserForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(true);

  const password = "12345678";
  const role = 0;

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/register", {
        name,
        email,
        password,
        role,
        isActive,
      });
      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success("User Created!");
        navigate("/user_list");
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };
  return (
    <Stack spacing={3} onSubmit={handleRegister} component="form">
      <TextField
        label="User Name"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <TextField
        label="User Email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            color="primary"
          />
        }
        label={isActive ? "Active" : "Inactive"}
      />
      <Button variant="contained" color="primary" type="submit">
        Create
      </Button>
    </Stack>
  );
}
