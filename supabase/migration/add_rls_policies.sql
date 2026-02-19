-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_assignment_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (except role and approval)
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Admins can read all users (for approval dashboard)
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        auth.uid() IN (SELECT id FROM users WHERE role = 'admin' AND "isApproved" = true)
    );

-- Admins can update users (approve teachers)
CREATE POLICY "Admins can update users" ON users
    FOR UPDATE USING (
        auth.uid() IN (SELECT id FROM users WHERE role = 'admin' AND "isApproved" = true)
    );

-- ============================================
-- PROGRESS TABLES (user_topic_progress, quiz_attempts, lab_attempts)
-- ============================================

-- Students can only see their own progress
CREATE POLICY "Users can view own topic progress" ON user_topic_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own topic progress" ON user_topic_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own topic progress" ON user_topic_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Quiz attempts
CREATE POLICY "Users can view own quiz attempts" ON quiz_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts" ON quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Lab attempts
CREATE POLICY "Users can view own lab attempts" ON lab_attempts
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Users can insert own lab attempts" ON lab_attempts
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- ============================================
-- ASSIGNMENTS & SUBMISSIONS
-- ============================================

-- Teachers can manage their own assignments
CREATE POLICY "Teachers can view own assignments" ON assignments
    FOR SELECT USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can insert assignments" ON assignments
    FOR INSERT WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update own assignments" ON assignments
    FOR UPDATE USING (auth.uid() = teacher_id);

-- Students can view published assignments (all, since they're class-based)
CREATE POLICY "Students can view published assignments" ON assignments
    FOR SELECT USING (status = 'published');

-- Assignment submissions
CREATE POLICY "Students can view own submissions" ON student_assignment_progress
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own submissions" ON student_assignment_progress
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own submissions" ON student_assignment_progress
    FOR UPDATE USING (auth.uid() = student_id);

-- Teachers can view submissions for their assignments
CREATE POLICY "Teachers can view submissions" ON student_assignment_progress
    FOR SELECT USING (
        auth.uid() IN (
            SELECT teacher_id FROM assignments WHERE id = assignment_id
        )
    );

-- ============================================
-- GAMIFICATION (badges, streaks)
-- ============================================

CREATE POLICY "Users can view own badges" ON user_badges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges" ON user_badges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own streaks" ON user_streaks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks" ON user_streaks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" ON user_streaks
    FOR UPDATE USING (auth.uid() = user_id);

-- Everyone can view badges catalog
CREATE POLICY "Anyone can view badges" ON badges
    FOR SELECT USING (true);

-- ============================================
-- CONTENT TABLES (lessons, quizzes, virtual_labs)
-- ============================================

-- Everyone can view content
CREATE POLICY "Anyone can view lessons" ON lessons
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view quizzes" ON quizzes
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view virtual labs" ON virtual_labs
    FOR SELECT USING (true);

-- ============================================
-- ADMIN FULL ACCESS (for debugging/management)
-- ============================================

-- Grant admins full access to all tables (optional, for maintenance)
CREATE POLICY "Admins have full access to all tables" ON users
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM users WHERE role = 'admin' AND "isApproved" = true)
    );

-- Note: You'll need to create this policy for each table or rely on the per-table policies above
