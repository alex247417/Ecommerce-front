import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Register() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErro('');

        try {
            const response = await api.post('/auth/register', { nome, email, senha });
            const { token, ...userData } = response.data;
            login(userData, token);
            navigate('/');
        } catch {
            setErro('Erro ao cadastrar. Email já existe?');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Criar conta</h2>

                {erro && <p style={styles.erro}>{erro}</p>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label>Nome</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label>Senha</label>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Criar conta'}
                    </button>
                </form>

                <p style={styles.link}>
                    Já tem conta? <Link to="/login">Entrar</Link>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    title: {
        marginBottom: '1.5rem',
        textAlign: 'center',
    },
    field: {
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    input: {
        padding: '0.6rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '1rem',
    },
    button: {
        width: '100%',
        padding: '0.75rem',
        backgroundColor: '#1a1a2e',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '0.5rem',
    },
    erro: {
        color: 'red',
        marginBottom: '1rem',
        textAlign: 'center',
    },
    link: {
        textAlign: 'center',
        marginTop: '1rem',
    },
};