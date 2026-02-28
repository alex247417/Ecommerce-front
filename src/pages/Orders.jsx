import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const success = searchParams.get('success');

    useEffect(() => {
        api.get('/orders/my')
            .then(res => setOrders(res.data))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div style={s.root}>
            <nav style={s.nav}>
                <div style={s.navInner}>
                    <Link to="/" style={s.logo}><span style={s.dot}>◆</span> NEXSHOP</Link>
                    <Link to="/" style={s.navLink}>← Voltar à loja</Link>
                </div>
            </nav>

            <div style={s.container}>
                {success && (
                    <div style={s.successBanner}>
                        ✓ Pagamento aprovado! Seu pedido foi confirmado.
                    </div>
                )}

                <h1 style={s.title}>Meus Pedidos</h1>

                {loading ? (
                    <p>Carregando...</p>
                ) : orders.length === 0 ? (
                    <div style={s.empty}>
                        <p style={s.emptyText}>Você ainda não fez nenhum pedido.</p>
                        <Link to="/" style={s.emptyBtn}>Ver produtos</Link>
                    </div>
                ) : (
                    <div style={s.list}>
                        {orders.map(order => (
                            <div key={order.id} style={s.card}>
                                <div style={s.cardHeader}>
                                    <div>
                                        <p style={s.orderId}>Pedido #{order.id}</p>
                                        <p style={s.orderDate}>
                                            {new Date(order.criadoEm).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                    <div style={s.right}>
                                        <span style={s.status}>{order.status}</span>
                                        <p style={s.total}>R$ {order.total.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div style={s.items}>
                                    {order.items.map(item => (
                                        <div key={item.id} style={s.item}>
                                            <img
                                                src={item.product?.imagemUrl || 'https://placehold.co/60x60/1a1a2e/ffffff?text=P'}
                                                alt={item.product?.nome}
                                                style={s.itemImg}
                                                onError={e => e.target.src = 'https://placehold.co/60x60/1a1a2e/ffffff?text=P'}
                                            />
                                            <div>
                                                <p style={s.itemName}>{item.product?.nome}</p>
                                                <p style={s.itemMeta}>{item.quantidade}x · R$ {item.preco.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const s = {
    root: { fontFamily: "'DM Sans', sans-serif", backgroundColor: '#f8f7f4', minHeight: '100vh' },
    nav: { position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(248,247,244,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e8e5df' },
    navInner: { maxWidth: '1280px', margin: '0 auto', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logo: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.3rem', color: '#111', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' },
    dot: { color: '#e8633a' },
    navLink: { color: '#555', textDecoration: 'none' },
    container: { maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem' },
    successBanner: { backgroundColor: '#dcfce7', color: '#16a34a', padding: '1rem 1.5rem', borderRadius: '12px', fontWeight: 600, marginBottom: '2rem', fontSize: '1rem' },
    title: { fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 700, marginBottom: '2rem' },
    empty: { textAlign: 'center', padding: '4rem' },
    emptyText: { color: '#888', marginBottom: '1.5rem' },
    emptyBtn: { backgroundColor: '#111', color: '#fff', padding: '0.8rem 2rem', borderRadius: '10px', textDecoration: 'none', fontWeight: 600 },
    list: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    card: { backgroundColor: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #eee' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' },
    orderId: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.1rem' },
    orderDate: { color: '#888', fontSize: '0.85rem', marginTop: '0.2rem' },
    right: { textAlign: 'right' },
    status: { backgroundColor: '#f0fdf4', color: '#16a34a', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 },
    total: { fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.2rem', marginTop: '0.4rem' },
    items: { display: 'flex', flexDirection: 'column', gap: '0.8rem', borderTop: '1px solid #eee', paddingTop: '1rem' },
    item: { display: 'flex', alignItems: 'center', gap: '1rem' },
    itemImg: { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' },
    itemName: { fontWeight: 600, fontSize: '0.95rem' },
    itemMeta: { color: '#888', fontSize: '0.85rem' },
};