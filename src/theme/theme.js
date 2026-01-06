import { createTheme } from "@mui/material/styles";

// Color Palettes
const lightPalette = {
    mode: "light",
    primary: {
        main: "#6366f1", // Indigo
        light: "#818cf8",
        dark: "#4338ca",
        contrastText: "#ffffff",
    },
    secondary: {
        main: "#ec4899", // Pink
        light: "#f472b6",
        dark: "#db2777",
        contrastText: "#ffffff",
    },
    background: {
        default: "#f8fafc",
        paper: "rgba(255, 255, 255, 0.7)", // Glass effect base
    },
    text: {
        primary: "#1e293b",
        secondary: "#64748b",
    },
};

const darkPalette = {
    mode: "dark",
    primary: {
        main: "#818cf8",
        light: "#a5b4fc",
        dark: "#4f46e5",
        contrastText: "#ffffff",
    },
    secondary: {
        main: "#f472b6",
        light: "#fbcfe8",
        dark: "#be185d",
        contrastText: "#ffffff",
    },
    background: {
        default: "#0f172a",
        paper: "rgba(30, 41, 59, 0.7)", // Glass effect base
    },
    text: {
        primary: "#f8fafc",
        secondary: "#94a3b8",
    },
};

// Common Component Overrides
const getComponents = (mode) => ({
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundImage: "none",
                backdropFilter: "blur(12px)",
                border: `1px solid ${mode === "light" ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.05)"}`,
                boxShadow: mode === "light"
                    ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease-in-out",
            },
        },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 600,
                padding: "10px 24px",
                boxShadow: "none",
                "&:hover": {
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)", // Glow effect
                },
            },
            containedPrimary: {
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            },
            containedSecondary: {
                background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
            },
        },
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: mode === "light" ? "rgba(255,255,255,0.5)" : "rgba(15, 23, 42, 0.5)",
                    "& fieldset": {
                        borderColor: mode === "light" ? "rgba(226, 232, 240, 1)" : "rgba(51, 65, 85, 1)",
                    },
                    "&:hover fieldset": {
                        borderColor: "#6366f1",
                    },
                },
            },
        },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: "20px",
            },
        },
    },
});

export const getTheme = (mode) =>
    createTheme({
        palette: mode === "light" ? lightPalette : darkPalette,
        typography: {
            fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
            h1: { fontWeight: 800 },
            h2: { fontWeight: 700 },
            h3: { fontWeight: 700 },
            h4: { fontWeight: 600 },
            h5: { fontWeight: 600 },
            h6: { fontWeight: 600 },
            button: { fontWeight: 600 },
        },
        shape: {
            borderRadius: 16,
        },
        components: getComponents(mode),
    });
