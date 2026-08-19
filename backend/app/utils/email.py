def send_welcome_email(email_to: str, username: str) -> None:
    """
    Mock utility for sending a welcome email.
    """
    print(f"\n📧 [MOCK EMAIL SYSTEM]")
    print(f"To: {email_to}")
    print(f"Subject: Welcome to the Quiz Platform, {username}!")
    print(f"Body: We're thrilled to have you here. Start earning XP today!\n")

def send_password_reset_email(email_to: str, reset_token: str) -> None:
    """
    Mock utility for sending a password reset token.
    """
    print(f"\n📧 [MOCK EMAIL SYSTEM]")
    print(f"To: {email_to}")
    print(f"Subject: Password Reset Request")
    print(f"Body: Your password reset token is: {reset_token}\n")