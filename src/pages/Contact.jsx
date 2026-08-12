import { ArrowUpRight, Copy, Github, Mail, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { AppButton } from '../components/common/AppButton';
import { PageContainer } from '../components/common/PageContainer';
import { SectionTitle } from '../components/common/SectionTitle';
import { SEO } from '../components/common/SEO';
import { useToast } from '../context/ToastContext';
import { profile } from '../data/profile';
import { copyText } from '../utils/clipboard';

const WEB3FORMS_ACCESS_KEY = '30c3f71f-9b1e-4d41-94f7-6d742ca77bd6';

export default function Contact() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', age: '', experience: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    if (status !== 'sending') setStatus('idle');
  };
  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Please enter your name.';
    if (!/^\d{1,3}$/.test(form.age) || Number(form.age) < 1 || Number(form.age) > 120) nextErrors.age = 'Please enter a valid age.';
    if (!form.experience.trim()) nextErrors.experience = 'Please share your experience level.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Please enter a valid email address.';
    if (!form.message.trim()) nextErrors.message = 'Please tell me a little about your project.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus('sending');
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New portfolio contact from ${form.name.trim()}`,
          from_name: 'Keshav Portfolio',
          name: form.name.trim(),
          age: form.age,
          experience: form.experience.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          botcheck: ''
        })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Unable to send your message.');
      setForm({ name: '', age: '', experience: '', email: '', message: '' });
      setStatus('success');
      showToast('Message sent successfully.', 'success');
    } catch {
      setStatus('error');
      showToast('Message could not be sent. Please try again.', 'error');
    }
  };

  const copyEmail = async () => {
    try { await copyText(profile.email); showToast('Email copied successfully.', 'success'); }
    catch { showToast('Copy is unavailable in this browser.', 'error'); }
  };

  return (
    <PageContainer className="inner-page contact-page">
      <SEO title="Contact" description="Start a frontend project conversation with Keshav." path="/contact" />
      <header className="page-hero"><SectionTitle eyebrow="Contact" title="Have a project in mind? Let's make it real." description="Share your details and project idea. The form sends your message directly and securely to my inbox." /></header>
      <section className="contact-layout">
        <div className="contact-intro"><span className="eyebrow">Start a conversation</span><h2>Let&apos;s build something great together.</h2><p>I&apos;m available for frontend opportunities and projects focused on responsive, user-friendly web experiences.</p><div className="contact-links"><a href={`mailto:${profile.email}`}><span><Mail /> Email</span><strong>{profile.email}</strong><ArrowUpRight /></a><a href={profile.github} target="_blank" rel="noopener noreferrer"><span><Github /> GitHub</span><strong>github.com/keshav1919</strong><ArrowUpRight /></a><div><span><MapPin /> Location</span><strong>{profile.location}</strong></div></div><button className="copy-link" onClick={copyEmail}><Copy /> Copy email address</button></div>
        <form className="contact-form" onSubmit={submit} noValidate>
          <div className="form-row"><label>Name<input name="name" value={form.name} onChange={update} placeholder="Your name" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />{errors.name && <span id="name-error" className="form-error">{errors.name}</span>}</label><label>Contact email<input type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />{errors.email && <span id="email-error" className="form-error">{errors.email}</span>}</label></div>
          <div className="form-row"><label>Age<input type="number" min="1" max="120" name="age" value={form.age} onChange={update} placeholder="Your age" inputMode="numeric" aria-invalid={Boolean(errors.age)} aria-describedby={errors.age ? 'age-error' : undefined} />{errors.age && <span id="age-error" className="form-error">{errors.age}</span>}</label><label>Experience<input name="experience" value={form.experience} onChange={update} placeholder="e.g. Founder, student, developer" aria-invalid={Boolean(errors.experience)} aria-describedby={errors.experience ? 'experience-error' : undefined} />{errors.experience && <span id="experience-error" className="form-error">{errors.experience}</span>}</label></div>
          <label>Project details<textarea name="message" value={form.message} onChange={update} rows="7" placeholder="Tell me about the project, goals and timeline..." aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} />{errors.message && <span id="message-error" className="form-error">{errors.message}</span>}</label>
          <AppButton type="submit" icon={Send} className="form-submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending...' : 'Send message'} <ArrowUpRight /></AppButton>
          <small role="status" aria-live="polite">{status === 'success' ? 'Thanks — your message has been sent.' : status === 'error' ? 'Something went wrong. Please try again or email me directly.' : 'Your details are sent through Web3Forms and used only to reply to your inquiry.'}</small>
        </form>
      </section>
    </PageContainer>
  );
}
