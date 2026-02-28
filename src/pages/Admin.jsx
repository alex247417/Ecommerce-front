import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Admin() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ nome: '', descricao: '', preco: '', estoque: '', imagemUrl: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') return navigate('/');
        loadProducts();
    }, []);

    async function loadProducts() {
        const res = await api.get('/products');
        setProducts(res.data);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/products', { ...form, preco: parseFloat(form.preco), estoque: parseInt(form.estoque) });
            setForm({ nome: '', descricao: '', preco: '', estoque: '', imagemUrl: '' });
            setSuccess('Produto cadastrado com sucesso!');
            setTimeout(() => setSuccess(''), 3000);
            loadProducts();
        } catch {
            alert('Erro ao cadastrar produto.');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Deletar este produto?')) return;
        await api.delete(`/products/${id}`);
        loadProducts();
    }

    return (
        <div style={s.root}>
            <style>{css}</style>

            <nav style={s.nav}>
                <div style={s.navInner}>
                    <Link to="/" style={s.logo}><span style={s.logoDot}>◆</span> NEXSHOP</Link>
                    <span style={s.adminBadge}>Painel Admin</span>
                    <Link to="/" style={s.navLink}>← Voltar à loja</Link>
                </div>
            </nav>

            <div style={s.container}>
                <h1 style={s.title}>Painel Admin</h1>

                <div style={s.grid}>
                    {/* FORMULÁRIO */}
                    <div style={s.card}>
                        <h2 style={s.cardTitle}>Novo Produto</h2>

                        {success && <div style={s.successMsg}>{success}</div>}

                        <form onSubmit={handleSubmit}>
                            {[
                                { label: 'Nome', key: 'nome', type: 'text' },
                                { label: 'Descrição', key: 'descricao', type: 'text' },
                                { label: 'Preço (R$)', key: 'preco', type: 'number' },
                                { label: 'Estoque', key: 'estoque', type: 'number' },
                                { label: 'URL da Imagem', key: 'imagemUrl', type: 'text' },
                            ].map(field => (
                                <div key={field.key} style={s.field}>
                                    <label style={s.label}>{field.label}</label>
                                    <input
                                        type={field.type}
                                        value={form[field.key]}
                                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                        style={s.input}
                                        required
                                        step={field.key === 'preco' ? '0.01' : undefined}
                                    />
                                </div>
                            ))}
                            <button type="submit" style={s.submitBtn} disabled={loading}>
                                {loading ? 'Cadastrando...' : '+ Cadastrar produto'}
                            </button>
                        </form>
                    </div>

                    {/* LISTA */}
                    <div>
                        <h2 style={s.cardTitle}>Produtos cadastrados ({products.length})</h2>
                        <div style={s.productList}>
                            {products.map(p => (
                                <div key={p.id} style={s.productItem}>
                                    <img
                                        src={p.imagemUrl || 'https://placehold.co/60x60/1a1a2e/ffffff?text=P'}
                                        alt={p.nome}
                                        style={s.productImg}
                                        onError={e => e.target.src = 'https://placehold.co/60x60/1a1a2e/ffffff?text=P'}
                                    />
                                    <div style={s.productInfo}>
                                        <p style={s.productName}>{p.nome}</p>
                                        <p style={s.productMeta}>R$ {p.preco.toFixed(2)} · {p.estoque} em estoque</p>
                                    </div>
                                    <button style={s.deleteBtn} onClick={() => handleDelete(p.id)}>✕</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const css = `@keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`;

const s = {
    root: { fontFamily: "'DM Sans', sans-serif", backgroundColor: '#f8f7f4', minHeight: '100vh' },
    nav: { position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(248,247,244,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e8e5df' },
    navInner: { maxWidth: '1280px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logo: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#111', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' },
    logoDot: { color: '#e8633a' },
    adminBadge: { backgroundColor: '#e8633a', color: '#fff', padding: '0.3rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 },
    navLink: { color: '#555', textDecoration: 'none', fontSize: '0.95rem' },
    container: { maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem' },
    title: { fontFamily: "'Syne', sans-serif", fontSize: '2.5rem', fontWeight: 800, marginBottom: '2.5rem' },
    grid: { display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem', alignItems: 'start' },
    card: { backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #eee' },
    cardTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.2rem', marginBottom: '1.5rem' },
    successMsg: { backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.8rem 1rem', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1rem' },
    field: { marginBottom: '1rem' },
    label: { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: '0.4rem' },
    input: { width: '100%', padding: '0.6rem 0.9rem', borderRadius: '8px', border: '1.5px solid #e8e5df', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' },
    submitBtn: { width: '100%', padding: '0.9rem', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' },
    productList: { display: 'flex', flexDirection: 'column', gap: '0.8rem' },
    productItem: { backgroundColor: '#fff', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #eee' },
    productImg: { width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' },
    productInfo: { flex: 1 },
    productName: { fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' },
    productMeta: { color: '#888', fontSize: '0.85rem' },
    deleteBtn: { background: 'none', border: '1px solid #eee', color: '#ccc', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' },
};