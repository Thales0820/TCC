"use clinet"

export default function Login() {
    return(
        <>
            <div>
                <img src="/images/logoDark.png" alt="Logo" />
            </div>
            <div>
                <div>
                    <img src="/images/Login.png" alt="Sobre" />
                </div>
                <div>
                    <form action="">
                        <label>E_mail</label>
                        <input type="email" placeholder="Email"/>
                        <label>Senha</label>
                        <input type="password" placeholder="Senha"/>
                    </form>
                </div>
            </div>
        </>
    )
}