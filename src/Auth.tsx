import { supabase } from './supabaseClient';
import { useState } from "react";
import Image from "../assets/image.jpg";
import Logo from "../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

export default function Auth() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event: { preventDefault: () => void }) => {
        event.preventDefault()

        setLoading(true)
        const { error } = await supabase.auth.signInWithOtp({ email })

        if (error) {
            alert(error.message)
        } else {
            alert('Check your email for the login link!')
        }
        setLoading(false)
    }

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
                                    className="pass-input-div"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Senha"
                                    value={password}
                                    required={true}
                                    onChange={(e) => setPassword(e.target.value)} />
                                {showPassword ? <FaEyeSlash onClick={() => { setShowPassword(!showPassword); }} />
                                    : <FaEye onClick={() => { setShowPassword(!showPassword); }} />}
                            </div>

                            <div className={"login-center-options"}>
                                <div className="remember-div">
                                    <input type="checkbox" id="remember-checkbox" />
                                    <label htmlFor="remember-checkbox">
                                        Lembrar de mim
                                    </label>
                                </div>
                                <a href="#" className="forgot-pass-link">
                                    Esqueceu a senha?
                                </a>
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