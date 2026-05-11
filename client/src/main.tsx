import { render } from "preact";
import "./index.css";
import { App } from "./app.tsx";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "./providers/ToastProvider";
import { AxiosProvider } from "./providers/AxiosProvider";

render(
  <ToastProvider>
    <AxiosProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AxiosProvider>
  </ToastProvider>,
  document.getElementById("app")!
);
