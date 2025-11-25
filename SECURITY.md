# Security Policy

## 🔒 Security & Privacy

This project takes security seriously. This document outlines our security practices and how to report vulnerabilities.

## 🚨 Important Security Notes

### DO NOT Commit Sensitive Data

**NEVER commit these files to git:**
- `.env` files (backend/.env, frontend/.env)
- `app.db` (SQLite database with user data)
- API keys or secrets
- Credentials or tokens
- Private keys or certificates

### Environment Variables

All sensitive configuration is stored in `.env` files which are:
- ✅ Listed in `.gitignore`
- ✅ Never committed to repository
- ✅ Loaded at runtime only
- ✅ Different for development vs production

### What's Safe in the Repository

✅ **Safe to commit:**
- Source code (without hardcoded secrets)
- Configuration templates (with placeholder values)
- Documentation
- Package manifests (package.json, requirements.txt)
- Deployment configs (render.yaml, vercel.json)

❌ **NEVER commit:**
- `.env` files
- `app.db` database files
- Any file containing actual API keys
- User data or credentials

## 🛡️ Security Measures Implemented

### Authentication & Authorization
- ✅ JWT-based authentication with secure token signing
- ✅ Password hashing using bcrypt with salt
- ✅ Token expiration (8 hours)
- ✅ Session validation on every request
- ✅ Automatic logout on token expiration

### Data Protection
- ✅ Passwords never stored in plaintext
- ✅ SQL injection protection (parameterized queries)
- ✅ Input validation with Pydantic models
- ✅ CORS configuration to restrict origins
- ✅ HTTPS enforced in production (Render/Vercel)

### API Security
- ✅ Environment variables for all secrets
- ✅ No secrets exposed in logs
- ✅ Rate limiting ready (can add slowapi)
- ✅ Error messages don't expose internals
- ✅ Health check endpoint for monitoring

### Code Security
- ✅ Dependencies regularly updated
- ✅ No console.log statements exposing data
- ✅ Proper error handling throughout
- ✅ Type validation on all inputs

## 🔑 Managing Secrets

### For Development

1. **Backend Secrets** (`backend/.env`):
```bash
SECRET_KEY=generate-strong-random-key
GEMINI_API_KEY=your-gemini-api-key
CORS_ORIGINS=http://localhost:3000
```

2. **Frontend Config** (`frontend/.env`):
```bash
REACT_APP_BACKEND_URL=http://localhost:8000
```

### For Production

1. **Render (Backend):**
   - Set environment variables in Render dashboard
   - Never commit production keys to git
   - Use strong, unique SECRET_KEY

2. **Vercel (Frontend):**
   - Set environment variables in Vercel dashboard
   - Use production backend URL

### Generating Secure Keys

```bash
# Generate strong SECRET_KEY
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Example output: PPNXYru8jXBj2_GPqi1Nrf9pL_milNg9aU3bapV0lQk
```

## 🔍 Security Checklist

Before deploying or committing code:

- [ ] No `.env` files in git history
- [ ] No API keys in code or logs
- [ ] Strong SECRET_KEY in production
- [ ] CORS_ORIGINS restricted (not `*`)
- [ ] HTTPS enabled in production
- [ ] Database file not committed
- [ ] All dependencies updated
- [ ] Input validation on all endpoints
- [ ] Error messages don't expose internals
- [ ] Passwords properly hashed
- [ ] JWT tokens have expiration

## 🚨 Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email the maintainer directly
3. Provide detailed information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## 📝 Security Best Practices

### For Developers

1. **Never hardcode secrets**
   ```python
   # ❌ BAD
   API_KEY = "AIzaSyAbc123..."
   
   # ✅ GOOD
   API_KEY = os.environ.get('API_KEY')
   ```

2. **Use environment variables**
   ```bash
   # Always use .env files
   # Never commit them to git
   ```

3. **Validate all inputs**
   ```python
   # Use Pydantic models for validation
   class UserInput(BaseModel):
       email: EmailStr
       password: str
   ```

4. **Hash passwords properly**
   ```python
   # Use bcrypt, never plaintext
   hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
   ```

5. **Check .gitignore**
   ```bash
   # Verify sensitive files are ignored
   git check-ignore backend/.env
   ```

### For Users

1. **Keep dependencies updated**
   ```bash
   pip install --upgrade -r requirements.txt
   npm update
   ```

2. **Use strong passwords**
   - Minimum 8 characters
   - Mix of letters, numbers, symbols

3. **Protect your API keys**
   - Never share your Gemini API key
   - Rotate keys if exposed
   - Use API key restrictions in Google Cloud Console

4. **Monitor usage**
   - Check Render logs for unusual activity
   - Monitor Gemini API usage quotas

## 🔄 Incident Response

If a security incident occurs:

1. **Immediate Actions:**
   - Revoke compromised API keys
   - Generate new SECRET_KEY
   - Force logout all users
   - Review logs for unauthorized access

2. **Investigation:**
   - Identify scope of breach
   - Determine what data was accessed
   - Document timeline of events

3. **Remediation:**
   - Fix vulnerability
   - Update security measures
   - Notify affected users (if applicable)
   - Deploy patches immediately

4. **Prevention:**
   - Update security practices
   - Add monitoring/alerts
   - Document lessons learned

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Google Cloud Security](https://cloud.google.com/security/best-practices)

## 📅 Last Updated

November 26, 2025

---

**Remember: Security is everyone's responsibility. When in doubt, ask!**
