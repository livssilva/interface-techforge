import React, { useState } from 'react';
import { useAuth } from '../../Middleware/AuthMiddleware';
import { useNavigate } from 'react-router-dom';

export const PLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');
        setCarregando(true);

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensagem || 'Falha na autenticação.');
            }

            login(data.token, data.usuario);
            navigate('/produtos');
        } catch (err: any) {
            setErro(err.message);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div style={styles.containerGeral}>
            <div className="form-card" style={styles.cardGlass}>
                <h2 style={styles.titulo}>TechForge Login</h2>
                
                {erro && <div style={styles.alertaErro}>{erro}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.campoGroup}>
                        <label style={styles.label}>E-mail</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            placeholder="seuemail@techforge.com"
                        />
                    </div>

                    <div style={styles.campoGroup}>
                        <label style={styles.label}>Senha</label>
                        <input
                            type="password"
                            required
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            style={styles.input}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={carregando} style={styles.botaoSubmit}>
                        {carregando ? 'Entrando...' : 'Acessar Plataforma'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    containerGeral: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
    },
    cardGlass: {
        width: '100%',
        maxWidth: '400px',
        padding: '2.5rem',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    },
    titulo: {
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: '1.5rem',
        fontSize: '1.8rem',
        fontWeight: '600',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
    },
    campoGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
    },
    label: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: '0.9rem',
    },
    input: {
        padding: '0.8rem',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        background: 'rgba(255, 255, 255, 0.05)',
        color: '#ffffff',
        fontSize: '1rem',
        outline: 'none',
    },
    botaoSubmit: {
        marginTop: '0.8rem',
        padding: '0.9rem',
        borderRadius: '8px',
        border: 'none',
        background: '#4f46e5',
        color: '#ffffff',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background 0.2s ease',
    },
    alertaErro: {
        background: 'rgba(239, 68, 68, 0.2)',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        color: '#fca5a5',
        padding: '0.75rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        textAlign: 'center',
        fontSize: '0.875rem',
    },
};