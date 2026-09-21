import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, Clock, Shield, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface ContactPageProps {
  onNavigate: (route: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'General Support',
    calculatorRelated: 'Crypto Profit Calculator',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} onNavigate={onNavigate} />

      {/* Header Banner */}
      <div className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Support Desk & Communication Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Contact Us
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          Have a suggestion for a new financial calculator, found an edge-case formula variation, or have an advertising inquiry? Our engineering and compliance team is here to help.
        </p>
      </div>

      {/* Top 3 Support Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              General & Math Support
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Inquiries regarding calculator logic, formula references, or feature requests.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-medium">
              support@fincalc.pro
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Advertising & Partnerships
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Explore direct sponsorship, banner placement, or API integration partnerships.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">
              partners@fincalc.pro
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Privacy & Legal Compliance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              GDPR/CCPA requests, data inquiries, copyright, and Terms & Conditions.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-medium">
              privacy@fincalc.pro
            </span>
          </div>
        </div>
      </div>

      {/* Main Form & Response SLA Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Message Successfully Submitted!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Thank you for contacting FinCalc Pro. Your inquiry has been routed to our <span className="font-semibold text-slate-700 dark:text-slate-300">{formData.department}</span> department. A ticket confirmation has been logged, and an engineer will reply to <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">{formData.email}</span> within 24–48 hours.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      department: 'General Support',
                      calculatorRelated: 'Crypto Profit Calculator',
                      message: '',
                    });
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                Send Us an Electronic Message
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Fill out the secure form below. We strictly protect your email and never share contact details.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Alex Morgan"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Inquiry Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="General Support">General Support & Feedback</option>
                    <option value="Formula Feedback">Report Formula / Calculation Discrepancy</option>
                    <option value="Feature Request">Request New Financial Calculator</option>
                    <option value="Advertising / Sponsorship">Advertising & Partnerships</option>
                    <option value="Privacy / Compliance">Privacy & Legal Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Relevant Tool (Optional)
                  </label>
                  <select
                    value={formData.calculatorRelated}
                    onChange={(e) => setFormData({ ...formData, calculatorRelated: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Crypto Profit Calculator">Crypto Profit Calculator</option>
                    <option value="DCA Calculator">Crypto DCA Calculator</option>
                    <option value="Crypto Staking APY">Staking APY Calculator</option>
                    <option value="Loan EMI Calculator">Loan EMI Calculator</option>
                    <option value="Compound Interest Calculator">Compound Interest Calculator</option>
                    <option value="SIP Wealth Calculator">SIP Calculator</option>
                    <option value="Mortgage PITI Calculator">Mortgage Calculator</option>
                    <option value="Other / General">Other / General Website Feature</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Detailed Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe your question, suggested calculation formula, or feedback in detail..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: FAQ & Response Expectations */}
        <div className="lg:col-span-5 space-y-5">
          {/* SLA Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Response Time Commitment</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We take accuracy and user feedback seriously. Our engineering desk monitors inquiries continuously:
            </p>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950">
                <span className="font-medium text-slate-700 dark:text-slate-300">Technical / Formula Bugs:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Within 24 Hours</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950">
                <span className="font-medium text-slate-700 dark:text-slate-300">General Questions:</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">24–48 Hours</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950">
                <span className="font-medium text-slate-700 dark:text-slate-300">Advertising & Media:</span>
                <span className="font-semibold text-slate-600 dark:text-slate-400">1–2 Business Days</span>
              </div>
            </div>
          </div>

          {/* Quick FAQ Self-Service */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <span>Looking for Quick Answers?</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Before submitting, you might find an instant answer to common calculation and privacy questions in our documentation:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('/faq')}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <span>Platform Frequently Asked Questions</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
              </button>
              <button
                onClick={() => onNavigate('/privacy-policy')}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <span>Privacy Policy & Client-Side Data Guarantee</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
              </button>
              <button
                onClick={() => onNavigate('/terms')}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <span>Terms of Use & Accuracy Disclaimers</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

