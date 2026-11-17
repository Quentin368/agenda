"""Palette de 16 couleurs de la maquette (COLORS / --cal-* en thème clair) ⇄ ICAL:calendar-color (hex).

Écriture : on écrit le hex de la palette. Lecture : on prend la couleur de palette la plus proche,
en comparant surtout la teinte (OKLCH) : un « vert vif » d'un autre client doit donner « vert »
et non une couleur plus sombre mais d'une autre teinte.
"""
import math

PALETTE = {
    'red': '#c2383a', 'orange': '#b6511c', 'amber': '#8c6508', 'olive': '#5f6f1a',
    'green': '#1f7a52', 'mint': '#127a6a', 'teal': '#13747f', 'sky': '#1c6ea4',
    'blue': '#3a62d6', 'violet': '#6d48d8', 'plum': '#7f3d8e', 'fuchsia': '#a8329a',
    'pink': '#c4366f', 'brown': '#87553a', 'slate': '#566079', 'graphite': '#525459',
}
DEFAULT = 'slate'


def _oklch(hex_color: str):
    h = hex_color.strip().lstrip('#')
    if len(h) in (3, 4):
        h = ''.join(c * 2 for c in h[:3])
    h = h[:6]
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    lin = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = lin(r), lin(g), lin(b)
    l_ = (0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b) ** (1 / 3)
    m_ = (0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b) ** (1 / 3)
    s_ = (0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b) ** (1 / 3)
    L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
    a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
    bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
    return L, math.hypot(a, bb), math.degrees(math.atan2(bb, a)) % 360


_P = {k: _oklch(v) for k, v in PALETTE.items()}


def nearest(hex_color: str | None) -> str:
    """Couleur de palette la plus proche d'un hex quelconque (#rgb, #rrggbb, #rrggbbaa)."""
    if not hex_color:
        return DEFAULT
    try:
        L, C, H = _oklch(hex_color)
    except (ValueError, IndexError):
        return DEFAULT
    if hex_color.strip().lstrip('#').lower()[:6] in {v[1:] for v in PALETTE.values()}:
        return next(k for k, v in PALETTE.items() if v[1:] == hex_color.strip().lstrip('#').lower()[:6])

    def dist(p):
        pL, pC, pH = p
        if C < 0.04 or pC < 0.04:          # gris : la teinte ne veut rien dire
            return abs(C - pC) * 4 + abs(L - pL) * 0.5 + (0 if C < 0.04 and pC < 0.04 else 1)
        dh = min(abs(H - pH), 360 - abs(H - pH)) / 180          # 0..1
        return dh * 3 + abs(L - pL) * 0.6 + abs(C - pC) * 0.6
    return min(_P, key=lambda k: dist(_P[k]))


def to_hex(name: str) -> str:
    return PALETTE.get(name, PALETTE[DEFAULT])
