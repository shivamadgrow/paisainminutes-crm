/*
 * Calculator inputs stay inside their limits (fix F-15).
 * Each calculator has a number box paired with a slider (id "xxx" and "xxxBox"). The slider limits the calculation, but
 * the box used to keep whatever was typed, so the page could show 84 months or Rs 99,99,99,999 next to a result that was
 * really worked out for 60 months or Rs 25,00,000. The box is now brought back to the limit and a short note says why.
 * Too-large values are corrected as you type; too-small ones when you leave the box, so typing "50" never gets
 * rewritten to the minimum after the first digit.
 */
(function () {
    'use strict';

    function format(value) {
        try { return Number(value).toLocaleString('en-IN'); } catch (e) { return String(value); }
    }
    function fire(el, type) {
        el.dispatchEvent(new Event(type, { bubbles: true }));
    }

    function attach(box) {
        var range = document.getElementById(box.id.slice(0, -3));
        if (!range || range.type !== 'range') return;
        var min = Number(range.min);
        var max = Number(range.max);
        if (!isFinite(min) || !isFinite(max)) return;

        var note = document.createElement('div');
        note.setAttribute('role', 'status');
        note.style.cssText = 'font-size:12px;color:#B45309;margin-top:2px;min-height:0;display:none;';
        box.parentNode.insertBefore(note, box.nextSibling);
        var timer = null;
        function say(text) {
            note.textContent = text;
            note.style.display = 'block';
            clearTimeout(timer);
            timer = setTimeout(function () { note.style.display = 'none'; }, 3500);
        }

        function clamp(leaving) {
            var value = parseFloat(box.value);
            if (isNaN(value)) return;
            if (value > max) {
                box.value = max;
                say('Maximum is ' + format(max));
                fire(box, 'input');
            } else if (value < min && leaving) {
                box.value = min;
                say('Minimum is ' + format(min));
                fire(box, 'input');
                fire(box, 'change');
            }
        }
        box.addEventListener('input', function () { clamp(false); });
        box.addEventListener('change', function () { clamp(true); });
        box.addEventListener('blur', function () { clamp(true); });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var boxes = document.querySelectorAll('input[type="number"][id$="Box"]');
        for (var i = 0; i < boxes.length; i++) attach(boxes[i]);
    });
})();
