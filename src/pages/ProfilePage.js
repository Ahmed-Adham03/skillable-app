import React, { useEffect, useState } from 'react';

const NEED_OPTIONS = [
  { value: 'N/A', label: 'No issues / N/A' },
  { value: 'Mild', label: 'Mild' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Significant', label: 'Significant' },
  { value: 'Requires support', label: 'Requires support' }
];

const GOVERNORATES = [
  'N/A',
  'Cairo',
  'Giza',
  'Alexandria',
  'Dakahlia',
  'Red Sea',
  'Beheira',
  'Fayoum',
  'Gharbia',
  'Ismailia',
  'Menoufia',
  'Minya',
  'Qalyubia',
  'New Valley',
  'Suez',
  'Aswan',
  'Assiut',
  'Beni Suef',
  'Port Said',
  'Damietta',
  'Sharkia',
  'South Sinai',
  'Kafr El Sheikh',
  'Matrouh',
  'Luxor',
  'Qena',
  'North Sinai',
  'Sohag'
];

export default function ProfilePage({
  theme,
  themeMode,
  API_BASE,
  currentUser,
  setCurrentUser,
  speakOnFocus,
  speechEnabled,
  speakText
}) {
  const [fullName, setFullName] = useState('N/A');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('N/A');
  const [mobility, setMobility] = useState('N/A');
  const [vision, setVision] = useState('N/A');
  const [hearing, setHearing] = useState('N/A');
  const [cognitive, setCognitive] = useState('N/A');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    setFullName(currentUser.full_name || 'N/A');
    setPhoneNumber(currentUser.phone_number === 'N/A' ? '' : (currentUser.phone_number || ''));
    setAddress(currentUser.address || 'N/A');
    setMobility(currentUser.mobility || 'N/A');
    setVision(currentUser.vision || 'N/A');
    setHearing(currentUser.hearing || 'N/A');
    setCognitive(currentUser.cognitive || 'N/A');
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');
    setIsSaving(true);

    const token = localStorage.getItem('skillable_token');
    if (!token) {
      setError('You need to be signed in to save your profile.');
      if (speakOnFocus && speechEnabled) {
        speakText('You need to be signed in to save your profile.');
      }
      setIsSaving(false);
      return;
    }

    if (phoneNumber && phoneNumber.length !== 11) {
      const message = 'Phone number must be exactly 11 digits.';
      setError(message);
      if (speakOnFocus && speechEnabled) {
        speakText(message);
      }
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: fullName,
          phone_number: phoneNumber || 'N/A',
          address,
          mobility,
          vision,
          hearing,
          cognitive
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Profile update failed.');
      }
      const data = await res.json();
      setCurrentUser(data);
      setStatus('Profile updated.');
      if (speakOnFocus && speechEnabled) {
        speakText('Profile updated.');
      }
    } catch (err) {
      const message = err.message || 'Profile update failed.';
      setError(message);
      if (speakOnFocus && speechEnabled) {
        speakText(message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className={`p-10 lg:p-12 rounded-[2.5rem] ${theme.glass}`}>
            <h1 className="text-4xl lg:text-5xl font-black mb-4">Personalize your experience</h1>
            <p className={`mb-8 max-w-3xl ${theme.textSecondary}`}>
              Share your needs so we can recommend paths that fit you. Choose “No issues / N/A” if a category does not apply.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold" htmlFor="profile-full-name">Full name</label>
                  <div className="flex items-center gap-3">
                    <input
                      id="profile-full-name"
                      className={`w-full p-4 rounded-xl border ${isEditingName ? theme.input : 'bg-slate-100 text-slate-500 border-slate-200'}`}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      readOnly={!isEditingName}
                      aria-readonly={!isEditingName}
                    />
                    <button
                      type="button"
                      onClick={() => setIsEditingName((prev) => !prev)}
                      className={`px-4 py-2 rounded-xl font-bold border ${themeMode === 'contrast' ? 'border-white' : 'border-slate-700'}`}
                    >
                      {isEditingName ? 'Lock' : 'Edit'}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold" htmlFor="profile-phone">Phone number</label>
                  <input
                    id="profile-phone"
                    className={`w-full p-4 rounded-xl border ${theme.input}`}
                    value={phoneNumber}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D+/g, '').slice(0, 11);
                      setPhoneNumber(digits);
                    }}
                    inputMode="numeric"
                    pattern="\d{11}"
                    aria-describedby="profile-phone-help"
                  />
                  <div id="profile-phone-help" className="text-xs opacity-70">
                    11 digits only.
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold" htmlFor="profile-address">Address (Governorate)</label>
                <select
                  id="profile-address"
                  className={`w-full p-4 rounded-xl border ${theme.input}`}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                >
                  {GOVERNORATES.map((gov) => (
                    <option key={gov} value={gov}>{gov}</option>
                  ))}
                </select>
              </div>

              <fieldset className="space-y-4">
                <legend className="text-lg font-black">Needs profile</legend>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold" htmlFor="need-mobility">Mobility</label>
                    <select
                      id="need-mobility"
                      className={`w-full p-4 rounded-xl border ${theme.input}`}
                      value={mobility}
                      onChange={(e) => setMobility(e.target.value)}
                    >
                      {NEED_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold" htmlFor="need-vision">Vision</label>
                    <select
                      id="need-vision"
                      className={`w-full p-4 rounded-xl border ${theme.input}`}
                      value={vision}
                      onChange={(e) => setVision(e.target.value)}
                    >
                      {NEED_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold" htmlFor="need-hearing">Hearing</label>
                    <select
                      id="need-hearing"
                      className={`w-full p-4 rounded-xl border ${theme.input}`}
                      value={hearing}
                      onChange={(e) => setHearing(e.target.value)}
                    >
                      {NEED_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold" htmlFor="need-cognitive">Cognitive</label>
                    <select
                      id="need-cognitive"
                      className={`w-full p-4 rounded-xl border ${theme.input}`}
                      value={cognitive}
                      onChange={(e) => setCognitive(e.target.value)}
                    >
                      {NEED_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </fieldset>

              {error && <div role="alert" className="text-sm text-red-500 font-semibold">Error: {error}</div>}
              {status && <div role="status" className="text-sm text-green-600 font-semibold">{status}</div>}

              <button type="submit" className={`px-8 py-3 rounded-xl font-bold ${theme.primaryBtn}`}>
                {isSaving ? 'Saving...' : 'Save profile'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
