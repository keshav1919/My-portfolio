import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/common/SEO';

export default function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = window.setTimeout(() => navigate('/home', { replace: true }), 1500);
    return () => window.clearTimeout(timer);
  }, [navigate]);
  return <main className="splash"><SEO title="Welcome" description="Keshav frontend developer portfolio." path="/" /><div className="splash__mark"><span>KESHAV</span><i>.</i></div><p>Frontend developer</p><div className="splash__line"><span /></div><small>Crafting the experience</small></main>;
}
