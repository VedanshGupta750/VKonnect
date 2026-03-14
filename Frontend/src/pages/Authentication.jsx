import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const defaultTheme = createTheme();

export default function Authentication() {
    let[userName , setUserName] = React.useState();
    let[password , setPassword] = React.useState();
    let[name , setName] = React.useState();
    let[error , setError] = React.useState();
    let[message ,setMessage] = React.useState();
    let[formState , setFormstate] = React.useState(0);
    let[open , setOpen] = React.useState(false);
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
            <Button variant={formState===0 ? "contained" : ""}onClick={()=> setFormstate(0)}>
                SignUp
            </Button>
            <Button variant={formState===1 ? "contained" :""} onClick={()=> setFormstate(1)}>
                Sign In
            </Button>
            </div>

            <Box component="form" noValidate sx={{ mt: 1, width: "100%" }}>
                {formState===1 ?  <TextField
                margin="normal"
                required
                fullWidth
                label="Full name"
                name="name"
                autoFocus
                onChange={(e)=> setName(e.target.value)}
              /> : <></>}
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                name="username"
                autoFocus
                 onChange={(e)=> setUserName(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                 onChange={(e)=> setPassword(e.target.value)}
              />

              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}