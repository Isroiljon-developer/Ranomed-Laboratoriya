import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const COLORS = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  primaryGlow: 'rgba(99,102,241,0.3)',
  accent: '#06b6d4',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#f43f5e',
  bg: '#f1f5f9',
  sidebar: '#0f172a',
  card: '#ffffff',
  border: '#e2e8f0',
  text: '#0f172a',
  muted: '#64748b',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [resultsText, setResultsText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState('kutilmoqda');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [time, setTime] = useState(new Date());

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const data = await api.get('/lab/orders');
      setTests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch lab orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTests(); }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'http://localhost:5173/login';
  };

  const handleOpenModal = (test) => {
    setSelectedTest(test);
    setResultsText(typeof test.results === 'string' ? test.results : JSON.stringify(test.results || ''));
  };

  const handleSaveResults = async () => {
    if (!selectedTest) return;
    setIsSubmitting(true);
    try {
      await api.put(`/lab/orders/${selectedTest.id}`, {
        results: resultsText,
        status: 'tayyor'
      });
      setSelectedTest(null);
      fetchTests();
    } catch (err) {
      alert('Natijani saqlashda xatolik: ' + (err.message || 'Xato'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTests = tests.filter(t => {
    if (filter === 'kutilmoqda') return t.status === 'kutilmoqda' || t.status === 'ordered' || t.status === 'jarayonda';
    if (filter === 'tayyor') return t.status === 'tayyor';
    return true;
  });

  const pending = tests.filter(t => t.status === 'kutilmoqda' || t.status === 'ordered' || t.status === 'jarayonda').length;
  const ready = tests.filter(t => t.status === 'tayyor').length;
  const total = tests.length;

  const s = {
    layout: {
      display: 'flex', minHeight: '100vh',
      background: COLORS.bg, fontFamily: "'Inter', sans-serif",
      WebkitFontSmoothing: 'antialiased'
    },
    sidebar: {
      width: '252px', background: COLORS.sidebar,
      height: '100vh', position: 'fixed', left: 0, top: 0,
      display: 'flex', flexDirection: 'column',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      zIndex: 100, overflow: 'hidden'
    },
    sidebarGlow: {
      position: 'absolute', top: '-80px', right: '-80px',
      width: '220px', height: '220px', borderRadius: '50%',
      background: COLORS.primaryGlow, filter: 'blur(70px)',
      pointerEvents: 'none'
    },
    sidebarHeader: {
      padding: '26px 20px 18px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      flexShrink: 0
    },
    logoRow: { display: 'flex', alignItems: 'center', gap: '13px' },
    logoIcon: {
      width: '42px', height: '42px',
      background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
      borderRadius: '13px', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontSize: '20px', boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
      flexShrink: 0
    },
    logoTitle: {
      fontWeight: 800, fontSize: '15px',
      color: '#f8fafc', letterSpacing: '-0.3px'
    },
    logoSub: {
      fontSize: '10px', color: COLORS.accent,
      textTransform: 'uppercase', letterSpacing: '1.5px',
      fontWeight: 700, marginTop: '1px'
    },
    nav: { flex: 1, padding: '14px 10px', overflow: 'auto' },
    navSection: {
      fontSize: '9px', textTransform: 'uppercase',
      letterSpacing: '2px', color: 'rgba(255,255,255,0.22)',
      fontWeight: 700, padding: '12px 12px 5px'
    },
    navItem: (active) => ({
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '11px 13px', borderRadius: '11px',
      marginBottom: '3px',
      background: active ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
      color: active ? 'white' : 'rgba(255,255,255,0.5)',
      cursor: 'pointer', textDecoration: 'none',
      fontWeight: 500, fontSize: '13.5px',
      boxShadow: active ? '0 8px 20px rgba(99,102,241,0.35)' : 'none',
      transition: 'all 0.2s',
      border: 'none', width: '100%', textAlign: 'left'
    }),
    sidebarFooter: {
      padding: '14px 10px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      flexShrink: 0
    },
    userBox: {
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '10px 12px', borderRadius: '11px',
      background: 'rgba(255,255,255,0.05)', cursor: 'pointer'
    },
    userAvatar: {
      width: '34px', height: '34px', borderRadius: '10px',
      background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: '14px', color: 'white', flexShrink: 0
    },
    userName: { fontSize: '13px', fontWeight: 600, color: '#f1f5f9' },
    userRole: { fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 500 },
    logoutBtn: {
      width: '28px', height: '28px', borderRadius: '8px',
      background: 'rgba(244,63,94,0.15)', border: 'none',
      cursor: 'pointer', fontSize: '13px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#f43f5e', flexShrink: 0, transition: '0.2s'
    },
    main: { marginLeft: '252px', flex: 1, display: 'flex', flexDirection: 'column' },
    topbar: {
      background: 'white', borderBottom: `1px solid ${COLORS.border}`,
      padding: '0 30px', height: '62px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 50,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    },
    pageTitle: {
      fontSize: '19px', fontWeight: 800,
      letterSpacing: '-0.4px', color: COLORS.text
    },
    timePill: {
      fontSize: '11.5px', color: COLORS.muted, fontWeight: 500,
      background: COLORS.bg, padding: '6px 14px',
      borderRadius: '20px', border: `1px solid ${COLORS.border}`
    },
    content: { padding: '26px 30px', flex: 1 },
    statsRow: {
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '18px', marginBottom: '24px'
    },
    statCard: (color, glowColor) => ({
      background: 'white', borderRadius: '16px',
      border: `1px solid ${COLORS.border}`,
      padding: '20px', display: 'flex',
      alignItems: 'center', gap: '15px',
      transition: 'all 0.25s', cursor: 'default',
      position: 'relative', overflow: 'hidden'
    }),
    statIconBox: (bg) => ({
      width: '48px', height: '48px', borderRadius: '14px',
      background: bg, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: '22px', flexShrink: 0
    }),
    statLabel: { fontSize: '11px', color: COLORS.muted, fontWeight: 500, marginBottom: '3px' },
    statValue: (color) => ({
      fontSize: '28px', fontWeight: 900,
      letterSpacing: '-1px', color
    }),
    filterBar: {
      background: 'white', borderRadius: '14px',
      border: `1px solid ${COLORS.border}`,
      padding: '14px 18px', marginBottom: '18px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    },
    filterBtns: { display: 'flex', gap: '8px' },
    filterBtn: (active, color) => ({
      padding: '8px 16px', borderRadius: '10px',
      border: 'none', cursor: 'pointer', fontWeight: 600,
      fontSize: '12.5px', transition: 'all 0.2s',
      fontFamily: 'inherit',
      background: active ? color : '#f1f5f9',
      color: active ? 'white' : COLORS.muted,
      boxShadow: active ? `0 4px 12px ${color}40` : 'none'
    }),
    refreshBtn: {
      padding: '8px 16px', borderRadius: '10px',
      border: `1px solid ${COLORS.border}`, cursor: 'pointer',
      fontSize: '12.5px', fontWeight: 600, background: 'white',
      color: COLORS.text, transition: 'all 0.2s', fontFamily: 'inherit'
    },
    tableCard: {
      background: 'white', borderRadius: '16px',
      border: `1px solid ${COLORS.border}`, overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
    },
    tableHead: {
      background: '#f8fafc', borderBottom: `1px solid ${COLORS.border}`
    },
    th: {
      padding: '12px 18px', fontSize: '11px',
      textTransform: 'uppercase', fontWeight: 700,
      color: COLORS.muted, letterSpacing: '0.6px', textAlign: 'left'
    },
    td: {
      padding: '13px 18px', fontSize: '13.5px',
      borderBottom: `1px solid #f8fafc`, color: COLORS.text, fontWeight: 500
    },
    actionBtn: (isReady) => ({
      padding: '7px 14px', borderRadius: '9px',
      border: 'none', cursor: 'pointer',
      fontSize: '12px', fontWeight: 700,
      background: isReady ? '#ede9fe' : 'linear-gradient(135deg, #06b6d4, #0891b2)',
      color: isReady ? '#5b21b6' : 'white',
      boxShadow: isReady ? 'none' : '0 4px 12px rgba(6,182,212,0.3)',
      transition: 'all 0.2s', fontFamily: 'inherit'
    }),
    emptyBox: {
      padding: '60px 20px', textAlign: 'center', color: COLORS.muted
    },
    emptyIcon: { fontSize: '48px', marginBottom: '12px' },
    emptyText: { fontSize: '14px', fontWeight: 500, maxWidth: '340px', margin: '0 auto', lineHeight: 1.6 },
    modalOverlay: {
      position: 'fixed', inset: 0,
      background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 3000, padding: '16px', animation: 'fadeIn 0.2s ease'
    },
    modalBox: {
      background: 'white', borderRadius: '20px',
      maxWidth: '520px', width: '100%',
      boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
      overflow: 'hidden', animation: 'slideUp 0.25s ease'
    },
    modalHeader: {
      padding: '18px 22px', borderBottom: `1px solid ${COLORS.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: '#fafbfc'
    },
    modalTitle: { fontSize: '16px', fontWeight: 800, color: COLORS.text },
    closeBtn: {
      width: '32px', height: '32px', borderRadius: '9px',
      border: 'none', background: '#f1f5f9', cursor: 'pointer',
      fontSize: '16px', color: COLORS.muted, display: 'flex',
      alignItems: 'center', justifyContent: 'center', transition: '0.2s'
    },
    modalBody: { padding: '22px' },
    infoRow: {
      display: 'flex', gap: '10px', marginBottom: '16px',
      background: '#f8fafc', borderRadius: '12px', padding: '12px 14px'
    },
    infoChip: (color) => ({
      padding: '4px 12px', borderRadius: '20px', fontSize: '11px',
      fontWeight: 700, background: `${color}20`, color
    }),
    textareaLabel: {
      display: 'block', fontSize: '11px', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.5px',
      color: COLORS.muted, marginBottom: '8px'
    },
    textarea: {
      width: '100%', padding: '12px 14px',
      border: `1.5px solid ${COLORS.border}`, borderRadius: '12px',
      fontFamily: 'inherit', fontSize: '13.5px', color: COLORS.text,
      resize: 'vertical', outline: 'none',
      background: '#f8fafc', lineHeight: 1.6, minHeight: '130px'
    },
    modalFooter: {
      padding: '14px 22px', borderTop: `1px solid ${COLORS.border}`,
      display: 'flex', justifyContent: 'flex-end', gap: '10px',
      background: '#fafbfc'
    },
    cancelBtn: {
      padding: '10px 20px', borderRadius: '11px',
      border: `1.5px solid ${COLORS.border}`, cursor: 'pointer',
      fontSize: '13px', fontWeight: 600, background: 'white',
      color: COLORS.text, fontFamily: 'inherit', transition: '0.2s'
    },
    saveBtn: {
      padding: '10px 22px', borderRadius: '11px',
      border: 'none', cursor: 'pointer',
      fontSize: '13px', fontWeight: 700,
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white', fontFamily: 'inherit',
      boxShadow: '0 6px 16px rgba(16,185,129,0.35)',
      transition: 'all 0.2s'
    }
  };

  const statusBadge = (status) => {
    const isReady = status === 'tayyor';
    return (
      <span style={{
        padding: '4px 11px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
        background: isReady ? '#d1fae5' : '#fef3c7',
        color: isReady ? '#065f46' : '#92400e',
        display: 'inline-flex', alignItems: 'center', gap: '4px'
      }}>
        {isReady ? '✅' : '⏳'} {isReady ? 'Tayyor' : 'Kutilmoqda'}
      </span>
    );
  };

  return (
    <div style={s.layout}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(16px) scale(0.97) } to { opacity:1; transform:translateY(0) scale(1) } }
        .nav-item-btn:hover { background: rgba(255,255,255,0.07) !important; color: #f8fafc !important; }
        .stat-card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.08); border-color: transparent; }
        .action-btn:hover { transform: translateY(-1px) !important; filter: brightness(1.08); }
        .refresh-btn:hover { background: #f8fafc !important; }
        .cancel-btn:hover { background: #f1f5f9 !important; }
        .save-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(16,185,129,0.4) !important; }
        .close-btn:hover { background: #fee2e2 !important; color: #f43f5e !important; }
        .logout-btn:hover { background: rgba(244,63,94,0.28) !important; }
      `}</style>

      {/* ===== SIDEBAR ===== */}
      <aside style={s.sidebar}>
        <div style={s.sidebarGlow}></div>

        {/* Logo */}
        <div style={s.sidebarHeader}>
          <div style={s.logoRow}>
            <div style={s.logoIcon}>🧪</div>
            <div>
              <div style={s.logoTitle}>Ranomed -2 </div>
              <div style={s.logoSub}>Laborant Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={s.nav}>
          <div style={s.navSection}>ASOSIY</div>

          {[
            { label: '📊 Dashboard', active: true },
            { label: '⏳ Kutilayotganlar', active: false, count: pending },
            { label: '✅ Tayyor tahlillar', active: false, count: ready },
          ].map((item, i) => (
            <button
              key={i}
              className="nav-item-btn"
              style={s.navItem(item.active)}
              onClick={() => { if (i === 1) setFilter('kutilmoqda'); else if (i === 2) setFilter('tayyor'); else setFilter('barcha'); }}
            >
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span style={{
                  marginLeft: 'auto', minWidth: '20px', height: '20px',
                  borderRadius: '10px', background: item.active ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                  fontSize: '10px', fontWeight: 800, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'white', padding: '0 6px'
                }}>{item.count}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User / Logout */}
        <div style={s.sidebarFooter}>
          <div style={s.userBox}>
            <div style={s.userAvatar}>
              {(user.name || 'L')[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={s.userName}>{user.name || 'Laborant'}</div>
              <div style={s.userRole}>Laborant</div>
            </div>
            <button className="logout-btn" style={s.logoutBtn} onClick={handleLogout} title="Chiqish">🚪</button>
          </div>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <main style={s.main}>

        {/* Topbar */}
        <header style={s.topbar}>
          <h1 style={s.pageTitle}>Laboratoriya Boshqaruvi</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={s.timePill}>
              🕐 {time.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              &nbsp;&nbsp;|&nbsp;&nbsp;
              {time.toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              background: COLORS.bg, border: `1px solid ${COLORS.border}`,
              borderRadius: '40px', padding: '5px 14px 5px 5px'
            }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '12px', color: 'white'
              }}>
                {(user.name || 'L')[0].toUpperCase()}
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{user.name || 'Laborant'}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={s.content}>

          {/* Stats */}
          <div style={s.statsRow}>
            {[
              { label: 'Kutilayotgan tahlillar', value: pending, color: '#d97706', bg: '#fef3c7', icon: '⏳' },
              { label: 'Tayyor natijalari', value: ready, color: '#059669', bg: '#d1fae5', icon: '✅' },
              { label: 'Jami tahlillar', value: total, color: '#6366f1', bg: '#ede9fe', icon: '🔬' },
            ].map((stat, i) => (
              <div key={i} className="stat-card-hover" style={s.statCard()}>
                <div style={s.statIconBox(stat.bg)}>{stat.icon}</div>
                <div>
                  <div style={s.statLabel}>{stat.label}</div>
                  <div style={s.statValue(stat.color)}>{stat.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter Bar */}
          <div style={s.filterBar}>
            <div style={s.filterBtns}>
              <button
                style={s.filterBtn(filter === 'kutilmoqda', COLORS.warning)}
                onClick={() => setFilter('kutilmoqda')}
              >
                ⏳ Kutilayotganlar ({pending})
              </button>
              <button
                style={s.filterBtn(filter === 'tayyor', COLORS.success)}
                onClick={() => setFilter('tayyor')}
              >
                ✅ Tayyor ({ready})
              </button>
              <button
                style={s.filterBtn(filter === 'barcha', '#64748b')}
                onClick={() => setFilter('barcha')}
              >
                📋 Barchasi ({total})
              </button>
            </div>
            <button className="refresh-btn" style={s.refreshBtn} onClick={fetchTests}>
              🔄 Yangilash
            </button>
          </div>

          {/* Table */}
          <div style={s.tableCard}>
            {loading ? (
              <div style={{ ...s.emptyBox }}>
                <div style={{ ...s.emptyIcon }}>⌛</div>
                <div style={s.emptyText}>Tahlillar yuklanmoqda...</div>
              </div>
            ) : filteredTests.length === 0 ? (
              <div style={s.emptyBox}>
                <div style={s.emptyIcon}>📥</div>
                <div style={s.emptyText}>
                  Hozircha tahlillar yo'q.<br />
                  Kassirdan to'lov tasdiqlangach tahlillar avtomatik shu yerda ko'rinadi.
                </div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={s.tableHead}>
                    <tr>
                      {['ID', 'Bemor', 'Tahlil Turi', 'Sana', 'Holati', 'Amal'].map(h => (
                        <th key={h} style={s.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTests.map((test, idx) => (
                      <tr key={test.id} style={{ background: idx % 2 === 0 ? 'white' : '#fafbfd' }}>
                        <td style={{ ...s.td, fontFamily: 'monospace', color: COLORS.muted, fontSize: '12px' }}>
                          #{test.id}
                        </td>
                        <td style={s.td}>
                          <div style={{ fontWeight: 700, fontSize: '13.5px', color: COLORS.text }}>
                            {test.Patient?.ism || test.patientName || `Bemor #${test.patientId}`}
                          </div>
                          {test.Patient?.telefon && (
                            <div style={{ fontSize: '11px', color: COLORS.muted, fontWeight: 400, marginTop: '2px' }}>
                              {test.Patient.telefon}
                            </div>
                          )}
                        </td>
                        <td style={{ ...s.td }}>
                          <span style={{
                            padding: '4px 11px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                            background: '#ecfeff', color: '#0e7490'
                          }}>
                            {test.testType}
                          </span>
                        </td>
                        <td style={{ ...s.td, fontSize: '12px', color: COLORS.muted }}>
                          {new Date(test.createdAt || Date.now()).toLocaleString('uz-UZ')}
                        </td>
                        <td style={s.td}>
                          {statusBadge(test.status)}
                        </td>
                        <td style={{ ...s.td, textAlign: 'right' }}>
                          <button
                            className="action-btn"
                            style={s.actionBtn(test.status === 'tayyor')}
                            onClick={() => handleOpenModal(test)}
                          >
                            {test.status === 'tayyor' ? '✏️ Tahrirlash' : '📝 Natija kiritish'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ===== MODAL ===== */}
      {selectedTest && (
        <div style={s.modalOverlay}>
          <div style={s.modalBox}>
            <div style={s.modalHeader}>
              <span style={s.modalTitle}>🧪 Tahlil Natijasini Kiritish</span>
              <button className="close-btn" style={s.closeBtn} onClick={() => setSelectedTest(null)}>✕</button>
            </div>
            <div style={s.modalBody}>
              <div style={s.infoRow}>
                <span style={{ fontSize: '12.5px', color: COLORS.muted, fontWeight: 500 }}>
                  Bemor:
                </span>
                <span style={s.infoChip('#6366f1')}>
                  {selectedTest.Patient?.ism || `Bemor #${selectedTest.patientId}`}
                </span>
                <span style={{ fontSize: '12.5px', color: COLORS.muted, fontWeight: 500, marginLeft: '4px' }}>
                  Tahlil:
                </span>
                <span style={s.infoChip('#06b6d4')}>
                  {selectedTest.testType}
                </span>
              </div>
              <label style={s.textareaLabel}>Natijalar (Xulosa / Ko'rsatkichlar):</label>
              <textarea
                rows={7}
                value={resultsText}
                onChange={(e) => setResultsText(e.target.value)}
                placeholder="Masalan: Hemoglobin: 135 g/l, Eritrotsitlar: 4.2 x 10^12/l, Leykotsitlar: 6.5 x 10^9/l. Natijalar me'yorda."
                style={s.textarea}
                onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.2)'; e.target.style.background = 'white'; }}
                onBlur={e => { e.target.style.borderColor = COLORS.border; e.target.style.boxShadow = 'none'; e.target.style.background = '#f8fafc'; }}
              />
            </div>
            <div style={s.modalFooter}>
              <button className="cancel-btn" style={s.cancelBtn} onClick={() => setSelectedTest(null)}>
                Bekor qilish
              </button>
              <button
                className="save-btn"
                style={{ ...s.saveBtn, opacity: isSubmitting ? 0.6 : 1 }}
                onClick={handleSaveResults}
                disabled={isSubmitting}
              >
                {isSubmitting ? '⌛ Saqlanmoqda...' : '✅ Natijani Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
