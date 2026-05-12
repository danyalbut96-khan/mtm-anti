-- 1. Allow patients to insert their own appointments
CREATE POLICY "Patients can insert appointments"
ON appointments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = patient_id);

-- 2. Allow patients to read their own appointments
CREATE POLICY "Patients can read own appointments"
ON appointments FOR SELECT
TO authenticated
USING (auth.uid() = patient_id);

-- 3. Allow doctors to read appointments assigned to them
CREATE POLICY "Doctors can read their appointments"
ON appointments FOR SELECT
TO authenticated
USING (auth.uid() = doctor_id);

-- 4. Allow doctors to update appointment status
CREATE POLICY "Doctors can update appointment status"
ON appointments FOR UPDATE
TO authenticated
USING (auth.uid() = doctor_id);
