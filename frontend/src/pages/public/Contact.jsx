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

      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Contact Content */}
            <div className="lg:w-1/3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Get in touch</h1>
                <p className="text-lg text-slate-600 mb-12 leading-relaxed">
                  Have questions about our verification protocol or integration? Our team is standing by to help you scale.
                </p>

                <div className="space-y-8">
                  {contactInfo.map((info, idx) => (
                    <div key={idx} className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                        <info.icon size={26} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{info.label}</div>
                        <a href={info.href} className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors">
                          {info.value}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-16 pt-12 border-t border-slate-100">
                  <div className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Connect with us</div>
                  <div className="flex gap-4">
                    {[X, Globe, MessageCircle].map((Icon, i) => (
                      <a key={i} href="#" className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-1 transition-all shadow-sm">
                        <Icon size={22} />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <div className="lg:w-2/3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 border border-slate-100"
              >
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        placeholder="John Doe"
                        required
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                        onChange={handleChange}
                      />
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

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 ml-1">I am a...</label>
                      <div className="relative">
                        <select
                          name="userType"
                          value={formData.userType}
                          required
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                          onChange={handleChange}
                        >
                          <option value="user">Individual User</option>
                          <option value="institution">Institution</option>
                          <option value="verifier">Verifier/Organization</option>
                          <option value="developer">Developer</option>
                        </select>
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                      </div>
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

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      rows="5"
                      placeholder="How can we help you today?"
                      required
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all resize-none"
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full md:w-auto px-12 py-5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 text-lg"
                  >
                    Send Message <Send size={20} />
                  </motion.button>
                </form>
              </motion.div>
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
