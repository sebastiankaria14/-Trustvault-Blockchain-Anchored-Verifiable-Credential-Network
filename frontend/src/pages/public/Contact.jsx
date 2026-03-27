import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, X, Globe, ChevronDown } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userType: 'user',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for reaching out! We will get back to you soon.');
    setFormData({ name: '', email: '', userType: 'user', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'support@trustvault.com', href: 'mailto:support@trustvault.com' },
    { icon: Phone, label: 'Phone', value: '+1 (555) 000-0000', href: 'tel:+15550000000' },
    { icon: MapPin, label: 'Office', value: 'San Francisco, CA', href: '#' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-slate-200">
            Have questions? We're here to help!
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    I am a *
                  </label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent"
                  >
                    <option value="user">Individual User</option>
                    <option value="institution">Institution</option>
                    <option value="verifier">Verifier/Organization</option>
                    <option value="developer">Developer</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent resize-none"
                    placeholder="Tell us more about your question or inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <div className="bg-white p-8 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-900/10 p-3 rounded-lg">
                      <div className="text-2xl text-primary-900">📧</div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-600">support@trustvault.com</p>
                      <p className="text-gray-600">sales@trustvault.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-900/10 p-3 rounded-lg">
                      <div className="text-2xl text-primary-900">📞</div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="john@example.com"
                        required
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-900/10 p-3 rounded-lg">
                      <div className="text-2xl text-primary-900">📍</div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 ml-1">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        placeholder="Inquiry about API"
                        required
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-900/10 p-3 rounded-lg">
                      <div className="text-2xl text-primary-900">💬</div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Live Chat</h3>
                      <p className="text-gray-600">Available 24/7</p>
                      <button className="text-primary-900 hover:text-primary-800 font-semibold text-sm mt-1">
                        Start Chat →
                      </button>
                    </div>
                  </div>

              {/* Response Time */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg">
                <h3 className="font-semibold mb-2 text-primary-900">Response Time</h3>
                <p className="text-sm text-gray-700">
                  We typically respond within 24 hours during business days. For urgent issues, please call us directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4 italic tracking-tight uppercase">Knowledge Base</h2>
            <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="space-y-6">
            {[
              {
                q: "How secure is TrustVault?",
                a: "TrustVault uses end-to-end encryption, blockchain verification, and industry-standard security practices. All credential hashes are stored on blockchain, making them immutable and tamper-proof."
              },
              {
                q: "How much does it cost?",
                a: "For individual users, TrustVault is free. Institutions pay per credential issued. Verifiers pay based on API usage. Volume discounts available."
              },
              {
                q: "What types of credentials can be verified?",
                a: "Education (degrees, diplomas), Employment (salary, experience), Financial (bank statements), Medical (vaccination records), and more."
              },
              {
                q: "How fast is verification?",
                a: "Our API responds in under 2 seconds. Most verifications complete in 1-1.5 seconds including blockchain verification."
              },
              {
                q: "Is this GDPR compliant?",
                a: "Yes! TrustVault is fully GDPR compliant. Users have complete control over their data and can revoke consent anytime."
              }
            ].map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-slate-50 border border-slate-100 rounded-[2rem] p-8 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-default"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">0{i+1}</span>
                  {faq.q}
                </h3>
                <p className="text-slate-600 leading-relaxed ml-11">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
