<?php
// HTTP 410 Gone: Unsupported loan category permanently retired from Paisa in Minutes
http_response_code(410);
header('HTTP/1.1 410 Gone');
header('Status: 410 Gone');
header('X-Robots-Tag: noindex, nofollow, noarchive', true);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>410 Gone - Page Permanently Retired | Paisa in Minutes</title>
    <meta name="robots" content="noindex, nofollow">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background-color: #f8fafc; color: #1e293b; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
        .card { max-width: 520px; width: 100%; background: #ffffff; padding: 40px 32px; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08); text-align: center; }
        .badge { display: inline-block; padding: 4px 12px; background: #fee2e2; color: #b91c1c; font-weight: 700; font-size: 0.85rem; border-radius: 9999px; margin-bottom: 16px; letter-spacing: 0.05em; }
        h1 { font-size: 1.75rem; font-weight: 800; margin: 0 0 12px; color: #0f172a; }
        p { font-size: 0.975rem; color: #64748b; line-height: 1.6; margin: 0 0 24px; }
        .actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .btn { display: inline-block; padding: 10px 22px; border-radius: 8px; font-weight: 600; font-size: 0.95rem; text-decoration: none; transition: all 0.2s; }
        .btn-primary { background: #00D09C; color: #064e3b; }
        .btn-secondary { background: #1B2A6B; color: #ffffff; }
    </style>
</head>
<body>
    <div class="card">
        <span class="badge">HTTP 410 GONE</span>
        <h1>Content Permanently Retired</h1>
        <p>This loan category has been permanently discontinued on Paisa in Minutes. We specialize exclusively in digital Personal Loans up to ₹1,00,000.</p>
        <div class="actions">
            <a href="/" class="btn btn-primary">Go to Homepage</a>
            <a href="/personal-loan" class="btn btn-secondary">Explore Personal Loans</a>
        </div>
    </div>
</body>
</html>
