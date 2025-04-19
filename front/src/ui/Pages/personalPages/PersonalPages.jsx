import Header from "../../component/Header/Header.jsx";
import {Button} from "react-bootstrap";
import {useContext,} from "react";
import {AppContext} from "../../../core/context/Context.jsx";
import BuyToken from "../../component/BuyToken/BuyToken.jsx";
import GetBalance from "../../component/GetBalance/GetBalance.jsx";
import SetProposal from "../../component/SetProposal/SetProposal.jsx";

const PersonalPages = () => {

    const {login, wallet} = useContext(AppContext);


    return (
        <div>
            <Header/>
            {
                wallet === "" ?
                    <Button className="btn container" onClick={login} > авторизоваться </Button> :
                    <>
                        <GetBalance/>
                        <BuyToken/>
                        <SetProposal/>
                    </>

            }
        </div>
    )
}
export default PersonalPages;