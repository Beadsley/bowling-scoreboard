import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#fff',
            main: 'rgb(23, 105, 170)',
            dark: '#000'
        },
        secondary: {
            main: '#58a5f0',
        },
    },
    typography: {
        useNextVariants: true
    }
});