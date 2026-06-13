import { useState } from 'react';
import './FAQ.css';

const FAQS = [
  {
    category: 'Orders & Shipping',
    items: [
      { q: 'How long does delivery take?', a: 'Orders are typically delivered within 5–7 business days across India. We ship via trusted courier partners and provide tracking details once your order is dispatched.' },
      { q: 'Do you ship internationally?', a: 'Currently we ship within India only. International shipping is coming soon — sign up for our newsletter to be notified.' },
      { q: 'How are paintings packaged?', a: 'Every painting is wrapped in bubble wrap, placed in a sturdy box with foam padding, and sealed securely to prevent damage during transit.' },
      { q: 'Can I track my order?', a: 'Yes! Once your order is dispatched, you\'ll receive a tracking link via email and SMS. You can also track your order in the Orders section of your account.' },
    ],
  },
  {
    category: 'Products',
    items: [
      { q: 'Are all paintings originals?', a: 'Yes. Every painting on Sabhaya is an original, handcrafted canvas painting. We do not sell prints or reproductions.' },
      { q: 'What materials are used?', a: 'We use high-quality acrylic or oil paints on premium stretched canvas. All materials are non-toxic and sourced responsibly.' },
      { q: 'Can I request a custom painting?', a: 'Absolutely! Contact us at hello@sabhayapaintings.com with your idea, size preference, and colour palette. We\'ll get back to you with a quote and timeline.' },
      { q: 'What sizes are available?', a: 'Paintings are available in various sizes from small (6×6 inches) to large (36×48 inches). Each product page lists the exact dimensions.' },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      { q: 'What is your return policy?', a: 'We accept returns within 7 days of delivery if the painting arrives damaged. Please photograph the damage and email us within 48 hours of receiving your order.' },
      { q: 'What if my painting arrives damaged?', a: 'Please email hello@sabhayapaintings.com with photos of the damage. We\'ll arrange a replacement or full refund promptly.' },
      { q: 'Can I return a painting if I change my mind?', a: 'Since each painting is an original artwork, we are unable to accept returns due to a change of mind. Please review the product images and dimensions carefully before ordering.' },
    ],
  },
  {
    category: 'Payments',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI, net banking, and wallets via Razorpay — India\'s trusted payment gateway.' },
      { q: 'Is my payment information secure?', a: 'Yes. All payments are processed through Razorpay with 256-bit SSL encryption. We never store your card details.' },
      { q: 'Can I pay on delivery?', a: 'Currently we do not offer cash on delivery. All orders must be paid online at checkout.' },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? ' faq-item--open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span className="faq-icon">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="faq-answer">{a}</div>}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="faq-page">
      <div className="faq-header">
        <span className="faq-eyebrow">Help Centre</span>
        <h1>Frequently asked questions</h1>
        <p>Can't find what you're looking for? <a href="/contact">Contact us</a> and we'll help.</p>
      </div>

      <div className="faq-body">
        {FAQS.map((section) => (
          <div key={section.category} className="faq-section">
            <h2 className="faq-category">{section.category}</h2>
            <div className="faq-list">
              {section.items.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}