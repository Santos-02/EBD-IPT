import Navigate from './Navigate'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {

    const navigate = useNavigate()

    const ucp = () => {navigate('/ucp')}
    const upa = () => {navigate('/upa')}
    const ump = () => {navigate('/ump')}
    const saf = () => {navigate('/saf')}
    const uph = () => {navigate('/uph')}

    const member = () => {navigate('/membros')}
    const history = () => {navigate('/historico')}

    return (
        <>
        <div>
            <Navigate />
            </div>
        <div className="dashboard">
            <h1>Dashboard</h1>
            
            <button className="society-list" onClick={ucp}>UCP</button>
            <button className="society-list" onClick={upa}>UPA</button>
            <button className="society-list" onClick={ump}>UMP</button>
            <button className="society-list" onClick={saf}>SAF</button>
            <button className="society-list" onClick={uph}>UPH</button>

            <button className="member" onClick={member}>Membros</button>
            <button className="history" onClick={history}>Histórico</button>
        </div>
        </>
    )
}