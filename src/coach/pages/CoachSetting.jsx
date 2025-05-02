import React, { useState } from 'react';
import coachProfile from '../data/coachProfile.json';

const CoachSettings = () => {
  const [profile, setProfile] = useState(coachProfile);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({ ...prev, cv: file.name }));
      setMessage('📄 CV uploaded successfully!');
      // Here, you could send `file` to backend using FormData
    }
  };

  const handleDeleteCV = () => {
    setProfile((prev) => ({ ...prev, cv: null }));
    setMessage('🗑️ CV deleted.');
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Submit updated profile to backend if needed
    setMessage('✅ Profile updated successfully!');
  };

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

        {/* CV Upload Section */}
        <div className="mb-3">
  <label className="form-label">CV Upload (PDF/DOCX)</label>

  {profile.cv ? (
    <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded mb-2">
      <span>{profile.cv}</span>
      <div className="d-flex gap-2">
        <a
          href={`/uploads/cv/${profile.cv}`} // path where CVs are stored
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
