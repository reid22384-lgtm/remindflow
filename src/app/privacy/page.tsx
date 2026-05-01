export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <a href="/" className="text-sm text-slate-400 hover:text-white transition">
          &larr; Back to home
        </a>

        <h1 className="text-4xl font-bold mt-8 mb-2">Privacy Policy</h1>
        <p className="text-slate-500 mb-12">Last updated: May 1, 2026</p>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly, including your email address, client names, client email addresses, and invoice details. We also collect usage data such as login times and feature usage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p>
              We use your information to provide and improve the Service, send automated reminder emails on your behalf, communicate with you about your account, and process payments.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share data with service providers (email delivery, payment processing) as necessary to operate the Service. We may also disclose information if required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. Upon cancellation, you may request deletion of your data. We may retain certain information as required by law or for legitimate business purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal data. You may also export your data at any time from your account settings. To exercise these rights, contact us at <a href="mailto:hello@remindflow.app" className="text-emerald-400 hover:text-emerald-300">hello@remindflow.app</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Cookies</h2>
            <p>
              We use essential cookies for authentication and session management. We do not use tracking cookies or third-party analytics without your consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Children&apos;s Privacy</h2>
            <p>
              The Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Contact</h2>
            <p>
              For questions about this Privacy Policy, contact us at <a href="mailto:hello@remindflow.app" className="text-emerald-400 hover:text-emerald-300">hello@remindflow.app</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
