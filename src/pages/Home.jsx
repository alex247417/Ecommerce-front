import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/products')
            .then(res => setProducts(res.data))
            .finally(() => setLoading(false));
    }, []);

    function handleLogout() {
        logout();
        navigate('/login');
    }

    const filtered = products.filter(p =>
        p.nome.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={s.root}>
            <style>{css}</style>

            {/* NAVBAR */}
            <nav style={s.nav}>
                <div style={s.navInner}>
          <span style={s.logo}>
            <span style={s.logoDot}>◆</span> NEXSHOP
          </span>
                    <div style={s.navLinks}>
                        {user ? (
                            <>
                                <span style={s.greeting}>Olá, {user.nome}</span>
                                <Link to="/cart" style={s.navLink}>Carrinho</Link>
                                {user.role === 'admin' && (
                                    <Link to="/admin" style={s.adminBadge}>Admin</Link>
                                )}
                                <button onClick={handleLogout} style={s.logoutBtn}>Sair</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={s.navLink}>Entrar</Link>
                                <Link to="/register" style={s.ctaBtn}>Cadastrar</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section style={s.hero}>
                <div style={s.heroContent}>
                    <p style={s.heroLabel}>COLEÇÃO 2026</p>
                    <h1 style={s.heroTitle}>
                        Produtos que<br />
                        <span style={s.heroAccent}>definem estilo.</span>
                    </h1>
                    <p style={s.heroSub}>
                        Qualidade premium, entrega rápida e os melhores preços.
                    </p>
                    <a href="#produtos" style={s.heroBtn}>Ver produtos ↓</a>
                </div>
                <div style={s.heroBg}>
                    <div style={s.heroOrb1} className="orb" />
                    <div style={s.heroOrb2} className="orb2" />
                </div>
            </section>

            {/* PRODUTOS */}
            <section id="produtos" style={s.section}>
                <div style={s.sectionHeader}>
                    <h2 style={s.sectionTitle}>Catálogo</h2>
                    <input
                        style={s.searchInput}
                        placeholder="Buscar produto..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div style={s.loadingWrap}>
                        <div className="spinner" style={s.spinner} />
                    </div>
                ) : filtered.length === 0 ? (
                    <p style={s.empty}>Nenhum produto encontrado.</p>
                ) : (
                    <div style={s.grid}>
                        {filtered.map((product, i) => (
                            <div
                                key={product.id}
                                style={{ ...s.card, animationDelay: `${i * 0.08}s` }}
                                className="card-anim"
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                <div style={s.imgWrap}>
                                    <img
                                        src={product.imagemUrl || 'https://placehold.co/400x300/1a1a2e/ffffff?text=Produto'}
                                        alt={product.nome}
                                        style={s.img}
                                        onError={e => e.target.src = 'https://placehold.co/400x300/1a1a2e/ffffff?text=Produto'}
                                    />
                                    {product.estoque === 0 && (
                                        <span style={s.esgotadoBadge}>Esgotado</span>
                                    )}
                                    {product.estoque > 0 && product.estoque <= 5 && (
                                        <span style={s.urgentBadge}>Últimas unidades!</span>
                                    )}
                                </div>
                                <div style={s.cardBody}>
                                    <p style={s.cardCategory}>PRODUTO</p>
                                    <h3 style={s.cardName}>{product.nome}</h3>
                                    <p style={s.cardDesc}>{product.descricao}</p>
                                    <div style={s.cardFooter}>
                    <span style={s.cardPrice}>
                      R$ {product.preco.toFixed(2)}
                    </span>
                                        <button
                                            style={product.estoque > 0 ? s.addBtn : s.addBtnDisabled}
                                            disabled={product.estoque === 0}
                                            onClick={e => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                                        >
                                            {product.estoque > 0 ? 'Ver mais →' : 'Indisponível'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* FOOTER */}
            <footer style={s.footer}>
                <span style={s.footerLogo}>◆ NEXSHOP</span>
                <p style={s.footerText}>© 2026 · Todos os direitos reservados</p>
            </footer>
        </div>
    );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .orb { animation: pulse 6s ease-in-out infinite; }
  .orb2 { animation: pulse 8s ease-in-out infinite reverse; }

  @keyframes pulse {
    0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.6; }
    50% { transform: scale(1.15) translate(20px, -20px); opacity: 0.9; }
  }

  .card-anim {
    opacity: 0;
    transform: translateY(24px);
    animation: fadeUp 0.5s ease forwards;
  }

  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }

  .card-anim:hover {
    transform: translateY(-6px) !important;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15) !important;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .spinner { animation: spin 0.8s linear infinite; }
`;

const s = {
    root: {
        fontFamily: "'Inter', sans-serif",
        backgroundColor: '#f8f7f4',
        minHeight: '100vh',
        color: '#111',
    },
    nav: {
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(248,247,244,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e8e5df',
    },
    navInner: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 700,
        fontSize: '1.4rem',
        letterSpacing: '0.05em',
        color: '#111',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
    },
    logoDot: { color: '#e8633a' },
    navLinks: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
    greeting: { fontSize: '0.9rem', color: '#666' },
    navLink: { color: '#111', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 },
    adminBadge: {
        backgroundColor: '#e8633a',
        color: '#fff',
        padding: '0.2rem 0.7rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        textDecoration: 'none',
    },
    ctaBtn: {
        backgroundColor: '#111',
        color: '#fff',
        padding: '0.5rem 1.2rem',
        borderRadius: '6px',
        fontSize: '0.9rem',
        fontWeight: 500,
        textDecoration: 'none',
        transition: 'background 0.2s',
    },
    logoutBtn: {
        background: 'none',
        border: '1px solid #ccc',
        padding: '0.4rem 1rem',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        color: '#555',
    },
    hero: {
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#111',
        padding: '7rem 2rem',
        textAlign: 'center',
    },
    heroContent: { position: 'relative', zIndex: 2 },
    heroLabel: {
        color: '#e8633a',
        fontSize: '0.8rem',
        fontWeight: 700,
        letterSpacing: '0.2em',
        marginBottom: '1rem',
    },
    heroTitle: {
        fontFamily: "'Outfit', sans-serif",
        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
        fontWeight: 700,
        color: '#fff',
        lineHeight: 1.1,
        marginBottom: '1.5rem',
    },
    heroAccent: { color: '#e8633a' },
    heroSub: { color: '#aaa', fontSize: '1.1rem', marginBottom: '2.5rem' },
    heroBtn: {
        display: 'inline-block',
        backgroundColor: '#e8633a',
        color: '#fff',
        padding: '0.9rem 2.5rem',
        borderRadius: '50px',
        textDecoration: 'none',
        fontWeight: 500,
        letterSpacing: '0.02em',
        fontSize: '1rem',
        transition: 'transform 0.2s',
    },
    heroBg: {
        position: 'absolute', inset: 0, zIndex: 1,
        pointerEvents: 'none',
    },
    heroOrb1: {
        position: 'absolute', top: '-80px', left: '-80px',
        width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,99,58,0.3), transparent 70%)',
    },
    heroOrb2: {
        position: 'absolute', bottom: '-100px', right: '-60px',
        width: '500px', height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(100,80,255,0.2), transparent 70%)',
    },
    section: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '4rem 2rem',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    sectionTitle: {
        fontFamily: "'Outfit', sans-serif",
        fontSize: '2rem',
        fontWeight: 700,
    },
    searchInput: {
        padding: '0.6rem 1.2rem',
        borderRadius: '50px',
        border: '1.5px solid #ddd',
        fontSize: '0.95rem',
        outline: 'none',
        width: '260px',
        backgroundColor: '#fff',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid #eee',
        transition: 'transform 0.3s, box-shadow 0.3s',
    },
    imgWrap: { position: 'relative', overflow: 'hidden' },
    img: { width: '100%', height: '220px', objectFit: 'cover', display: 'block' },
    esgotadoBadge: {
        position: 'absolute', top: '12px', left: '12px',
        backgroundColor: '#555',
        color: '#fff',
        fontSize: '0.75rem',
        fontWeight: 700,
        padding: '0.3rem 0.8rem',
        borderRadius: '20px',
        letterSpacing: '0.05em',
    },
    urgentBadge: {
        position: 'absolute', top: '12px', left: '12px',
        backgroundColor: '#e8633a',
        color: '#fff',
        fontSize: '0.75rem',
        fontWeight: 700,
        padding: '0.3rem 0.8rem',
        borderRadius: '20px',
    },
    cardBody: { padding: '1.2rem' },
    cardCategory: {
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.15em',
        color: '#e8633a',
        marginBottom: '0.3rem',
    },
    cardName: {
        fontFamily: "'Outfit', sans-serif",
        fontSize: '1.15rem',
        fontWeight: 700,
        marginBottom: '0.4rem',
    },
    cardDesc: { fontSize: '0.85rem', color: '#888', marginBottom: '1rem' },
    cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    cardPrice: { fontSize: '1.3rem', fontWeight: 700, color: '#111' },
    addBtn: {
        backgroundColor: '#111',
        color: '#fff',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        fontSize: '0.85rem',
        fontWeight: 600,
        cursor: 'pointer',
    },
    addBtnDisabled: {
        backgroundColor: '#eee',
        color: '#999',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '8px',
        fontSize: '0.85rem',
        cursor: 'not-allowed',
    },
    loadingWrap: { display: 'flex', justifyContent: 'center', padding: '4rem' },
    spinner: {
        width: '40px', height: '40px',
        border: '3px solid #eee',
        borderTop: '3px solid #e8633a',
        borderRadius: '50%',
    },
    empty: { textAlign: 'center', color: '#888', padding: '4rem' },
    footer: {
        borderTop: '1px solid #e8e5df',
        padding: '2rem',
        textAlign: 'center',
    },
    footerLogo: {
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 700,
        fontSize: '1rem',
        color: '#e8633a',
        display: 'block',
        marginBottom: '0.5rem',
    },
    footerText: { color: '#aaa', fontSize: '0.85rem' },
};