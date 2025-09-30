// Debug script to check Supabase configuration and find orders
const { createClient } = require('@supabase/supabase-js');

// Frontend Supabase config
const frontendSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ohrayboywmcsqkirqrty.supabase.co';
const frontendSupabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ocmF5Ym95d21jc3FraXJxcnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMjkzOTMsImV4cCI6MjA3MDkwNTM5M30._lcFwvyzJ5jpq7Cxdv6W5_O_a1WxqVmGpw3WIUHtasg';

const frontendSupabase = createClient(frontendSupabaseUrl, frontendSupabaseKey);

async function debugSupabaseConfig() {
  console.log('🔍 Debugging Supabase Configuration...\n');

  console.log('📊 Frontend Supabase Config:');
  console.log('   URL:', frontendSupabaseUrl);
  console.log('   Key:', frontendSupabaseKey.substring(0, 50) + '...');
  console.log('');

  // Check if we can connect to Supabase
  console.log('🔗 Testing Supabase Connection...');
  try {
    const { data, error } = await frontendSupabase
      .from('User')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase connection error:', error);
    } else {
      console.log('✅ Supabase connection successful');
    }
  } catch (err) {
    console.error('❌ Supabase connection failed:', err);
  }

  // Check all orders in Supabase
  console.log('\n📋 Checking Orders in Supabase:');
  const { data: orders, error: ordersError } = await frontendSupabase
    .from('Order')
    .select('*')
    .order('createdAt', { ascending: false });

  if (ordersError) {
    console.error('❌ Error fetching orders:', ordersError);
  } else {
    console.log(`📊 Total orders in Supabase: ${orders?.length || 0}`);
    if (orders && orders.length > 0) {
      orders.forEach((order, index) => {
        console.log(`   ${index + 1}. Order ${order.orderNumber || order.id}`);
        console.log(`      User ID: ${order.userId}`);
        console.log(`      Status: ${order.status}`);
        console.log(`      Payment Status: ${order.paymentStatus}`);
        console.log(`      Total Amount: R${order.totalAmount}`);
        console.log(`      Created: ${order.createdAt}`);
        console.log('');
      });
    } else {
      console.log('   No orders found in Supabase');
    }
  }

  // Check all users in Supabase
  console.log('\n👥 Checking Users in Supabase:');
  const { data: users, error: usersError } = await frontendSupabase
    .from('User')
    .select('id, email, firstName, lastName, role')
    .limit(10);

  if (usersError) {
    console.error('❌ Error fetching users:', usersError);
  } else {
    console.log(`👥 Total users shown: ${users?.length || 0}`);
    users?.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email}`);
      console.log(`      User ID: ${user.id}`);
      console.log(`      Name: ${user.firstName} ${user.lastName}`);
      console.log(`      Role: ${user.role}`);
      console.log('');
    });
  }

  // Check table structure
  console.log('\n🏗️ Checking Order Table Structure:');
  try {
    const { data: sample, error } = await frontendSupabase
      .from('Order')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error checking table structure:', error);
    } else if (sample && sample.length > 0) {
      console.log('📊 Order table columns:', Object.keys(sample[0]));
    } else {
      console.log('📊 Order table exists but is empty');
    }
  } catch (err) {
    console.error('❌ Table structure check failed:', err);
  }

  // Test backend endpoint
  console.log('\n🔗 Testing Backend API:');
  try {
    const response = await fetch('https://counterfit-backend.onrender.com/api/admin/public-stats');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend API accessible');
      console.log('📊 Backend stats:', JSON.stringify(data.data?.overview, null, 2));
    } else {
      console.error('❌ Backend API error:', response.status, response.statusText);
    }
  } catch (err) {
    console.error('❌ Backend API connection failed:', err);
  }
}

debugSupabaseConfig().catch(console.error);


