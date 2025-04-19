import {createBrowserRouter} from "react-router-dom";
import PersonalPages from "../../ui/Pages/personalPages/PersonalPages.jsx";
import Propsal from "../../ui/Pages/Proposal/Propsal.jsx";
import Voting from "../../ui/Pages/Voting/Voting.jsx";

const routes = [

    {
        path: "/",
        element: <PersonalPages />,
    },

    {
        path: "/propsal",
        element: <Propsal />,
    },

    {
        path: "/voting",
        element: <Voting />,
    }
];

const router = createBrowserRouter(routes);
export {router};