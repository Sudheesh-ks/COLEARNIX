"use client"

import { useState, useEffect } from "react";
import { userService } from "../services/userService";
import '../home/home.css';

export function ProfileSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    dob: "",
  });

  const [initialData, setInitialData] = useState({
    name: "",
    gender: "",
    dob: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await userService.getProfile();
        if (data.success && data.data) {
          const profile = {
            name: data.data.name || "",
            email: data.data.email || "",
            gender: data.data.gender || "",
            dob: data.data.dob || "",
          };
          setFormData(profile);
          setInitialData({
            name: profile.name,
            gender: profile.gender,
            dob: profile.dob,
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
        setErrors({ form: "Failed to load profile data." });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const { name, gender, dob } = formData;

    if (!name.trim()) {
      newErrors.name = "Name is required.";
    } else {
      const trimmedName = name.trim().replace(/\s+/g, ' ');
      if (trimmedName.length < 3) {
        newErrors.name = "Name must be at least 3 characters.";
      } else if (trimmedName.length > 50) {
        newErrors.name = "Name cannot exceed 50 characters.";
      }
    }

    if (!gender) {
      newErrors.gender = "Please select a gender.";
    }

    if (!dob) {
      newErrors.dob = "Date of birth is required.";
    } else {
      const birthDate = new Date(dob);
      const today = new Date();
      if (birthDate > today) {
        newErrors.dob = "Date of birth cannot be in the future.";
      } else {
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 5) {
          newErrors.dob = "You must be at least 5 years old.";
        }
      }
    }

    return newErrors;
  };

  const hasChanges = 
    formData.name.trim().replace(/\s+/g, ' ') !== initialData.name ||
    formData.gender !== initialData.gender ||
    formData.dob !== initialData.dob;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
    }
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    setErrors({});
    setSuccessMsg("");

    try {
      const trimmedName = formData.name.trim().replace(/\s+/g, ' ');
      const { data } = await userService.updateProfile({
        name: trimmedName,
        gender: formData.gender,
        dob: formData.dob,
      });

      if (data.success) {
        setSuccessMsg("Profile updated successfully!");
        setInitialData({
          name: trimmedName,
          gender: formData.gender,
          dob: formData.dob,
        });
        setIsEditing(false);
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err: any) {
      console.error("Update failed", err);
      setErrors({ form: err.response?.data?.message || "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="snr-card snd-anim" style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <div className="snr-spinner" style={{ width: '32px', height: '32px', borderTopColor: 'var(--accent)' }} />
      </div>
    );
  }

  return (
    <div className="snr-card snd-anim">
      <div className="snr-rainbow" />
      <div className="snr-body">
        
        <div className="snr-top" style={{ marginBottom: '20px' }}>
          <div>
            <div className="snr-title">Profile Settings</div>
            <p className="snr-sub">Manage your personal information.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="snd-logout-btn" 
                style={{ width: 'auto', padding: '0 16px', fontSize: '12px', fontWeight: '700', borderRadius: '10px', height: '36px' }}
              >
                Edit Profile
              </button>
            )}
            <div className="snr-icon">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        {errors.form && (
          <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', color: '#ef4444', fontSize: '13px', marginBottom: '20px' }}>
            {errors.form}
          </div>
        )}

        {successMsg && (
          <div style={{ padding: '10px 14px', background: 'rgba(110, 231, 183, 0.1)', border: '1px solid rgba(110, 231, 183, 0.2)', borderRadius: '10px', color: 'var(--accent)', fontSize: '13px', marginBottom: '20px' }}>
            {successMsg}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
          
          <div>
            <label className="snr-pax-label">Email Address (Read-only)</label>
            <input 
              type="text" 
              value={formData.email} 
              disabled 
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                background: 'var(--surface3)', border: '1px solid var(--border)',
                color: 'var(--muted)', fontFamily: '"DM Sans", sans-serif', fontSize: '14px',
                cursor: 'not-allowed', outline: 'none'
              }}
            />
          </div>

          <div>
            <label className="snr-pax-label">Full Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name} 
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Enter your name"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                background: isEditing ? 'var(--surface2)' : 'var(--surface3)', border: '1px solid var(--border)',
                color: isEditing ? 'var(--text)' : 'var(--muted)', fontFamily: '"DM Sans", sans-serif', fontSize: '14px',
                outline: 'none', transition: 'all 0.2s', cursor: isEditing ? 'text' : 'not-allowed'
              }}
              onFocus={(e) => isEditing && (e.target.style.borderColor = 'var(--accent)')}
              onBlur={(e) => isEditing && (e.target.style.borderColor = 'var(--border)')}
            />
            {errors.name && <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', marginLeft: '4px' }}>{errors.name}</div>}
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label className="snr-pax-label">Gender</label>
              <select 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '12px',
                  background: isEditing ? 'var(--surface2)' : 'var(--surface3)', border: '1px solid var(--border)',
                  color: isEditing ? 'var(--text)' : 'var(--muted)', fontFamily: '"DM Sans", sans-serif', fontSize: '14px',
                  outline: 'none', appearance: 'none', cursor: isEditing ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
              >
                <option value="" disabled>Select gender...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
              {errors.gender && <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', marginLeft: '4px' }}>{errors.gender}</div>}
            </div>

            <div style={{ flex: 1 }}>
              <label className="snr-pax-label">Date of Birth</label>
              <input 
                type="date" 
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                disabled={!isEditing}
                max={new Date().toISOString().split("T")[0]}
                style={{
                  width: '100%', padding: '11px 16px', borderRadius: '12px',
                  background: isEditing ? 'var(--surface2)' : 'var(--surface3)', border: '1px solid var(--border)',
                  color: isEditing ? 'var(--text)' : 'var(--muted)', fontFamily: '"DM Sans", sans-serif', fontSize: '14px',
                  outline: 'none', transition: 'all 0.2s', cursor: isEditing ? 'text' : 'not-allowed'
                }}
              />
              {errors.dob && <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px', marginLeft: '4px' }}>{errors.dob}</div>}
            </div>
          </div>

        </div>

        {isEditing && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="snr-reset-btn"
              style={{ marginTop: 0, height: '48px', flex: 1 }}
              onClick={() => {
                setFormData({ ...formData, ...initialData });
                setIsEditing(false);
                setErrors({});
              }}
            >
              Cancel
            </button>
            <button
              className="snr-gen-btn"
              style={{ flex: 2 }}
              disabled={saving || !hasChanges}
              onClick={handleSave}
            >
              {saving ? (
                <><div className="snr-spinner" /> Saving Changes…</>
              ) : (
                <>Save Changes</>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
