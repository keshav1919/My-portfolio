import { Link } from 'react-router-dom';

export function AppButton({ to, href, children, variant = 'primary', icon: Icon, disabled = false, className = '', ...props }) {
  const content = <>{Icon && <Icon size={18} aria-hidden="true" />}{children}</>;
  const classes = `button button--${variant} ${className}`.trim();
  if (to && !disabled) return <Link to={to} className={classes} {...props}>{content}</Link>;
  if (href && !disabled) {
    const external = /^https?:\/\//.test(href);
    return <a href={href} className={classes} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props}>{content}</a>;
  }
  return <button type="button" className={classes} disabled={disabled} {...props}>{content}</button>;
}
