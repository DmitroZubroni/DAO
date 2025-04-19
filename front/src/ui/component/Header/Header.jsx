import {Link} from "react-router-dom";
import {useContext} from "react";
import {AppContext} from "../../../core/context/Context.jsx";

const Header = () => {

    const {logOut, wallet} = useContext(AppContext);

    return (
        <div className="navbar" style={{backgroundColor: 'blueviolet', color: 'white', padding: '10px'}}>
            <h2> Система ДАО </h2>
            {
                wallet === "" ?
                <>
                    <Link to="/" className="btn btn-primary"> личный кабинет </Link>
                    <Link to="/propsal" className="btn btn-primary"> просмотр предложения </Link>
                </>    :
                    <>
                        <Link to="/" className="btn btn-primary" onClick={logOut}> выйти </Link>
                        <Link to="/" className="btn btn-primary"> личный кабинет </Link>
                        <Link to="/propsal" className="btn btn-primary"> просмотр предложения </Link>
                        <Link to="/voting" className="btn btn-primary"> голосование </Link>
                    </>
            }

        </div>
    )
}
export default Header