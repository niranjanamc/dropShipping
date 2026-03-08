// TrendDrop – contact.js

/* ─── Contact form ─── */
const contactForm   = document.getElementById('contact-form');
const formSuccess   = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactForm.style.display = 'none';
    formSuccess.classList.remove('hidden');
    // Reset after 5 seconds for demo
    setTimeout(() => {
      contactForm.reset();
      contactForm.style.display = '';
      formSuccess.classList.add('hidden');
    }, 5000);
  });
}

/* ─── FAQ accordion ─── */
const faqs = [
  { q: 'How long does shipping take?',          a: 'Standard shipping takes 5–10 business days. Expedited shipping (2–3 days) is available at checkout for an additional fee.' },
  { q: 'What is your return policy?',           a: 'We offer a 30-day hassle-free return policy. Items must be in their original condition. Simply contact our support team to initiate a return.' },
  { q: 'Are the products authentic?',           a: 'Yes! All products are sourced directly from vetted manufacturers and suppliers. We guarantee authenticity on every item.' },
  { q: 'Do you ship internationally?',          a: 'We currently ship to 30+ countries. Shipping rates and delivery times vary by destination. See checkout for your location\'s details.' },
  { q: 'How can I track my order?',             a: 'Once your order ships, you\'ll receive a tracking number via email. You can use this to monitor your package in real-time.' },
  { q: 'Can I change or cancel my order?',      a: 'Orders can be modified or cancelled within 2 hours of placement. After that, we begin processing and cannot guarantee changes.' },
];

const faqContainer = document.getElementById('faq');
if (faqContainer) {
  faqContainer.innerHTML = faqs.map((item, i) => `
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button class="faq-btn w-full text-left px-6 py-4 font-semibold text-gray-800 flex items-center justify-between hover:bg-gray-50 transition" data-index="${i}">
        <span>${item.q}</span>
        <svg class="faq-icon w-5 h-5 text-gray-400 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div class="faq-answer px-6 text-gray-600 text-sm">
        <div class="pb-4">${item.a}</div>
      </div>
    </div>
  `).join('');

  faqContainer.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const icon   = btn.querySelector('.faq-icon');
      const isOpen = answer.classList.contains('open');
      // Close all
      faqContainer.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
      faqContainer.querySelectorAll('.faq-icon').forEach(ic => ic.style.transform = '');
      // Open clicked
      if (!isOpen) {
        answer.classList.add('open');
        icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}
