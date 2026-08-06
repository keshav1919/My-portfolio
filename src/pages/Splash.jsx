import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { profile } from '../data/profile';

export default function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/home', { replace: true });
    }, 2800);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="splash">
      <SEO title="Welcome" description="Keshav frontend developer portfolio loading screen." path="/" />
      <div className="splash__aurora splash__aurora--one" />
      <div className="splash__aurora splash__aurora--two" />
      <section className="splash__workspace" aria-label="Keshav portfolio is loading">
        <div className="splash__windowbar" aria-hidden="true">
          <span /><span /><span />
          <code>portfolio.init.jsx</code>
        </div>
        <div className="splash__grid">
          <div className="splash__code" aria-hidden="true">
            <span><i>01</i><b>const</b> developer = &#123;</span>
            <span><i>02</i>&nbsp;&nbsp;name: <em>'Keshav'</em>,</span>
            <span><i>03</i>&nbsp;&nbsp;craft: <em>'Frontend experiences'</em>,</span>
            <span><i>04</i>&nbsp;&nbsp;status: <em>'ready to build'</em></span>
            <span><i>05</i>&#125;;</span>
            <span className="splash__cursor"><i>06</i>launchPortfolio();</span>
          </div>
          <div className="splash__identity">
            <div className="splash__logo-shell">
              <span className="splash__scan" aria-hidden="true" />
              <img src={profile.brandLogo} alt="Keshav Coder logo" />
            </div>
            <span className="splash__eyebrow">Frontend developer</span>
            <h1>Keshav<span>.</span></h1>
            <p>Designing clean interfaces. Building smooth experiences.</p>
          </div>
        </div>
        <div className="splash__status" role="status">
          <span><b aria-hidden="true">›</b> Compiling ideas into experiences</span>
          <strong>100%</strong>
        </div>
        <div className="splash__progress" aria-hidden="true"><span /></div>
      </section>
      <div className="splash__tech splash__tech--html" aria-hidden="true">HTML</div>
      <div className="splash__tech splash__tech--react" aria-hidden="true">REACT</div>
      <div className="splash__tech splash__tech--js" aria-hidden="true">JS</div>
    </main>
  );
}
