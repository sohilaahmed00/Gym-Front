import React, { useState, useEffect } from 'react';
import { API_BASE_URL, API_BASE_IMAGE_URL } from '../../config';

const CoachSettings = () => {
  const coachId = localStorage.getItem('id');
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/Coaches/GetCoachbyId/${coachId}`);
        if (!response.ok) throw new Error('Failed to fetch coach profile');
        const data = await response.json();
        setProfile({
          name: data.applicationUser?.fullName || '',
          email: data.applicationUser?.email || '',
          phone: data.applicationUser?.phoneNumber || '',
          bio: data.bio || '',
          specialization: data.specialization || '',
          portfolio_Link: data.portfolio_Link || '',
          experience_Years: data.experience_Years || '',
          availability: data.availability || '',
          cv: data.cv || null,
        });
        setLoading(false);
      } catch (error) {
        setMessage('❌ Could not load profile.');
        setLoading(false);
      }
    };
    if (coachId) fetchProfile();
    else {
      setMessage('❌ No coach id found.');
      setLoading(false);
    }
  }, [coachId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({ ...prev, cv: file.name }));
      setMessage('📄 CV uploaded (not sent to server in this demo).');
    }
  };

  const handleDeleteCV = () => {
    setProfile((prev) => ({ ...prev, cv: null }));
    setMessage('🗑️ CV deleted.');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = {
        ...profile,
        fullName: profile.name,
        phoneNumber: profile.phone,
        // أضف أي حقول أخرى مطلوبة من الـ API هنا
      };
      const response = await fetch(`${API_BASE_URL}/Coaches/UpdateCoach/${coachId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
      });
      if (response.ok) {
        setMessage('✅ Profile updated successfully!');
      } else {
        setMessage('❌ Failed to update profile.');
      }
    } catch (error) {
      setMessage('❌ Error updating profile.');
    }
  };

  if (loading) {
    return <div className="container mt-5">Loading...</div>;
  }
  if (!profile) {
    return <div className="container mt-5">❌ Could not load profile.</div>;
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h3 className="mb-4" style={{ color: '#fd5c28' }}>⚙️ Coach Settings</h3>

      {message && (
        <div className="alert alert-info py-2">{message}</div>
      )}

      <form onSubmit={handleSave}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={profile.name}
            onChange={handleInputChange}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={profile.email}
            onChange={handleInputChange}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            name="phone"
            className="form-control"
            value={profile.phone}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Bio</label>
          <textarea
            name="bio"
            rows="3"
            className="form-control"
            value={profile.bio}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Specialization</label>
          <input
            type="text"
            name="specialization"
            className="form-control"
            value={profile.specialization}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Portfolio Link</label>
          <input
            type="url"
            name="portfolio_Link"
            className="form-control"
            value={profile.portfolio_Link}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Years of Experience</label>
          <input
            type="number"
            name="experience_Years"
            className="form-control"
            value={profile.experience_Years}
            onChange={handleInputChange}
          />
        </div>

        {/* CV Upload Section */}
        <div className="mb-3">
          <label className="form-label">CV Upload (PDF/DOCX)</label>
          {profile.cv ? (
            <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded mb-2">
              <span>{profile.cv}</span>
              <div className="d-flex gap-2">
                <a
                  href={`${API_BASE_IMAGE_URL}/images/CoachCVs/${profile.cv}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary"
                >
                  👁️ View
                </a>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleDeleteCV}
                >
                  ❌ Delete
                </button>
              </div>
            </div>
          ) : (
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="form-control"
              onChange={handleFileChange}
            />
          )}
        </div>

        <button className="btn btn-primary" type="submit">💾 Save Changes</button>
      </form>
    </div>
  );
};

export default CoachSettings;
