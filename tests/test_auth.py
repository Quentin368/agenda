"""Sessions en mémoire et limitation des tentatives (horloge simulée)."""
from agenda.auth import RateLimiter, SessionStore


class Clock:
    def __init__(self):
        self.t = 1000.0

    def __call__(self):
        return self.t


def test_session_expire_apres_inactivite_et_glisse():
    c = Clock()
    st = SessionStore(session_hours=12, remember_days=30, clock=c)
    s = st.create('quentin', 'secret', remember=False)
    c.t += 11 * 3600
    assert st.get(s.sid) is s                 # utilisée : repart pour 12 h
    c.t += 11 * 3600
    assert st.get(s.sid) is s
    c.t += 12 * 3600 + 1
    assert st.get(s.sid) is None and len(st) == 0


def test_rester_connecte_30_jours():
    c = Clock()
    st = SessionStore(12, 30, clock=c)
    s = st.create('quentin', 'secret', remember=True)
    c.t += 29 * 86400
    assert st.get(s.sid) is s
    c.t += 30 * 86400 + 1
    assert st.get(s.sid) is None


def test_mot_de_passe_absent_des_journaux():
    s = SessionStore(1, 1).create('quentin', 'tres-secret', False)
    assert 'tres-secret' not in repr(s)


def test_limitation_par_cle_et_fenetre():
    c = Clock()
    rl = RateLimiter(3, 15, clock=c)
    for _ in range(3):
        assert rl.retry_after('ip:a', 'user:q') == 0
        rl.failure('ip:a', 'user:q')
    assert rl.retry_after('ip:a') > 0 and rl.retry_after('user:q') > 0 and rl.retry_after('ip:b') == 0
    c.t += 15 * 60 + 1
    assert rl.retry_after('ip:a', 'user:q') == 0
    rl.failure('ip:a')
    rl.success('ip:a')
    assert rl.retry_after('ip:a') == 0
