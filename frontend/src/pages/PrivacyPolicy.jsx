import './Legal.css';

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <span className="legal-eyebrow">Legal</span>
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: January 2025</p>
      </div>
      <div className="legal-body">
        <section>
          <h2>1. Information we collect</h2>
          <p>When you create an account or place an order on Sabhaya Paintings, we collect information you provide directly — including your name, email address, phone number, and delivery address. We also collect payment information processed securely through Razorpay; we do not store card details on our servers.</p>
        </section>
        <section>
          <h2>2. How we use your information</h2>
          <p>We use your information to process and fulfil your orders, communicate order updates, respond to enquiries, and improve our services. We do not sell or share your personal information with third parties for marketing purposes.</p>
        </section>
        <section>
          <h2>3. Cookies</h2>
          <p>We use cookies and similar tracking technologies to maintain your session, remember your cart and wishlist, and analyse site usage. You can disable cookies in your browser settings, but some features may not function correctly.</p>
        </section>
        <section>
          <h2>4. Data security</h2>
          <p>We implement industry-standard security measures including SSL encryption for all data transmissions. Your password is hashed and never stored in plain text. All payment transactions are handled by Razorpay's PCI-DSS compliant infrastructure.</p>
        </section>
        <section>
          <h2>5. Data retention</h2>
          <p>We retain your personal data for as long as your account is active or as required by law. You may request deletion of your account and associated data by emailing us at hello@sabhayapaintings.com.</p>
        </section>
        <section>
          <h2>6. Your rights</h2>
          <p>You have the right to access, correct, or delete your personal information. You may also opt out of marketing emails at any time by clicking the unsubscribe link in any email we send. To exercise your rights, contact us at hello@sabhayapaintings.com.</p>
        </section>
        <section>
          <h2>7. Third-party services</h2>
          <p>We use the following third-party services that may have access to your data: Razorpay (payments), courier partners (order delivery), and Firebase (authentication). Each has its own privacy policy governing data use.</p>
        </section>
        <section>
          <h2>8. Changes to this policy</h2>
          <p>We may update this privacy policy from time to time. Changes will be posted on this page with an updated date. Continued use of our site after changes constitutes acceptance of the updated policy.</p>
        </section>
        <section>
          <h2>9. Contact</h2>
          <p>For any privacy-related questions, contact us at <a href="mailto:hello@sabhayapaintings.com">hello@sabhayapaintings.com</a>.</p>
        </section>
      </div>
    </div>
  );
}