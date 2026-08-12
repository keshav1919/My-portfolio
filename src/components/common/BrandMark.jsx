import { profile } from '../../data/profile';

export function BrandMark({ showName = true, className = '' }) {
  return (
    <span className={`brand-mark ${className}`.trim()}>
      <img src={profile.brandLogo} alt="" width="44" height="44" aria-hidden="true" />
      {showName && <span className="brand-mark__name">KESHAV<i>.</i></span>}
    </span>
  );
}
