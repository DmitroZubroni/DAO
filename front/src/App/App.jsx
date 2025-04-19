import {AppProvider} from "../core/context/Context.jsx";
import {RouterProvider} from "react-router-dom";
import {router} from "../core/routing/Router.jsx";

const App = () => {
    return (
        <AppProvider>
            <RouterProvider router={router}/>
        </AppProvider>
    )
}
export default App;