import { MapPin } from 'lucide-react';
import { profile } from '../../data/profile';
import { SocialLinks } from './SocialLinks';

export function ProfileHeader({ compact = false }) {
  return (
    <div className={`profile-header ${compact ? 'profile-header--compact' : ''}`}>
      <img src={profile.profileImage} alt="Keshav, frontend web developer" width="220" height="220" decoding="async" onError={(e) => { e.currentTarget.hidden = true; }} />
      <div>
        <span className="eyebrow">Hello, I am</span>
        <h1>{profile.name}</h1>
        <p className="profile-role">{profile.role}</p>
        <p className="location"><MapPin size={17} /> {profile.location}</p>
        <p>{compact ? profile.shortBio : profile.bio}</p>
        <SocialLinks />
      </div>
    </div>
  );
}
