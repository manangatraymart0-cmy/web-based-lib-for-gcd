/* library-scene.js
 *
 * Draws the illustrated library background (bookshelves, moonlit windows,
 * hanging lamps, a reading desk, a globe) into <div id="scene"></div>.
 * Used by index.html, register.html and reset.html.
 * It is redrawn when the screen size changes, so it fits phones and tablets.
 */

(function () {

    var scene = document.getElementById("scene");

    if (!scene) {
        return;
    }


    /* ---------- animation styles ---------- */

    var style = document.createElement("style");

    style.textContent =
        ".scene svg { display: block; }" +
        ".scene .sway { animation: sceneSway 7s ease-in-out infinite; }" +
        "@keyframes sceneSway { 0%,100% { transform: rotate(-1.6deg); } 50% { transform: rotate(1.6deg); } }" +
        ".scene .glow { animation: sceneGlow 5s ease-in-out infinite; }" +
        "@keyframes sceneGlow { 0%,100% { opacity: .8; } 50% { opacity: 1; } }" +
        ".scene .mote { animation: sceneDrift 12s linear infinite; }" +
        "@keyframes sceneDrift { 0% { transform: translateY(0); opacity: 0; } 15% { opacity: .7; } 100% { transform: translateY(-80px); opacity: 0; } }" +
        ".scene .cloud { animation: sceneCloud 14s ease-in-out infinite; }" +
        "@keyframes sceneCloud { 0%,100% { transform: translateX(-4px); } 50% { transform: translateX(5px); } }" +
        "@keyframes sceneTwinkle { 0%,100% { opacity: .3; } 50% { opacity: 1; } }" +
        "@media (prefers-reduced-motion: reduce) { .scene * { animation: none !important; } }";

    document.head.appendChild(style);


    /* ---------- helpers ---------- */

    var BOOK_COLORS = [
        "#8e2f3a", "#2f5d46", "#25456f", "#d1a23a", "#2b7f7f",
        "#b5632f", "#e6d6aa", "#5d3f73", "#47607a", "#a8472f"
    ];

    var GOLD = "#e3b04b";

    var seed = 1;

    function rnd() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    }

    function pick(list) {
        return list[Math.floor(rnd() * list.length)];
    }

    function n1(value) {
        return Math.round(value * 10) / 10;
    }


    /* ---------- one book on a shelf ---------- */

    function book(x, baseY, w, h, color) {

        var top = baseY - h;

        var out = "";

        out += '<rect x="' + n1(x) + '" y="' + n1(top) + '" width="' + n1(w) + '" height="' + n1(h) + '" rx="2" fill="' + color + '"/>';

        out += '<rect x="' + n1(x + w * 0.80) + '" y="' + n1(top) + '" width="' + n1(w * 0.20) + '" height="' + n1(h) + '" fill="#000" opacity="0.2"/>';

        out += '<rect x="' + n1(x + w * 0.08) + '" y="' + n1(top) + '" width="' + n1(w * 0.14) + '" height="' + n1(h) + '" fill="#fff" opacity="0.12"/>';

        out += '<path d="M' + n1(x) + " " + n1(top + h * 0.13) + "h" + n1(w) + "v2.4h-" + n1(w) + "z" +
               "M" + n1(x) + " " + n1(baseY - h * 0.13 - 2.4) + "h" + n1(w) + "v2.4h-" + n1(w) + 'z" fill="' + GOLD + '" opacity="0.8"/>';

        if (w > 20 && rnd() < 0.55) {

            out += '<rect x="' + n1(x + w * 0.2) + '" y="' + n1(top + h * 0.34) + '" width="' + n1(w * 0.55) + '" height="' + n1(h * 0.16) + '" rx="1" fill="#f4ead0" opacity="0.85"/>';

        }

        return out;

    }


    /* ---------- extras that sit on a shelf ---------- */

    function plant(x, baseY) {

        var out = "";

        out += '<path d="M' + n1(x + 4) + " " + n1(baseY - 16) + "h20l-3 16h-14z" + '" fill="#e07a3c"/>';

        out += '<ellipse cx="' + n1(x + 8) + '" cy="' + n1(baseY - 26) + '" rx="6" ry="13" fill="#2f8f6a" transform="rotate(-28 ' + n1(x + 8) + " " + n1(baseY - 26) + ')"/>';

        out += '<ellipse cx="' + n1(x + 20) + '" cy="' + n1(baseY - 26) + '" rx="6" ry="13" fill="#3aa57a" transform="rotate(28 ' + n1(x + 20) + " " + n1(baseY - 26) + ')"/>';

        out += '<ellipse cx="' + n1(x + 14) + '" cy="' + n1(baseY - 31) + '" rx="5" ry="14" fill="#47b98a"/>';

        return out;

    }

    function stack(x, baseY, w) {

        var out = "";

        var y = baseY;

        var count = 2 + Math.floor(rnd() * 2);

        for (var i = 0; i < count; i++) {

            var h = 9 + Math.floor(rnd() * 5);

            var color = pick(BOOK_COLORS);

            var bw = w - Math.floor(rnd() * 8);

            y -= h;

            out += '<rect x="' + n1(x + (w - bw) / 2) + '" y="' + n1(y) + '" width="' + n1(bw) + '" height="' + h + '" rx="1.5" fill="' + color + '"/>';

            out += '<rect x="' + n1(x + (w - bw) / 2) + '" y="' + n1(y + h - 3) + '" width="' + n1(bw) + '" height="2" fill="#f4ead0" opacity="0.7"/>';

        }

        return out;

    }


    /* ---------- a bookcase ---------- */

    function bookcase(x, y, w, h) {

        var out = "";

        out += '<rect x="' + n1(x) + '" y="' + n1(y) + '" width="' + n1(w) + '" height="' + n1(h) + '" rx="3" fill="url(#wood)"/>';

        var ix = x + 8;
        var iy = y + 8;
        var iw = w - 16;
        var ih = h - 16;

        out += '<rect x="' + n1(ix) + '" y="' + n1(iy) + '" width="' + n1(iw) + '" height="' + n1(ih) + '" fill="#4a2d1a"/>';

        var rows = Math.max(1, Math.round(ih / 118));

        var rowH = ih / rows;

        for (var i = 0; i < rows; i++) {

            var baseY = iy + (i + 1) * rowH - 8;

            var cx = ix + 5;

            var limit = ix + iw - 5;

            while (limit - cx > 14) {

                if (rnd() < 0.05) {

                    cx += 8 + rnd() * 10;

                    continue;

                }

                var bw = 14 + Math.floor(rnd() * 17);

                if (cx + bw > limit) {

                    bw = limit - cx;

                }

                if (bw < 10) {

                    break;

                }

                var bh = Math.min(rowH - 18, rowH * (0.5 + rnd() * 0.36));

                out += book(cx, baseY, bw, bh, pick(BOOK_COLORS));

                cx += bw + 1.5;

            }

            var room = limit - cx;

            if (room > 30) {

                var roll = rnd();

                if (roll < 0.30) {

                    out += stack(cx + 2, baseY, Math.min(room - 4, 44));

                }

                else if (roll < 0.5) {

                    out += plant(cx + 2, baseY);

                }

            }

            out += '<rect x="' + n1(ix) + '" y="' + n1(baseY) + '" width="' + n1(iw) + '" height="8" fill="url(#wood)"/>';

            out += '<rect x="' + n1(ix) + '" y="' + n1(baseY) + '" width="' + n1(iw) + '" height="1.5" fill="#fff" opacity="0.18"/>';

        }

        return out;

    }


    /* ---------- an arched window with a night sky ---------- */

    function archWindow(cx, top, w, h, withMoon) {

        var x = cx - w / 2;

        var rad = w / 2;

        var bodyTop = top + rad;

        var bottom = top + h;

        var shape = "M" + n1(x) + " " + n1(bottom) + "V" + n1(bodyTop) +
                    "A" + n1(rad) + " " + n1(rad) + " 0 0 1 " + n1(x + w) + " " + n1(bodyTop) +
                    "V" + n1(bottom) + "Z";

        var out = "";

        out += '<path d="' + shape + '" fill="url(#sky)"/>';

        for (var i = 0; i < 3; i++) {

            var sx = x + 14 + rnd() * (w - 28);

            var sy = bodyTop - rad * 0.4 + rnd() * (h * 0.35);

            var cw = 12 + rnd() * 10;

            out += '<g class="cloud" style="animation-delay:' + n1(rnd() * 4) + 's" fill="#fff" opacity="0.92"><ellipse cx="' + n1(sx) + '" cy="' + n1(sy) + '" rx="' + n1(cw) + '" ry="' + n1(cw * 0.42) + '"/><ellipse cx="' + n1(sx + cw * 0.5) + '" cy="' + n1(sy - cw * 0.25) + '" rx="' + n1(cw * 0.6) + '" ry="' + n1(cw * 0.4) + '"/></g>';

        }

        if (withMoon) {

            var mx = cx + w * 0.12;

            var my = bodyTop - rad * 0.05;

            out += '<circle cx="' + n1(mx) + '" cy="' + n1(my) + '" r="' + n1(w * 0.26) + '" fill="#fff3a8" opacity="0.45"/>';

            out += '<circle cx="' + n1(mx) + '" cy="' + n1(my) + '" r="' + n1(w * 0.13) + '" fill="#ffd23f"/>';

            

        }

        out += '<path d="M' + n1(x) + " " + n1(bottom) + "V" + n1(bottom - h * 0.1) +
               "Q" + n1(cx) + " " + n1(bottom - h * 0.24) + " " + n1(x + w) + " " + n1(bottom - h * 0.09) +
               "V" + n1(bottom) + 'Z" fill="#7a9a50"/>';

        out += '<line x1="' + n1(cx) + '" y1="' + n1(top) + '" x2="' + n1(cx) + '" y2="' + n1(bottom) + '" stroke="#5a3418" stroke-width="4"/>';

        out += '<line x1="' + n1(x) + '" y1="' + n1(bodyTop + (bottom - bodyTop) * 0.4) + '" x2="' + n1(x + w) + '" y2="' + n1(bodyTop + (bottom - bodyTop) * 0.4) + '" stroke="#5a3418" stroke-width="4"/>';

        out += '<line x1="' + n1(x) + '" y1="' + n1(bodyTop + (bottom - bodyTop) * 0.75) + '" x2="' + n1(x + w) + '" y2="' + n1(bodyTop + (bottom - bodyTop) * 0.75) + '" stroke="#5a3418" stroke-width="4"/>';

        out += '<path d="' + shape + '" fill="none" stroke="#5a3418" stroke-width="9"/>';

        out += '<rect x="' + n1(x - 9) + '" y="' + n1(bottom) + '" width="' + n1(w + 18) + '" height="10" rx="2" fill="url(#wood)"/>';

        return out;

    }


    /* ---------- moonlight falling from a window ---------- */

    function beam(cx, w, top, floorY, lean) {

        var x = cx - w / 2;

        var spread = w * 0.8;

        return '<polygon points="' + n1(x + 4) + "," + n1(top) + " " + n1(x + w - 4) + "," + n1(top) + " " +
               n1(x + w + spread + lean) + "," + n1(floorY) + " " + n1(x - spread + lean) + "," + n1(floorY) +
               '" fill="url(#beam)"/>';

    }


    /* ---------- hanging lamp ---------- */

    function lamp(cx, cord, scale, delay) {

        var sw = 44 * scale;

        var lipY = cord + 32 * scale;

        var out = '<g class="sway" style="transform-origin:' + n1(cx) + "px 0px;animation-delay:" + delay + 's">';

        out += '<line x1="' + n1(cx) + '" y1="0" x2="' + n1(cx) + '" y2="' + n1(cord) + '" stroke="#6b5a45" stroke-width="2"/>';

        out += '<circle class="glow" cx="' + n1(cx) + '" cy="' + n1(lipY + 8) + '" r="' + n1(130 * scale) + '" fill="url(#lampGlow)"/>';

        out += '<path d="M' + n1(cx - sw) + " " + n1(lipY) + "Q" + n1(cx) + " " + n1(cord - 16 * scale) + " " + n1(cx + sw) + " " + n1(lipY) + 'Z" fill="#2f8a5b"/>';

        out += '<path d="M' + n1(cx - sw) + " " + n1(lipY) + "Q" + n1(cx - sw * 0.2) + " " + n1(cord - 6 * scale) + " " + n1(cx) + " " + n1(cord - 12 * scale) + "Q" + n1(cx - sw * 0.6) + " " + n1(cord + 4 * scale) + " " + n1(cx - sw) + " " + n1(lipY) + 'Z" fill="#fff" opacity="0.18"/>';

        out += '<ellipse cx="' + n1(cx) + '" cy="' + n1(lipY) + '" rx="' + n1(sw) + '" ry="' + n1(4 * scale) + '" fill="#ffe9a8"/>';

        out += "</g>";

        return out;

    }


    /* ---------- reading desk with a lamp and books ---------- */

    function desk(cx, baseY, scale) {

        var w = 200 * scale;

        var topY = baseY - 84 * scale;

        var out = "";

        out += '<ellipse cx="' + n1(cx) + '" cy="' + n1(baseY + 6 * scale) + '" rx="' + n1(w * 0.78) + '" ry="' + n1(15 * scale) + '" fill="#7a2230" opacity="0.8"/>';

        out += '<ellipse cx="' + n1(cx) + '" cy="' + n1(baseY + 6 * scale) + '" rx="' + n1(w * 0.62) + '" ry="' + n1(10 * scale) + '" fill="none" stroke="' + GOLD + '" stroke-width="1.5" opacity="0.7"/>';

        out += '<rect x="' + n1(cx - w / 2 + 10 * scale) + '" y="' + n1(topY) + '" width="' + n1(8 * scale) + '" height="' + n1(baseY - topY) + '" fill="#8a5a30"/>';

        out += '<rect x="' + n1(cx + w / 2 - 18 * scale) + '" y="' + n1(topY) + '" width="' + n1(8 * scale) + '" height="' + n1(baseY - topY) + '" fill="#8a5a30"/>';

        out += '<rect x="' + n1(cx - w / 2) + '" y="' + n1(topY) + '" width="' + n1(w) + '" height="' + n1(12 * scale) + '" rx="3" fill="url(#wood)"/>';

        /* stack of books */

        var colors = ["#25456f", "#8e2f3a", "#2f5d46"];

        for (var i = 0; i < 3; i++) {

            out += '<rect x="' + n1(cx - w / 2 + (14 + i * 3) * scale) + '" y="' + n1(topY - (i + 1) * 12 * scale) + '" width="' + n1(52 * scale) + '" height="' + n1(12 * scale) + '" rx="2" fill="' + colors[i] + '"/>';

            out += '<rect x="' + n1(cx - w / 2 + (14 + i * 3) * scale) + '" y="' + n1(topY - (i + 1) * 12 * scale + 8 * scale) + '" width="' + n1(52 * scale) + '" height="' + n1(2 * scale) + '" fill="#f4ead0" opacity="0.7"/>';

        }

        /* open book */

        var bx = cx - 8 * scale;

        out += '<path d="M' + n1(bx - 38 * scale) + " " + n1(topY) + "l" + n1(38 * scale) + " " + n1(-10 * scale) + "v" + n1(10 * scale) + 'z" fill="#f4ead0"/>';

        out += '<path d="M' + n1(bx + 38 * scale) + " " + n1(topY) + "l" + n1(-38 * scale) + " " + n1(-10 * scale) + "v" + n1(10 * scale) + 'z" fill="#e7dcc0"/>';

        /* table lamp */

        var lx = cx + w / 2 - 40 * scale;

        out += '<circle class="glow" cx="' + n1(lx) + '" cy="' + n1(topY - 46 * scale) + '" r="' + n1(95 * scale) + '" fill="url(#lampGlow)"/>';

        out += '<rect x="' + n1(lx - 2 * scale) + '" y="' + n1(topY - 34 * scale) + '" width="' + n1(4 * scale) + '" height="' + n1(34 * scale) + '" fill="#8a8f98"/>';

        out += '<ellipse cx="' + n1(lx) + '" cy="' + n1(topY) + '" rx="' + n1(13 * scale) + '" ry="' + n1(3 * scale) + '" fill="#8a8f98"/>';

        out += '<path d="M' + n1(lx - 22 * scale) + " " + n1(topY - 32 * scale) + "l" + n1(10 * scale) + " " + n1(-26 * scale) + "h" + n1(24 * scale) + "l" + n1(10 * scale) + " " + n1(26 * scale) + 'z" fill="#2f8a5b"/>';

        return out;

    }


    /* ---------- globe ---------- */

    function globe(cx, baseY, scale) {

        var r = 34 * scale;

        var cy = baseY - 62 * scale - r;

        var out = "";

        out += '<ellipse cx="' + n1(cx) + '" cy="' + n1(baseY) + '" rx="' + n1(26 * scale) + '" ry="' + n1(6 * scale) + '" fill="#8a5a30"/>';

        out += '<rect x="' + n1(cx - 3 * scale) + '" y="' + n1(cy + r) + '" width="' + n1(6 * scale) + '" height="' + n1(baseY - cy - r) + '" fill="#8a5a30"/>';

        out += '<circle cx="' + n1(cx) + '" cy="' + n1(cy) + '" r="' + n1(r) + '" fill="url(#globeFill)"/>';

        out += '<path d="M' + n1(cx - r * 0.5) + " " + n1(cy - r * 0.3) + "q" + n1(r * 0.3) + " " + n1(-r * 0.4) + " " + n1(r * 0.55) + " " + n1(-r * 0.1) + "q" + n1(r * 0.1) + " " + n1(r * 0.5) + " " + n1(-r * 0.25) + " " + n1(r * 0.6) + 'z" fill="#3aa57a" opacity="0.85"/>';

        out += '<path d="M' + n1(cx + r * 0.1) + " " + n1(cy + r * 0.2) + "q" + n1(r * 0.4) + " " + n1(-r * 0.1) + " " + n1(r * 0.45) + " " + n1(r * 0.3) + "q" + n1(-r * 0.2) + " " + n1(r * 0.35) + " " + n1(-r * 0.5) + " " + n1(r * 0.1) + 'z" fill="#3aa57a" opacity="0.85"/>';

        out += '<path d="M' + n1(cx - r * 0.85) + " " + n1(cy - r * 0.55) + "A" + n1(r * 1.15) + " " + n1(r * 1.15) + " 0 0 1 " + n1(cx + r * 0.85) + " " + n1(cy - r * 0.55) + '" fill="none"/>';

        out += '<path d="M' + n1(cx + r * 0.9) + " " + n1(cy - r * 0.6) + "A" + n1(r * 1.2) + " " + n1(r * 1.2) + " 0 0 1 " + n1(cx - r * 0.9) + " " + n1(cy + r * 0.7) + '" fill="none" stroke="' + GOLD + '" stroke-width="2.5"/>';

        return out;

    }


    /* ---------- rolling ladder ---------- */

    function ladder(x, topY, floorY) {

        var out = "";

        out += '<line x1="' + n1(x) + '" y1="' + n1(topY) + '" x2="' + n1(x + 26) + '" y2="' + n1(floorY) + '" stroke="#b9854d" stroke-width="5" stroke-linecap="round"/>';

        out += '<line x1="' + n1(x + 34) + '" y1="' + n1(topY) + '" x2="' + n1(x + 60) + '" y2="' + n1(floorY) + '" stroke="#b9854d" stroke-width="5" stroke-linecap="round"/>';

        var steps = Math.floor((floorY - topY) / 34);

        for (var i = 1; i < steps; i++) {

            var t = i / steps;

            var y = topY + (floorY - topY) * t;

            out += '<line x1="' + n1(x + 26 * t) + '" y1="' + n1(y) + '" x2="' + n1(x + 34 + 26 * t) + '" y2="' + n1(y) + '" stroke="#b9854d" stroke-width="4" stroke-linecap="round"/>';

        }

        return out;

    }


    /* ---------- the whole scene ---------- */

    function draw() {

        var W = window.innerWidth;

        var H = window.innerHeight;

        seed = 11;

        var floorY = Math.round(H * 0.87);

        var out = "";

        out += '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H + '">';

        out += "<defs>" +
               '<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9d3a6"/><stop offset="1" stop-color="#cfa56f"/></linearGradient>' +
               '<linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a5f33"/><stop offset="1" stop-color="#6b3d1e"/></linearGradient>' +
               '<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9703f"/><stop offset="1" stop-color="#6e4222"/></linearGradient>' +
               '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fc4e8"/><stop offset="1" stop-color="#f8e2b0"/></linearGradient>' +
               '<linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6c2" stop-opacity="0.45"/><stop offset="1" stop-color="#fff6c2" stop-opacity="0"/></linearGradient>' +
               '<radialGradient id="lampGlow"><stop offset="0" stop-color="#fff0b0" stop-opacity="0.35"/><stop offset="0.5" stop-color="#ffe9a0" stop-opacity="0.1"/><stop offset="1" stop-color="#ffc25a" stop-opacity="0"/></radialGradient>' +
               '<radialGradient id="globeFill" cx="0.35" cy="0.3"><stop offset="0" stop-color="#5aa0e0"/><stop offset="1" stop-color="#1d4f91"/></radialGradient>' +
               '<radialGradient id="vignette" cx="0.5" cy="0.5" r="0.75"><stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#3a1f0c" stop-opacity="0.38"/></radialGradient>' +
               "</defs>";

        out += '<rect width="' + W + '" height="' + H + '" fill="url(#wall)"/>';


        /* floor and baseboard */

        out += '<rect x="0" y="' + floorY + '" width="' + W + '" height="' + (H - floorY) + '" fill="url(#floor)"/>';

        out += '<rect x="0" y="' + (floorY - 9) + '" width="' + W + '" height="9" fill="url(#wood)"/>';

        for (var p = 1; p <= 2; p++) {

            out += '<line x1="0" y1="' + n1(floorY + (H - floorY) * p / 3) + '" x2="' + W + '" y2="' + n1(floorY + (H - floorY) * p / 3) + '" stroke="#7a5a30" stroke-opacity="0.35"/>';

        }


        /* wooden wainscot panelling on the lower wall */

        var wTop = Math.round(floorY - Math.min(H * 0.26, 210));

        out += '<rect x="0" y="' + wTop + '" width="' + W + '" height="' + (floorY - wTop) + '" fill="#8b5a30" opacity="0.55"/>';

        out += '<rect x="0" y="' + wTop + '" width="' + W + '" height="7" fill="url(#wood)"/>';

        for (var pn = 0; pn * 120 < W; pn++) {

            out += '<rect x="' + (pn * 120 + 14) + '" y="' + (wTop + 18) + '" width="92" height="' + (floorY - wTop - 34) + '" rx="3" fill="none" stroke="#3a1f0c" stroke-opacity="0.35" stroke-width="2"/>';

        }

        var card = Math.min(W / 2, 232);

        var side = W / 2 - card;


        if (W >= 1000) {

            /* ----- wide screens: bookcases at the sides, windows and furniture between ----- */

            var shelfW = Math.round(Math.min(side * 0.62, 380));

            var zone = side - shelfW;

            var winW = Math.round(Math.max(70, Math.min(zone * 0.62, 170)));

            var winH = Math.round(Math.min(H * 0.44, 340));

            var winTop = Math.round(H * 0.15);

            var leftC = shelfW + zone / 2;

            var rightC = W - shelfW - zone / 2;

            out += beam(leftC, winW, winTop + winH, floorY, 50);

            out += beam(rightC, winW, winTop + winH, floorY, -50);

            out += archWindow(leftC, winTop, winW, winH, true);

            out += archWindow(rightC, winTop, winW, winH, false);

            out += bookcase(0, 12, shelfW, floorY - 12);

            out += bookcase(W - shelfW, 12, shelfW, floorY - 12);

            out += ladder(shelfW - 78, 60, floorY - 4);

            out += globe(leftC, floorY + (H - floorY) * 0.62, Math.min(1.1, zone / 150));

            out += desk(rightC, floorY + (H - floorY) * 0.62, Math.min(0.9, zone / 230));

            out += lamp(leftC, H * 0.05, 0.9, 0);

            out += lamp(rightC, H * 0.05, 0.9, 1.7);

        }

        else if (W >= 600) {

            /* ----- tablets held upright ----- */

            var sideW = Math.max(60, Math.round(side - 8));

            out += bookcase(0, 12, sideW, floorY - 12);

            out += bookcase(W - sideW, 12, sideW, floorY - 12);

            out += lamp(sideW + 40, H * 0.04, 0.8, 0);

            out += lamp(W - sideW - 40, H * 0.04, 0.8, 1.7);

        }

        else {

            /* ----- phones: a shelf along the top and along the bottom ----- */

            var band = Math.round(Math.min(H * 0.15, 130));

            out += bookcase(0, 12, W, band);

            out += bookcase(0, floorY - band + 20, W, band - 10);

        }


        /* wall clock and bulletin board (wide screens) */

        if (W >= 1000) {

            var ccx = W / 2;

            out += '<circle cx="' + n1(ccx) + '" cy="' + n1(H * 0.12) + '" r="24" fill="#fbf7ee" stroke="#5a3418" stroke-width="5"/>';

            out += '<line x1="' + n1(ccx) + '" y1="' + n1(H * 0.12) + '" x2="' + n1(ccx) + '" y2="' + n1(H * 0.12 - 14) + '" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>';

            out += '<line x1="' + n1(ccx) + '" y1="' + n1(H * 0.12) + '" x2="' + n1(ccx + 10) + '" y2="' + n1(H * 0.12 + 5) + '" stroke="#8e2f3a" stroke-width="2.5" stroke-linecap="round"/>';

        }


        /* crown molding */

        out += '<rect x="0" y="0" width="' + W + '" height="12" fill="#5a3418"/>';

        out += '<rect width="' + W + '" height="' + H + '" fill="url(#vignette)"/>';


        /* floating dust in the lamp light */

        for (var m = 0; m < 26; m++) {

            out += '<circle class="mote" cx="' + n1(rnd() * W) + '" cy="' + n1(H * 0.25 + rnd() * H * 0.7) + '" r="' + n1(1 + rnd() * 1.8) + '" fill="#fff6c0" opacity="0" style="animation-duration:' + n1(9 + rnd() * 9) + "s;animation-delay:-" + n1(rnd() * 12) + 's"/>';

        }

        out += "</svg>";

        scene.innerHTML = out;

    }


    draw();

    var timer = null;

    window.addEventListener("resize", function () {

        clearTimeout(timer);

        timer = setTimeout(draw, 200);

    });

})();
