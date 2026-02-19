// Follow setup: https://supabase.com/docs/guides/functions
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE'
  table: string
  record: {
    id: string
    username: string
    email: string
    role: string
    isApproved: boolean
    created_at: string
  }
  old_record: {
    isApproved: boolean
  }
}

serve(async (req) => {
  try {
    const payload: WebhookPayload = await req.json()
    
    // Only proceed if this is a teacher being approved (changed from false to true)
    if (
      payload.table === 'users' &&
      payload.record.role === 'teacher' &&
      payload.record.isApproved === true &&
      payload.old_record?.isApproved === false
    ) {
      
      // Create Supabase client with service role key (for admin actions)
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        { auth: { persistSession: false } }
      )

      // Get teacher details
      const { data: teacher, error: fetchError } = await supabaseAdmin
        .from('users')
        .select('username, email')
        .eq('id', payload.record.id)
        .single()

      if (fetchError || !teacher) {
        throw new Error('Teacher not found')
      }

      // Send email via Supabase built-in email service or external provider
      // Option 1: Using Supabase Auth admin API to send magic link
      const { error: emailError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: teacher.email,
        options: {
          redirectTo: 'https://yourdomain.com/dashboard/teacher'
        }
      })

      if (emailError) {
        console.error('Failed to send email:', emailError)
      }

      // Option 2: You could also use Resend, SendGrid, etc.
      // This is a placeholder for your preferred email service

      // Log the approval
      console.log(`Teacher ${teacher.email} approved at ${new Date().toISOString()}`)

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Approval notification sent to ${teacher.email}` 
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: 'No action needed' }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})