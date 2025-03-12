import "./Login.css";

function Login(){
    return (
        <div className="Login-Container">
            <h1>Login or Sign Up</h1>
            <h3>Choose the account you want to continue with...</h3>
            <div className="Login-Information">
                <div className = "Google">
                    <img src="https://img.icons8.com/color/48/000000/google-logo.png"/>
                    <h2>Continue With Google</h2>
                </div>
                <div className="Twitter">
                    <img src="https://img.icons8.com/color/48/000000/twitter--v1.png"/>
                    <h2>Continue With Twitter</h2>
                </div>
                <div className="Meta">
                    <img src="https://img.icons8.com/color/48/000000/meta.png"/>
                    <h2>Continue With Meta</h2>
                </div>
            </div>
        </div>
    )
};

export default Login;