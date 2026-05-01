export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <a href="/" className="text-sm text-slate-400 hover:text-white transition">
          &larr; Back to home
        </a>

        <h1 className="text-4xl font-bold mt-8 mb-2">Terms of Service</h1>
        <p className="text-slate-500 mb-12">Last updated: May 1, 2026</p>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using RemindFlow (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p>
              RemindFlow provides automated invoice follow-up and payment reminder services for freelancers and small businesses. The Service allows users to track invoices, schedule reminder emails, and monitor payment status.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Acceptable Use</h2>
            <p>
              You agree not to use the Service to send spam, harassing communications, or any content that violates applicable laws. You may only send reminders to clients with whom you have a legitimate business relationship.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Billing and Refunds</h2>
            <p>
              RemindFlow offers a 14-day free trial. After the trial, a subscription fee applies as stated on the pricing page. You may cancel at any time. Refunds are handled on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the Service at any time, without prior notice, for conduct that we believe violates these Terms or is harmful to other users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Limitation of Liability</h2>
            <p>
              RemindFlow is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that the Service will be uninterrupted or error-free. In no event shall RemindFlow be liable for any indirect, incidental, or consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Contact</h2>
            <p>
              For questions about these Terms, contact us at <a href="mailto:hello@remindflow.app" className="text-emerald-400 hover:text-emerald-300">hello@remindflow.app</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
