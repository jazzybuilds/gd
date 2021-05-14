import React from 'react'
import { ThemeProvider } from 'styled-components';
import { theme } from "../theme"
import "../styles/core.scss"
import "react-datepicker/dist/react-datepicker.css";


export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
}
