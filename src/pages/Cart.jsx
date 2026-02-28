import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Cart() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(saved);
    }, []);

    function updateQty(productId, qty) {
        const updated = cart.map(i => i.productId === productId ? { ...i, quantidade: qty } : i).filter(i => i.quantidade > 0);
        setCart(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    }

    function remove(productId) {
        const updated = cart.filter(i => i.productId !== productId);
        setCart(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    }

    const total = cart.reduce((sum, i) => sum + i.preco * i.quantidade, 0);

    async function checkout() {
        if (!user) return navigate('/login');
        setLoading(true);
        try {
            // 1. Cria o pedido
            const orderRes = await api.post('/orders', {
                items: cart.map(i => ({ productId: i.productId, quantidade: i.quantidade }))
            });

            const orderId = orderRes.data.id;

            // 2. Cria a sessão de pagamento e redireciona
            const paymentRes = await api.post(`/payment/checkout/${orderId}`);
            window.location.href = paymentRes.data.url;

        } catch {
            alert('Erro ao processar pagamento. Tente novamente.');
            setLoading(false);
        }
    }

    return (
        <div style={s.root}>
            <style>{css}</style>

            <nav style={s.nav}>
                <div style={s.navInner}>
                    <Link to="/" style={s.logo}><span style={s.logoDot}>◆</span> NEXSHOP</Link>
                    <Link to="/" style={s.navLink}>← Continuar comprando</Link>
                </div>
            </nav>

            <div style={s.container}>
                <h1 style={s.title}>Carrinho</h1>

                {success ? (
                    <div style={s.successBox} className="fade-in">
                        <div style={s.successIcon}>✓</div>
                        <h2 style={s.successTitle}>Pedido realizado!</h2>
                        <p style={s.successText}>Seu pedido foi confirmado com sucesso.</p>
                        <Link to="/" style={s.successBtn}>Voltar para a loja</Link>
                    </div>
                ) : cart.length === 0 ? (
                    <div style={s.emptyBox}>
                        <p style={s.emptyIcon}>🛒</p>
                        <p style={s.emptyText}>Seu carrinho está vazio.</p>
                        <Link to="/" style={s.emptyBtn}>Ver produtos</Link>
                    </div>
                ) : (
                    <div style={s.grid}>
                        {/* ITENS */}
                        <div style={s.items}>
                            {cart.map(item => (
                                <div key={item.productId} style={s.item} className="fade-in">
                                    <img
                                        src={item.imagemUrl || 'https://placehold.co/100x100/1a1a2e/ffffff?text=P'}
                                        alt={item.nome}
                                        style={s.itemImg}
                                        onError={e => e.target.src = 'https://placehold.co/100x100/1a1a2e/ffffff?text=P'}
                                    />
                                    <div style={s.itemInfo}>
                                        <h3 style={s.itemName}>{item.nome}</h3>
                                        <p style={s.itemPrice}>R$ {item.preco.toFixed(2)} cada</p>
                                    </div>
                                    <div style={s.itemControls}>
                                        <div style={s.qtyControls}>
                                            <button style={s.qtyBtn} onClick={() => updateQty(item.productId, item.quantidade - 1)}>−</button>
                                            <span style={s.qtyNum}>{item.quantidade}</span>
                                            <button style={s.qtyBtn} onClick={() => updateQty(item.productId, item.quantidade + 1)}>+</button>
                                        </div>
                                        <p style={s.itemTotal}>R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                                        <button style={s.removeBtn} onClick={() => remove(item.productId)}>✕</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RESUMO */}
                        <div style={s.summary}>
                            <h2 style={s.summaryTitle}>Resumo</h2>
                            <div style={s.summaryRow}>
                                <span>Subtotal</span>
                                <span>R$ {total.toFixed(2)}</span>
                            </div>
                            <div style={s.summaryRow}>
                                <span>Frete</span>
                                <span style={{ color: '#22c55e' }}>Grátis</span>
                            </div>
                            <div style={s.summaryDivider} />
                            <div style={s.summaryTotal}>
                                <span>Total</span>
                                <span>R$ {total.toFixed(2)}</span>
                            </div>
                            {!user && (
                                <p style={s.loginWarn}>
                                    <Link to="/login" style={{ color: '#e8633a' }}>Faça login</Link> para finalizar
                                </p>
                            )}
                            <button
                                style={loading ? s.checkoutBtnLoading : s.checkoutBtn}
                                onClick={checkout}
                                disabled={loading}
                            >
                                {loading ? 'Processando...' : 'Finalizar pedido'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <footer style={s.footer}>
                <p style={s.footerText}>© 2026 NEXSHOP · Todos os direitos reservados</p>
            </footer>
        </div>
    );
}

const css = `
  @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .fade-in { animation: fadeIn 0.4s ease forwards; }
`;

const s = {
    root: { fontFamily: "'Inter', sans-serif", backgroundColor: '#f8f7f4', minHeight: '100vh' },
    nav: { position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(248,247,244,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e8e5df' },
    navInner: { maxWidth: '1280px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logo: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.3rem', color: '#111', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' },
    logoDot: { color: '#e8633a' },
    navLink: { color: '#555', textDecoration: 'none', fontSize: '0.95rem' },
    container: { maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem' },
    title: { fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 700, marginBottom: '2.5rem' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' },
    items: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    item: { backgroundColor: '#fff', borderRadius: '16px', padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1.2rem', border: '1px solid #eee' },
    itemImg: { width: '90px', height: '90px', objectFit: 'cover', borderRadius: '10px' },
    itemInfo: { flex: 1 },
    itemName: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem' },
    itemPrice: { color: '#888', fontSize: '0.85rem' },
    itemControls: { display: 'flex', alignItems: 'center', gap: '1rem' },
    qtyControls: { display: 'flex', alignItems: 'center', gap: '0.8rem', backgroundColor: '#f8f7f4', borderRadius: '8px', padding: '0.3rem 0.8rem' },
    qtyBtn: { background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 700, color: '#333' },
    qtyNum: { fontWeight: 700, minWidth: '20px', textAlign: 'center' },
    itemTotal: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.1rem', minWidth: '90px', textAlign: 'right' },
    removeBtn: { background: 'none', border: 'none', color: '#ccc', fontSize: '1rem', cursor: 'pointer', padding: '0.3rem' },
    summary: { backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #eee', position: 'sticky', top: '80px' },
    summaryTitle: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.3rem', marginBottom: '1.5rem' },
    summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#555', marginBottom: '0.8rem' },
    summaryDivider: { height: '1px', backgroundColor: '#eee', margin: '1rem 0' },
    summaryTotal: { display: 'flex', justifyContent: 'space-between', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.3rem', marginBottom: '1.5rem' },
    loginWarn: { fontSize: '0.85rem', color: '#888', textAlign: 'center', marginBottom: '1rem' },
    checkoutBtn: { width: '100%', padding: '1rem', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' },
    checkoutBtnLoading: { width: '100%', padding: '1rem', backgroundColor: '#555', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'not-allowed' },
    successBox: { textAlign: 'center', padding: '4rem 2rem' },
    successIcon: { width: '80px', height: '80px', backgroundColor: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#fff', margin: '0 auto 1.5rem' },
    successTitle: { fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' },
    successText: { color: '#666', marginBottom: '2rem' },
    successBtn: { display: 'inline-block', backgroundColor: '#111', color: '#fff', padding: '0.8rem 2rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 600 },
    emptyBox: { textAlign: 'center', padding: '4rem 2rem' },
    emptyIcon: { fontSize: '4rem', marginBottom: '1rem' },
    emptyText: { color: '#888', fontSize: '1.1rem', marginBottom: '2rem' },
    emptyBtn: { display: 'inline-block', backgroundColor: '#111', color: '#fff', padding: '0.8rem 2rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 600 },
    footer: { borderTop: '1px solid #e8e5df', padding: '2rem', textAlign: 'center', marginTop: '4rem' },
    footerText: { color: '#aaa', fontSize: '0.85rem' },
};