export const NOTIFICATION_TEMPLATES = [
  // 1. Email Templates (6)
  {
    id: 'email-loan-disbursed',
    channel: 'Email',
    name: 'Loan disbursed',
    subject: 'Congratulations! Your Paisa in Minutes Loan #{LoanNo} is Disbursed',
    body: 'Dear {CustomerName},\n\nWe are pleased to inform you that your loan application #{LoanNo} for ₹{Principal} has been approved and successfully disbursed to your bank account.\n\nYour repayment schedule begins on {DueDate}. You can track and manage your loan anytime on our portal.\n\nThank you for choosing Paisa in Minutes.',
    tokens: ['{CustomerName}', '{LoanNo}', '{Principal}', '{DueDate}']
  },
  {
    id: 'email-reminder-1',
    channel: 'Email',
    name: 'Payment reminder - 1 day before due',
    subject: 'Reminder: Your EMI of ₹{Amount} is Due Tomorrow',
    body: 'Dear {CustomerName},\n\nThis is a gentle reminder that your EMI payment of ₹{Amount} for Loan #{LoanNo} is due tomorrow, {DueDate}.\n\nTo avoid late fees and maintain a healthy credit score, please pay using the link below:\n{PaymentLink}\n\nTeam Paisa in Minutes',
    tokens: ['{CustomerName}', '{Amount}', '{LoanNo}', '{DueDate}', '{PaymentLink}']
  },
  {
    id: 'email-reminder-3',
    channel: 'Email',
    name: 'Payment reminder - 3 days before due',
    subject: 'Upcoming EMI Due Notice: ₹{Amount} Due in 3 Days',
    body: 'Dear {CustomerName},\n\nYour loan EMI of ₹{Amount} (Loan #{LoanNo}) is scheduled for payment on {DueDate} (in 3 days).\n\nPlease ensure sufficient funds are available in your linked account or pay online via: {PaymentLink}\n\nWarm regards,\nPaisa in Minutes',
    tokens: ['{CustomerName}', '{Amount}', '{LoanNo}', '{DueDate}', '{PaymentLink}']
  },
  {
    id: 'email-reminder-5',
    channel: 'Email',
    name: 'Payment reminder - 5 days before due',
    subject: 'Advance Notice: Upcoming Loan EMI of ₹{Amount}',
    body: 'Dear {CustomerName},\n\nThis is an advance notice that your monthly installment of ₹{Amount} for Loan #{LoanNo} is due on {DueDate}.\n\nPay online conveniently via our secure payment gateway:\n{PaymentLink}',
    tokens: ['{CustomerName}', '{Amount}', '{LoanNo}', '{DueDate}', '{PaymentLink}']
  },
  {
    id: 'email-reminder-7',
    channel: 'Email',
    name: 'Payment reminder - 7 days before due',
    subject: 'Weekly Reminder: Loan EMI Payment Upcoming',
    body: 'Dear {CustomerName},\n\nYour EMI payment of ₹{Amount} for Loan #{LoanNo} is due in 7 days on {DueDate}.\n\nPlan ahead and ensure timely payment to build your CIBIL score.\nPayment Link: {PaymentLink}',
    tokens: ['{CustomerName}', '{Amount}', '{LoanNo}', '{DueDate}', '{PaymentLink}']
  },
  {
    id: 'email-reminder-today',
    channel: 'Email',
    name: 'Payment reminder - due today',
    subject: 'URGENT: Your Loan EMI of ₹{Amount} is Due Today',
    body: 'Dear {CustomerName},\n\nYour EMI installment of ₹{Amount} for Loan #{LoanNo} is DUE TODAY ({DueDate}).\n\nPlease complete your payment immediately to avoid late payment charges and negative credit reporting:\n{PaymentLink}\n\nPaisa in Minutes Collections Team',
    tokens: ['{CustomerName}', '{Amount}', '{LoanNo}', '{DueDate}', '{PaymentLink}']
  },

  // 2. SMS Templates (1)
  {
    id: 'sms-disbursal',
    channel: 'SMS',
    name: 'Disbursal confirmation',
    subject: 'SMS Disbursal Alert',
    body: 'Dear {CustomerName}, your loan of Rs.{Principal} (A/C #{LoanNo}) has been credited. 1st EMI due on {DueDate}. Repay via {PaymentLink} - Paisa in Minutes',
    tokens: ['{CustomerName}', '{Principal}', '{LoanNo}', '{DueDate}', '{PaymentLink}']
  },

  // 3. WhatsApp Templates (1)
  {
    id: 'whatsapp-reminder',
    channel: 'WhatsApp',
    name: 'Payment reminder',
    subject: 'WhatsApp Payment Reminder',
    body: 'Hello *{CustomerName}* 👋,\n\nYour loan EMI of *₹{Amount}* (Loan No: *{LoanNo}*) is due on *{DueDate}*.\n\n👉 *Pay Now:* {PaymentLink}\n\n_Prompt repayments help you unlock higher loan limits with lower interest rates!_\n\n- *Team Paisa in Minutes*',
    tokens: ['{CustomerName}', '{Amount}', '{LoanNo}', '{DueDate}', '{PaymentLink}']
  }
];
