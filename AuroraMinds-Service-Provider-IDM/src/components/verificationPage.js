import React from 'react';
import { useLocation } from 'react-router-dom';
import Typography from "@mui/material/Typography";
import { Container, Button } from "@material-ui/core";

const Verifier = () => {
    const location = useLocation();
    const { revealedInfo } = location.state || {};

    return (
        <Container style={styles.root}>
            <Typography variant="h4" align="center" style={styles.title}>
                Verifier Page
            </Typography>
            <Typography variant="subtitle1" align="center">
                {revealedInfo ? (
                    <div>
                        {Object.entries(revealedInfo).map(([field, value]) => (
                            <div key={field}>
                                <strong>{field}:</strong> {value}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>No credentials to verify.</div>
                )}
            </Typography>
            <Container style={styles.buttonBox}>
                <Button
                    size="medium"
                    variant="outlined"
                    onClick={() => window.location.href = "http://83.212.81.81:10000/app"}
                >
                    Verify and Proceed
                </Button>
            </Container>
        </Container>
    );
};

const styles = {
    root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        background: "linear-gradient(to right, #33a7c4, #74bfc4)",
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
        borderRadius: "20px",
    },
    title: {
        marginBottom: "20px",
        color: "black",
    },
    buttonBox: {
        marginTop: "20px",
    },
};

export default Verifier;
