import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

logger = logging.getLogger(__name__)

def send_contact_notification(name: str, email: str, subject: str, message: str) -> bool:
    """
    Send email notification when someone submits the contact form
    """
    smtp_email = os.environ.get('SMTP_EMAIL')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    notification_email = os.environ.get('NOTIFICATION_EMAIL')
    
    if not all([smtp_email, smtp_password, notification_email]):
        logger.warning("Email configuration not complete, skipping email notification")
        return False
    
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"[lwr.ro] Mesaj nou: {subject}"
        msg['From'] = smtp_email
        msg['To'] = notification_email
        
        # Plain text version
        text_content = f"""
Ai primit un mesaj nou prin formularul de contact de pe lwr.ro

De la: {name}
Email: {email}
Subiect: {subject}

Mesaj:
{message}

---
Acest email a fost trimis automat de pe site-ul tău.
        """
        
        # HTML version
        html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: #1a1a1a; color: #fff; padding: 20px; border-radius: 8px 8px 0 0; }}
        .header h1 {{ margin: 0; color: #ef4444; }}
        .content {{ background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }}
        .field {{ margin-bottom: 15px; }}
        .label {{ font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }}
        .value {{ margin-top: 5px; padding: 10px; background: #fff; border-radius: 4px; }}
        .message-box {{ background: #fff; padding: 15px; border-left: 4px solid #ef4444; margin-top: 10px; }}
        .footer {{ text-align: center; padding: 15px; color: #999; font-size: 12px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📬 Mesaj nou</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.8;">prin formularul de contact lwr.ro</p>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">De la</div>
                <div class="value">{name}</div>
            </div>
            <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:{email}">{email}</a></div>
            </div>
            <div class="field">
                <div class="label">Subiect</div>
                <div class="value">{subject}</div>
            </div>
            <div class="field">
                <div class="label">Mesaj</div>
                <div class="message-box">{message.replace(chr(10), '<br>')}</div>
            </div>
        </div>
        <div class="footer">
            Răspunde direct la acest email pentru a contacta {name}
        </div>
    </div>
</body>
</html>
        """
        
        # Attach both versions
        msg.attach(MIMEText(text_content, 'plain'))
        msg.attach(MIMEText(html_content, 'html'))
        
        # Add Reply-To header so you can reply directly to the sender
        msg['Reply-To'] = email
        
        # Send via Gmail SMTP
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(smtp_email, smtp_password)
            server.sendmail(smtp_email, notification_email, msg.as_string())
        
        logger.info(f"Contact notification email sent successfully for message from {email}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send contact notification email: {str(e)}")
        return False
