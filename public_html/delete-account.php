<?php
$page_title = "Delete Your Account | Paisa in Minutes";
$page_description = "Request deletion of your Paisa in Minutes account and personal data. Works without needing the app installed.";
$page_keywords = "delete account, account deletion, paisa in minutes delete account, data deletion request";
include 'includes/header.php';
?>

<!-- Custom Styles for Delete Account Page -->
<style>
.da-hero {
    background: var(--gradient-primary);
    padding: 7.5rem 0 4rem 0;
    color: var(--white);
    text-align: center;
}
.da-hero-badge {
    display: inline-block;
    padding: 0.4rem 1.2rem;
    background: rgba(244, 63, 94, 0.18);
    color: #FB7185;
    border-radius: var(--border-radius-pill);
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    margin-bottom: 1.25rem;
    border: 1px solid rgba(244, 63, 94, 0.35);
}
.da-hero h1 {
    font-size: 2.6rem;
    font-family: var(--font-heading);
    font-weight: 800;
    color: #FFFFFF !important;
    margin-bottom: 1rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.da-hero p {
    font-size: 1.05rem;
    color: #E2E8F0 !important;
    max-width: 650px;
    margin: 0 auto;
    line-height: 1.6;
}
.da-content-sec {
    padding: 4rem 0;
    background: var(--light-gray);
}
.da-card {
    background: var(--white);
    border-radius: var(--border-radius-lg);
    padding: 2.5rem;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--border-color);
    max-width: 560px;
    margin: 0 auto;
    color: var(--text-dark);
}
.da-card h2 {
    font-size: 1.3rem;
    color: var(--primary-color);
    margin: 0 0 1rem 0;
    font-family: var(--font-heading);
}
.da-card p {
    margin-bottom: 1rem;
    color: #4B5563;
    line-height: 1.6;
}
.da-card ul {
    padding-left: 1.3rem;
    margin-bottom: 1.25rem;
    color: #4B5563;
}
.da-card li {
    margin-bottom: 0.4rem;
}
.da-field {
    margin-bottom: 1.1rem;
}
.da-field label {
    display: block;
    font-weight: 600;
    font-size: 0.85rem;
    color: var(--text-dark);
    margin-bottom: 0.4rem;
}
.da-field input[type="tel"],
.da-field input[type="text"] {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-dark);
    background: var(--light-gray);
    box-sizing: border-box;
}
.da-field input:focus {
    outline: none;
    border-color: var(--accent-color);
}
.da-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.9rem 1.5rem;
    border: none;
    border-radius: 10px;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: opacity 0.15s ease;
}
.da-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}
.da-btn-primary {
    background: var(--accent-color);
    color: #fff;
}
.da-btn-danger {
    background: #DC2626;
    color: #fff;
}
.da-btn-ghost {
    background: transparent;
    color: var(--text-dark);
    border: 1px solid var(--border-color);
    margin-top: 0.6rem;
}
.da-consent {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    background: #FEF2F2;
    border: 1px solid #FECACA;
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 1.25rem;
}
.da-consent input {
    margin-top: 0.2rem;
}
.da-consent label {
    font-size: 0.85rem;
    color: #7F1D1D;
    font-weight: 600;
    line-height: 1.5;
}
.da-msg {
    border-radius: 10px;
    padding: 0.8rem 1rem;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 1.1rem;
    display: none;
}
.da-msg.show { display: block; }
.da-msg-error { background: #FEF2F2; color: #B91C1C; border: 1px solid #FECACA; }
.da-msg-info { background: #EFF6FF; color: var(--primary-color); border: 1px solid #BFDBFE; }
.da-msg-success { background: #ECFDF5; color: #065F46; border: 1px solid #A7F3D0; }
.da-step { display: none; }
.da-step.active { display: block; }
.da-done-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #ECFDF5;
    color: #059669;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    margin: 0 auto 1rem auto;
}
</style>

<section class="da-hero">
    <div class="container">
        <span class="da-hero-badge">Account &amp; Data</span>
        <h1>Delete Your Account</h1>
        <p>Request permanent deletion of your Paisa in Minutes account and personal data — you don't need the app installed to do this.</p>
    </div>
</section>

<section class="da-content-sec">
    <div class="container">
        <div class="da-card">

            <!-- STEP 1: Phone -->
            <div class="da-step active" id="da-step-phone">
                <h2>1. Verify your mobile number</h2>
                <p>Enter the mobile number registered on your Paisa in Minutes account. We'll send a 6-digit OTP to confirm it's you.</p>
                <div id="da-msg-phone" class="da-msg"></div>
                <div class="da-field">
                    <label for="da-phone">Registered Mobile Number</label>
                    <input type="tel" id="da-phone" maxlength="10" inputmode="numeric" placeholder="10-digit mobile number">
                </div>
                <button type="button" class="da-btn da-btn-primary" id="da-send-otp-1">Send OTP</button>
            </div>

            <!-- STEP 2: Verify OTP (login) -->
            <div class="da-step" id="da-step-verify">
                <h2>2. Enter the OTP</h2>
                <p>We sent a 6-digit code via SMS to <strong id="da-phone-display"></strong>.</p>
                <div id="da-msg-verify" class="da-msg"></div>
                <div class="da-field">
                    <label for="da-otp-1">6-Digit OTP</label>
                    <input type="text" id="da-otp-1" maxlength="6" inputmode="numeric" placeholder="••••••">
                </div>
                <button type="button" class="da-btn da-btn-primary" id="da-verify-1">Verify</button>
                <button type="button" class="da-btn da-btn-ghost" id="da-back-1">Back</button>
            </div>

            <!-- STEP 3: Confirm + what gets deleted -->
            <div class="da-step" id="da-step-confirm">
                <h2>3. Confirm deletion</h2>
                <p>This will permanently delete the following from your account:</p>
                <ul>
                    <li>Your name, email, PAN, city, state and pincode</li>
                    <li>Any saved bank account details</li>
                    <li>All active login sessions on every device</li>
                </ul>
                <p><strong>Retained for financial/compliance record-keeping:</strong> your past loan applications and credit-score check history are not deleted along with your profile.</p>
                <div id="da-msg-confirm" class="da-msg"></div>
                <div class="da-consent">
                    <input type="checkbox" id="da-consent-checkbox">
                    <label for="da-consent-checkbox">I understand this is permanent and want to delete my account and the data listed above.</label>
                </div>
                <button type="button" class="da-btn da-btn-danger" id="da-request-delete" disabled>Yes, Delete My Account</button>
                <button type="button" class="da-btn da-btn-ghost" id="da-cancel">Cancel</button>
            </div>

            <!-- STEP 4: Second OTP (reauth for deletion) -->
            <div class="da-step" id="da-step-reauth">
                <h2>4. Confirm with a new OTP</h2>
                <p>For your security, we've sent a fresh OTP to <strong id="da-phone-display-2"></strong>. Enter it below to finish deleting your account.</p>
                <div id="da-msg-reauth" class="da-msg"></div>
                <div class="da-field">
                    <label for="da-otp-2">6-Digit OTP</label>
                    <input type="text" id="da-otp-2" maxlength="6" inputmode="numeric" placeholder="••••••">
                </div>
                <button type="button" class="da-btn da-btn-danger" id="da-finish-delete">Confirm Deletion</button>
                <button type="button" class="da-btn da-btn-ghost" id="da-cancel-2">Cancel</button>
            </div>

            <!-- STEP 5: Done -->
            <div class="da-step" id="da-step-done">
                <div class="da-done-icon">&#10003;</div>
                <h2 style="text-align:center;">Account Deleted</h2>
                <p style="text-align:center;">Your account and the personal data listed above have been permanently deleted. If you log in again with this mobile number, you'll start with a fresh, blank profile.</p>
            </div>

        </div>
    </div>
</section>

<script>
(function () {
    var API_BASE = "https://api.paisainminutes.tech/api";
    var state = { phone: "", token: "" };

    function show(id) {
        document.querySelectorAll(".da-step").forEach(function (el) { el.classList.remove("active"); });
        document.getElementById(id).classList.add("active");
    }
    function msg(id, type, text) {
        var el = document.getElementById(id);
        el.className = "da-msg show da-msg-" + type;
        el.textContent = text;
    }
    function clearMsg(id) {
        var el = document.getElementById(id);
        el.className = "da-msg";
        el.textContent = "";
    }
    function cleanPhone(v) {
        return (v || "").replace(/\D/g, "").slice(-10);
    }
    function setBusy(btn, busy, labelBusy, labelIdle) {
        btn.disabled = busy;
        btn.textContent = busy ? labelBusy : labelIdle;
    }
    async function postJson(path, body, token) {
        var headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = "Bearer " + token;
        var res = await fetch(API_BASE + path, { method: "POST", headers: headers, body: JSON.stringify(body || {}) });
        var data = null;
        try { data = await res.json(); } catch (e) {}
        return { ok: res.ok, status: res.status, data: data || {} };
    }
    async function deleteJson(path, body, token) {
        var res = await fetch(API_BASE + path, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify(body || {}),
        });
        var data = null;
        try { data = await res.json(); } catch (e) {}
        return { ok: res.ok, status: res.status, data: data || {} };
    }
    function friendlyError(status, data) {
        if (status === 429) return "Too many attempts — please try again in a while.";
        if (status === 503) return "Something went wrong on our end — please try again shortly.";
        if (status === 401) return "Your session is no longer valid — please start again.";
        return (data && data.error) || "Something went wrong. Please try again.";
    }

    // STEP 1 -> send first OTP (login)
    document.getElementById("da-send-otp-1").addEventListener("click", async function () {
        var btn = this;
        var phone = cleanPhone(document.getElementById("da-phone").value);
        clearMsg("da-msg-phone");
        if (!/^[6-9]\d{9}$/.test(phone)) {
            msg("da-msg-phone", "error", "Please enter a valid 10-digit mobile number.");
            return;
        }
        state.phone = phone;
        setBusy(btn, true, "Sending OTP…", "Send OTP");
        var r = await postJson("/auth/send-otp", { phone: phone });
        setBusy(btn, false, "Sending OTP…", "Send OTP");
        if (!r.ok) {
            msg("da-msg-phone", "error", friendlyError(r.status, r.data));
            return;
        }
        document.getElementById("da-phone-display").textContent = "+91 " + phone;
        clearMsg("da-msg-verify");
        show("da-step-verify");
    });

    document.getElementById("da-back-1").addEventListener("click", function () {
        clearMsg("da-msg-phone");
        show("da-step-phone");
    });

    // STEP 2 -> verify first OTP (login), get token
    document.getElementById("da-verify-1").addEventListener("click", async function () {
        var btn = this;
        var code = (document.getElementById("da-otp-1").value || "").trim();
        clearMsg("da-msg-verify");
        if (code.length < 4) {
            msg("da-msg-verify", "error", "Please enter the code sent to your phone.");
            return;
        }
        setBusy(btn, true, "Verifying…", "Verify");
        var r = await postJson("/auth/verify-otp", { phone: state.phone, code: code });
        setBusy(btn, false, "Verifying…", "Verify");
        if (!r.ok || !r.data.token) {
            msg("da-msg-verify", "error", friendlyError(r.status, r.data));
            return;
        }
        state.token = r.data.token;
        document.getElementById("da-consent-checkbox").checked = false;
        document.getElementById("da-request-delete").disabled = true;
        clearMsg("da-msg-confirm");
        show("da-step-confirm");
    });

    document.getElementById("da-consent-checkbox").addEventListener("change", function () {
        document.getElementById("da-request-delete").disabled = !this.checked;
    });

    document.getElementById("da-cancel").addEventListener("click", function () {
        show("da-step-phone");
    });
    document.getElementById("da-cancel-2").addEventListener("click", function () {
        show("da-step-phone");
    });

    // STEP 3 -> send second OTP (reauth for deletion)
    document.getElementById("da-request-delete").addEventListener("click", async function () {
        var btn = this;
        clearMsg("da-msg-confirm");
        setBusy(btn, true, "Sending confirmation code…", "Yes, Delete My Account");
        var r = await postJson("/auth/send-otp", { phone: state.phone });
        setBusy(btn, false, "Sending confirmation code…", "Yes, Delete My Account");
        if (!r.ok) {
            msg("da-msg-confirm", "error", friendlyError(r.status, r.data));
            return;
        }
        document.getElementById("da-phone-display-2").textContent = "+91 " + state.phone;
        clearMsg("da-msg-reauth");
        show("da-step-reauth");
    });

    // STEP 4 -> confirm deletion with second OTP
    document.getElementById("da-finish-delete").addEventListener("click", async function () {
        var btn = this;
        var code = (document.getElementById("da-otp-2").value || "").trim();
        clearMsg("da-msg-reauth");
        if (code.length < 4) {
            msg("da-msg-reauth", "error", "Please enter the confirmation code.");
            return;
        }
        setBusy(btn, true, "Deleting…", "Confirm Deletion");
        var r = await deleteJson("/users/me", { code: code }, state.token);
        setBusy(btn, false, "Deleting…", "Confirm Deletion");
        if (!r.ok || !r.data.ok) {
            if (r.status === 401) {
                msg("da-msg-reauth", "error", "Already deleted or session expired.");
                show("da-step-done");
                return;
            }
            msg("da-msg-reauth", "error", friendlyError(r.status, r.data));
            return;
        }
        show("da-step-done");
    });
})();
</script>

<?php include 'includes/footer.php'; ?>
