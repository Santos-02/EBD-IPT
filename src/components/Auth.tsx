import { useState, useRef } from "react";
import Image from "../assets/image.jpg";
import Logo from "../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function Auth() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth() as { login: (email: string, password: string) => Promise<any> };

    const handleLogin = async (e: any) => {
        e.preventDefault();
        try {
            setErrorMsg("");
            setLoading(true);
            if (!passwordRef.current?.value || !emailRef.current?.value) {
                setErrorMsg("Por favor, preencha os campos");
                return;
            }
            const {
                data: { user, session },
                error
            } = await login(emailRef.current.value, passwordRef.current.value);
            if (error) setErrorMsg(error.message);
            if (user && session) navigate("/");
        } catch (error) {
            setErrorMsg("Email ou senha incorretos");
        }
        setLoading(false);
    };

    return (
        <div className="login-main">
            <div className="login-left">
                <img src={Image} alt="" />
            </div>
            <div className="login-right">
                <div className="login-right-container">
                    <div className="login-logo">
                        <img src={Logo} alt="" />
                    </div>
                    <div className="login-center">
                        <h2>Igreja Presbiteriana de Teresópolis</h2>
                        <p>Escola Bíblica Dominical</p>
                        <form className="form-widget" onSubmit={handleLogin}>

                            <div>
                                <input
                                    ref={emailRef}
                                    className="pass-input-div"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    required={true}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="pass-input-div">
                                <input
                                    ref={passwordRef}
                                    className="pass-input-div"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Senha"
                                    value={password}
                                    required={true}
                                    onChange={(e) => setPassword(e.target.value)} />
                                {showPassword ? <FaEyeSlash onClick={() => { setShowPassword(!showPassword); }} />
                                    : <FaEye onClick={() => { setShowPassword(!showPassword); }} />}
                            </div>

                            {errorMsg && (
                                <Alert
                                    variant="danger"
                                    onClose={() => setErrorMsg("")}
                                    dismissible>
                                    {errorMsg}
                                </Alert>
                            )}

                            <div className={"login-center-options"}>
                                <div className="remember-div">
                                    <input type="checkbox" id="remember-checkbox" />
                                    <label htmlFor="remember-checkbox">
                                        Lembrar de mim
                                    </label>
                                </div>

                                <div className="forgot-pass-link">
                                    <Link to={"/passwordreset"}>Esqueceu a senha?</Link>
                                </div>
                            </div>
                            <div className="login-center-button">
                                <button type="button" disabled={loading} onClick={handleLogin}>
                                    {loading ? <span>Carregando</span> : <span>Entrar</span>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}