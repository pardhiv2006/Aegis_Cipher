# Aegis ABE: Advanced Attribute-Based Encryption Ecosystem

A premium, full-stack cybersecurity platform demonstrating the power of **Attribute-Based Encryption (ABE)** and **AI-Driven Security Analysis**. This project provides a high-fidelity administrative interface for managing sensitive document clusters with granular, policy-based access control.

**🌐 Live Demo Website:** [aegis-cipher-pardhu.vercel.app](https://aegis-cipher-pardhu.vercel.app/)

## 🚀 Key Features
- **Master Identity Matrix**: Secure registration and authentication with complex attribute bindings (Role + Department).
- **Simulated ABE Core**: Advanced cryptographic logic simulating real-world Attribute-Based Encryption for data fragments.
- **AEGIS Security AI**: Integrated LLM interpretation (Groq/Gemini) that transforms raw document metrics into sophisticated **narrative reports**, providing instant, human-readable analysis.
- **Encrypted PDF Exports**: Dynamic PDF generation engine that embeds identity signatures and AI summaries directly into secure exports.
- **Real-Time Audit Stream**: Comprehensive logging of every decryption attempt, providing a live feed of granted vs. restricted access.
- **Premium Cinematic UI**: A futuristic, glassmorphism-based interface built with React, Tailwind CSS, and Framer Motion.

## 🛠 Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: Python 3.10+, Flask, Flask-SQLAlchemy (SQLite), Flask-Bcrypt, PyJWT.
- **AI Engine**: Groq Llama-3 & Google Gemini-1.5 API integration.
- **Document Engine**: ReportLab for high-fidelity secure PDF generation.

## 📁 Project Architecture
- `/backend`: Flask API server, ABE logic, and database models.
- `/frontend`: React application featuring the main security dashboard and administrative console.
- `/instance`: Persistent SQLite database storage.

## ⚡ Quick Start

First time setup:

1. Clone repository

2. Install dependencies:

Frontend:
```bash
npm install
```

Backend:
```bash
pip install -r requirements.txt
```

3. Copy environment templates:

* `frontend/.env.example` → `frontend/.env`
* `backend/.env.example` → `backend/.env`

4. Start:

```bash
npm run dev
```

## 🔄 Security Workflow
1. **Identity Ingestion**: Register a new account with a specific **Role** (e.g., Faculty, HOD) and **Department** (e.g., CSE, AI).
2. **Policy Enforcement**: Upon login, the ABE engine calculates your decryption matrix based on your active attributes.
3. **Resource Access**: Navigate to the **ABE Vault**. Attempting to view a file triggers a backend ABE verification cycle.
4. **AI Interpretation**: Authorized users can invoke the **AEGIS AI** to generate a contextual summary of the decrypted content.
5. **Secure Export**: Download a **Secure PDF** which dynamically embeds your identity context and the AI summary into a professional report.
6. **Administrative Audit**: Administrators can monitor all sessions and policy hits via the **Identity Audit Stream**.

## 🛡 Security Note
This system uses a **simulated ABE logic** designed for demonstration and educational purposes. While the authentication and API flows are production-grade, the cryptographic layer implements logical attribute-matching to model real ABE behavior.
