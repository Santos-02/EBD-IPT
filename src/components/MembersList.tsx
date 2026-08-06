import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Member {
    id: string | number;
    name: string;
    society: string;
}

export default function MembersList() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMembers() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('members')
                    .select('*');
                
                if (error) {
                    setErrorMsg(error.message);
                } else if (data) {
                    setMembers(data as Member[]);
                }
            } catch (err) {
                setErrorMsg('Ocorreu um erro inesperado ao carregar os dados.');
            } finally {
                setLoading(false);
            }
        }

        fetchMembers();
    }, []);

    if (loading) return <p>Carregando membros...</p>;
    if (errorMsg) return <p style={{ color: 'red' }}>Erro: {errorMsg}</p>;

    return (
        <div>
            <ul>
                {members.map((member) => (
                    <li key={member.id}>
                        {member.name} - {member.society}
                    </li>
                ))}
            </ul>
        </div>
    );
}