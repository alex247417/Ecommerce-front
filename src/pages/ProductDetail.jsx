import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(() => navigate('/'))
            .finally(() => setLoading(false));
    }, [id]);

    function addToCart() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(i => i.productId === product.id);
        if (existing) {
            existing.quantidade += qty;
        } else {
            cart.push({ productId: product.id, nome: product.nome, preco: product.preco, imagemUrl: product.imagemUrl, quantidade: qty });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    }

    if (loading) return (
        <div style={s.center}>
            <div className="spinner" style={s.spinner} />
            <style>{spinCss}</style>
        </div>
    );

    if (!product) return null;

    return (
        <div style={s.root}>
            <style>{css}</style>

            {/* NAVBAR */}
            <nav style={s.nav}>
                <div style={s.navInner}>
                    <Link to="/" style={s.logo}><span style={s.logoDot}>◆</span> NEXSHOP</Link>
                    <div style={s.navLinks}>
                        <Link to="/" style={s.navLink}>← Voltar</Link>
                        <Link to="/cart" style={s.cartLink}>🛒 Carrinho</Link>
                        {!user && <Link to="/login" style={s.ctaBtn}>Entrar</Link>}
                    </div>
                </div>
            </nav>

            {/* CONTEÚDO */}
            <div style={s.container}>
                <div style={s.grid}>

                    {/* IMAGEM */}
                    <div style={s.imgSection}>
                        <div style={s.imgWrap}>
                            <img
                                src={product.imagemUrl || 'https://placehold.co/600x500/1a1a2e/ffffff?text=Produto'}
                                alt={product.nome}
                                style={s.img}
                                onError={e => e.target.src = 'https://placehold.co/600x500/1a1a2e/ffffff?text=Produto'}
                            />
                            {product.estoque === 0 && <div style={s.overlay}><span>Esgotado</span></div>}
                        </div>
                    </div>

                    {/* INFO */}
                    <div style={s.infoSection} className="slide-in">
                        <p style={s.label}>PRODUTO #{product.id}</p>
                        <h1 style={s.title}>{product.nome}</h1>
                        <p style={s.desc}>{product.descricao}</p>

                        <div style={s.divider} />

                        <div style={s.priceRow}>
                            <span style={s.price}>R$ {product.preco.toFixed(2)}</span>
                            <span style={product.estoque > 0 ? s.stockGood : s.stockBad}>
                {product.estoque > 0 ? `✓ ${product.estoque} em estoque` : '✗ Esgotado'}
              </span>
                        </div>

                        {product.estoque > 0 && (
                            <>
                                <div style={s.qtyRow}>
                                    <span style={s.qtyLabel}>Quantidade</span>
                                    <div style={s.qtyControls}>
                                        <button style={s.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                                        <span style={s.qtyNum}>{qty}</span>
                                        <button style={s.qtyBtn} onClick={() => setQty(q => Math.min(product.estoque, q + 1))}>+</button>
                                    </div>
                                </div>

                                <div style={s.totalRow}>
                                    <span style={s.totalLabel}>Total</span>
                                    <span style={s.totalValue}>R$ {(product.preco * qty).toFixed(2)}</span>
                                </div>

                                <button
                                    style={added ? s.addedBtn : s.addBtn}
                                    onClick={addToCart}
                                >
                                    {added ? '✓ Adicionado ao carrinho!' : 'Adicionar ao carrinho'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer style={s.footer}>
                <p style={s.footerText}>© 2026 NEXSHOP · Todos os direitos reservados</p>
            </footer>
        </div>
    );
}

const spinCss = `@keyframes spin { to { transform: rotate(360deg); } } .spinner { animation: spin 0.8s linear infinite; }`;

const css = `
  @keyframes spin { to { transform: rotate(360deg); } }
  .slide-in { animation: slideIn 0.5s ease forwards; }
  @keyframes slideIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
`;

const s = {
    root: { fontFamily: "'DM Sans', sans-serif", backgroundColor: '#f8f7f4', minHeight: '100vh' },
    center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
    spinner: { width: '40px', height: '40px', border: '3px solid #eee', borderTop: '3px solid #e8633a', borderRadius: '50%' },
    nav: { position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(248,247,244,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e8e5df' },
    navInner: { maxWidth: '1280px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logo: { fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#111', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' },
    logoDot: { color: '#e8633a' },
    navLinks: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
    navLink: { color: '#555', textDecoration: 'none', fontSize: '0.95rem' },
    cartLink: { color: '#111', textDecoration: 'none', fontWeight: 500 },
    ctaBtn: { backgroundColor: '#111', color: '#fff', padding: '0.5rem 1.2rem', borderRadius: '6px', fontSize: '0.9rem', textDecoration: 'none' },
    container: { maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' },
    imgSection: {},
    imgWrap: { position: 'relative', borderRadius: '20px', overflow: 'hidden' },
    img: { width: '100%', height: '500px', objectFit: 'cover', display: 'block' },
    overlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: 700 },
    infoSection: { paddingTop: '1rem' },
    label: { fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', color: '#e8633a', marginBottom: '0.8rem' },
    title: { fontFamily: "'Syne', sans-serif", fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem' },
    desc: { color: '#666', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem' },
    divider: { height: '1px', backgroundColor: '#e8e5df', marginBottom: '1.5rem' },
    priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
    price: { fontFamily: "'Syne', sans-serif", fontSize: '2.2rem', fontWeight: 800 },
    stockGood: { fontSize: '0.85rem', color: '#22c55e', fontWeight: 600 },
    stockBad: { fontSize: '0.85rem', color: '#ef4444', fontWeight: 600 },
    qtyRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
    qtyLabel: { fontSize: '0.9rem', fontWeight: 600, color: '#555' },
    qtyControls: { display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '0.4rem 1rem' },
    qtyBtn: { background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#333', fontWeight: 700, lineHeight: 1 },
    qtyNum: { fontSize: '1.1rem', fontWeight: 700, minWidth: '24px', textAlign: 'center' },
    totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '1rem 1.2rem', marginBottom: '1.5rem' },
    totalLabel: { color: '#888', fontSize: '0.9rem' },
    totalValue: { fontFamily: "'Syne', sans-serif", fontSize: '1.5rem', fontWeight: 800 },
    addBtn: { width: '100%', padding: '1rem', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' },
    addedBtn: { width: '100%', padding: '1rem', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' },
    footer: { borderTop: '1px solid #e8e5df', padding: '2rem', textAlign: 'center', marginTop: '4rem' },
    footerText: { color: '#aaa', fontSize: '0.85rem' },
};