import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const defaultTheme = createTheme();

export default function Authentication() {
  const { handleRegister, handleLogin } = useAuth();

  let [userName, setUserName] = React.useState("");
  let [password, setPassword] = React.useState("");
  let [name, setName] = React.useState("");
  let [error, setError] = React.useState("");
  let [message, setMessage] = React.useState("");

  let [formState, setFormstate] = React.useState(0);
  let [open, setOpen] = React.useState(false);

  const navigate = useNavigate();
  let handleAuth = async () => {
    try {
      setError("");

      if (formState === 0) {
        let result = await handleLogin(userName, password);

        console.log(result);
        setMessage(result);
        setOpen(true);
        setError("");
        setUserName("");
        setPassword("");
        navigate("/home");
      }
       if (formState === 1) {
        let result = await handleRegister(name, userName, password);

        console.log(result);
        setMessage(result);
        setOpen(true);
        setError("");
        setName("");
        setUserName("");
        setPassword("");
        setFormstate(0);
      }
    } catch (err) {
      console.log(err);

      let msg = err.response.data.message || "Something went wrong";
      setError(msg);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Paper elevation={6} sx={{ padding: 4, width: 380 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>

            <div>
              <Button
                variant={formState === 0 ? "contained" : ""}
                onClick={() => setFormstate(0)}
              >
                Login
              </Button>

              <Button
                variant={formState === 1 ? "contained" : ""}
                onClick={() => setFormstate(1)}
              >
                Sign Up
              </Button>
            </div>

            <Box component="form" noValidate sx={{ mt: 1, width: "100%" }}>
              {formState === 1 && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Full name"
                  name="name"
                  value={name}
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                />
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                name="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <p style={{ color: "red" }}>{error}</p>

              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleAuth}
              >
                {formState === 0 ? "Login" : "Register"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Snackbar open={open} autoHideDuration={4000} message={message} />
    </ThemeProvider>
  );
}
