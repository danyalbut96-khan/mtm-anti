-- CRITERIA 5: Final Performance Indicies for High-Throughput Response Scaling
-- Execute within Supabase SQL Editor to achieve O(1) lookups across key vectors.

-- 1. Accelerate Regional Geographic Cluster filtering
CREATE INDEX IF NOT EXISTS idx_doctors_city ON public.doctors(city);

-- 2. Instant Clinical Specialization pipeline optimization
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON public.doctors(specialization);

-- 3. Availability/Active-First sort ordering optimizations
CREATE INDEX IF NOT EXISTS idx_doctors_available ON public.doctors(is_available);

-- 4. Appointment Relation joins for lightning fast Dashboard retrieval
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON public.appointments(patient_id);

-- 5. Double-booking conflict check accelerator
CREATE INDEX IF NOT EXISTS idx_appointments_slot_conflict ON public.appointments(doctor_id, appointment_date, time_slot);

ANALYZE; -- Recalculate query planner statistics
