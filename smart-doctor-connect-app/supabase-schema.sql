-- SMART DOCTOR CONNECT AI DATABASE SCHEMA

-- DOCTORS TABLE
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  specialization TEXT,
  city TEXT,
  location TEXT,
  consultation_type TEXT, -- 'online', 'physical', 'both'
  experience INTEGER,
  bio TEXT,
  rating NUMERIC DEFAULT 5.0,
  profile_pic TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PATIENTS TABLE
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AVAILABILITY SLOTS
CREATE TABLE availability_slots (
  id BIGSERIAL PRIMARY KEY,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0-6 (Sunday-Saturday)
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  UNIQUE(doctor_id, day_of_week, start_time)
);

-- APPOINTMENTS TABLE
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  time_slot TIME NOT NULL,
  consultation_type TEXT, -- 'online' / 'physical'
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
  problem_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MESSAGES TABLE (supports doctor/patient + AI)
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  sender_type TEXT CHECK (sender_type IN ('doctor', 'patient', 'ai')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SECURE ACCESS POLICIES (RLS Example)
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Doctors can read all doctors profile, public view.
CREATE POLICY "Doctors are publicly viewable" ON doctors FOR SELECT USING (true);

-- Patients can only read/edit their own row.
CREATE POLICY "Patients manage own record" ON patients FOR ALL USING (auth.uid() = id);
