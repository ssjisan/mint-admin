import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../DataProcessing/DataProcessing";
import { Alert, EyeOff, EyeOn } from "../../assets/IconSet";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import toast from "react-hot-toast";

export default function InputFields() {
  const forBelow776 = useMediaQuery("(max-width:776px)");
  const { showPassword, handleClickShowPassword, handleMouseDownPassword } =
    useContext(DataContext);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberMe") === "true",
  );
  const { auth, setAuth } = useContext(DataContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  // Only restore email (never password)
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const { data } = await axios.post("/login", {
        email,
        password,
      });

      // Save only token
      sessionStorage.setItem(
        "auth",
        JSON.stringify({
          token: data.token,
          user: data.user,
        }),
      );

      // Remember only email (optional)
      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("rememberMe");
      }

      setAuth({
        ...auth,
        token: data.token,
        user: data.user,
      });

      toast.success("Login Successful");
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.error || "Login failed. Please try again.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        width: "100%",
        mt: "40px",
        mb: forBelow776 ? "80px" : "160px",
      }}
    >
      <Stack gap="24px">
        {errorMessage && (
          <Stack
            flexDirection="row"
            alignItems="center"
            sx={{
              background: "#FFE9D5",
              p: "8px 16px",
              borderRadius: "12px",
              minHeight: "48px",
            }}
          >
            <Alert size="24" color="#FF5630" />
            <Typography variant="body2" sx={{ color: "#FF5630", ml: 1 }}>
              {errorMessage}
            </Typography>
          </Stack>
        )}

        <TextField
          label="Your Email"
          type="email"
          value={email}
          fullWidth
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <FormControl variant="outlined" required>
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? (
                    <EyeOn color="#918EAF" size="24px" />
                  ) : (
                    <EyeOff color="#918EAF" size="24px" />
                  )}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
      </Stack>

      <Stack gap="16px">
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            }
            label="Remember me"
          />
        </FormGroup>

        <Button variant="contained" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Stack>
    </Box>
  );
}
