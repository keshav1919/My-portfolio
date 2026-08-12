import { ArrowUpRight, Copy, Github, Mail, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { AppButton } from '../components/common/AppButton';
import { PageContainer } from '../components/common/PageContainer';
import { SectionTitle } from '../components/common/SectionTitle';
import { SEO } from '../components/common/SEO';
import { useToast } from '../context/ToastContext';
import { profile } from '../data/profile';
import { copyText } from '../utils/clipboard';

export default function Contact() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Please enter a valid email address.';
    if (!form.message.trim()) nextErrors.message = 'Please tell me a little about your project.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const subject = encodeURIComponent(form.subject.trim() || `Project inquiry from ${form.name}`);
    const body = encodeURIComponent(`Hi Keshav,\n\n${form.message}\n\nFrom: ${form.name}\nEmail: ${form.email}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    showToast('Opening your email app.', 'success');
  };

  const copyEmail = async () => {
    try { await copyText(profile.email); showToast('Email copied successfully.', 'success'); }
    catch { showToast('Copy is unavailable in this browser.', 'error'); }
  };

  return (
    <PageContainer className="inner-page contact-page">
      <SEO title="Contact" description="Start a frontend project conversation with Keshav." path="/contact" />
      <header className="page-hero"><SectionTitle eyebrow="Contact" title="Have a project in mind? Let's make it real." description="Tell me about the website or interface you want to build. Your message will open in your email app, ready to send." /></header>
      <section className="contact-layout">
        <div className="contact-intro"><span className="eyebrow">Start a conversation</span><h2>Let&apos;s build something great together.</h2><p>I&apos;m available for frontend opportunities and projects focused on responsive, user-friendly web experiences.</p><div className="contact-links"><a href={`mailto:${profile.email}`}><span><Mail /> Email</span><strong>{profile.email}</strong><ArrowUpRight /></a><a href={profile.github} target="_blank" rel="noopener noreferrer"><span><Github /> GitHub</span><strong>github.com/keshav1919</strong><ArrowUpRight /></a><div><span><MapPin /> Location</span><strong>{profile.location}</strong></div></div><button className="copy-link" onClick={copyEmail}><Copy /> Copy email address</button></div>
        <form className="contact-form" onSubmit={submit} noValidate>
          <div className="form-row"><label>Name<input name="name" value={form.name} onChange={update} placeholder="Your name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />{errors.name && <span id="name-error" className="form-error">{errors.name}</span>}</label><label>Email<input type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />{errors.email && <span id="email-error" className="form-error">{errors.email}</span>}</label></div>
          <label>Subject <span>(optional)</span><input name="subject" value={form.subject} onChange={update} placeholder="Website project" /></label>
          <label>Project details<textarea name="message" value={form.message} onChange={update} rows="7" placeholder="Tell me about the project, goals and timeline..." aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} />{errors.message && <span id="message-error" className="form-error">{errors.message}</span>}</label>
          <AppButton type="submit" icon={Send} className="form-submit">Prepare email <ArrowUpRight /></AppButton><small>Your details are not stored or sent to a server.</small>
        </form>
      </section>
    </PageContainer>
  );
}
