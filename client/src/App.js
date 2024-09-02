import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Snackbar, Alert, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

// Define a custom theme with a light green and white color scheme
const theme = createTheme({
  palette: {
    primary: {
      main: '#388e3c',  // Light Green
    },
    secondary: {
      main: '#ffffff',  // White
    },
    background: {
      default: '#e8f5e9',  // Light Green Background
      paper: '#ffffff',  // White Paper Background
    },
  },
  typography: {
    h4: {
      fontWeight: 700,
      color: '#388e3c',  // Light Green
    },
    subtitle1: {
      color: '#4caf50',  // Slightly darker green for subtitle
    },
    h6: {
      color: '#1b5e20',  // Darker green for URLs
    },
  },
});

function App() {
    const [url, setUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!url) {
            setErrorMessage("Please enter a valid URL.");
            setOpenSnackbar(true);
            return;
        }

        try {
            const response = await axios.get(`/api/shorten-url`, {
                params: { url }
            });
            setShortUrl(response.data.shortUrl);
            setUrl(''); // Clear input after submission
        } catch (error) {
            setErrorMessage("There was an error shortening the URL. Please try again.");
            setOpenSnackbar(true);
            console.error("There was an error shortening the URL!", error);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm" style={{ marginTop: '100px' }}>
                <Paper elevation={4} style={{ padding: '30px', borderRadius: '12px', backgroundColor: theme.palette.background.paper }}>
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h4" gutterBottom>
                            Shaan URL Shortener
                        </Typography>
                        <Typography variant="subtitle1">
                            Shorten your long URLs quickly and easily!
                        </Typography>
                    </Box>
                    <form onSubmit={handleSubmit}>
                        <Box mb={2}>
                            <TextField
                                label="Enter URL to shorten"
                                variant="outlined"
                                fullWidth
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                helperText="Make sure to include http:// or https://"
                            />
                        </Box>
                        <Box textAlign="center" mb={2}>
                            <Button type="submit" variant="contained" color="primary" size="large">
                                Shorten URL
                            </Button>
                        </Box>
                    </form>
                    {shortUrl && (
                        <Box textAlign="center" mt={4}>
                            <Typography variant="h6">
                                Shortened URL: 
                                <a href={shortUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '5px', color: '#1b5e20', textDecoration: 'underline' }}>
                                    {shortUrl}
                                </a>
                            </Typography>
                        </Box>
                    )}
                    <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                            {errorMessage}
                        </Alert>
                    </Snackbar>
                </Paper>
            </Container>
        </ThemeProvider>
    );
}

export default App;
