// Debug script to check orders in Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ohrayboywmcsqkirqrty.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ocmF5Ym95d21jc3FraXJxcnR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMjkzOTMsImV4cCI6MjA3MDkwNTM5M30._lcFwvyzJ5jpq7Cxdv6W5_O_a1WxqVmGpw3WIUHtasg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugOrders() {
  console.log('🔍 Debugging Orders in Supabase...\n');

  // 1. Check all orders
  console.log('1. All Orders:');
  const { data: allOrders, error: allOrdersError } = await supabase
    .from('Order')
    .select('*')
    .order('createdAt', { ascending: false });

  if (allOrdersError) {
    console.error('❌ Error fetching orders:', allOrdersError);
  } else {
    console.log(`📊 Total orders: ${allOrders?.length || 0}`);
    if (allOrders && allOrders.length > 0) {
      allOrders.forEach((order, index) => {
        console.log(`   ${index + 1}. Order ${order.orderNumber || order.id}`);
        console.log(`      User ID: ${order.userId}`);
        console.log(`      Status: ${order.status}`);
        console.log(`      Payment Status: ${order.paymentStatus}`);
        console.log(`      Total Amount: R${order.totalAmount}`);
        console.log(`      Created: ${order.createdAt}`);
        console.log('');
      });
    }
  }

  // 2. Check paid orders for revenue calculation
  console.log('2. Paid Orders (for revenue):');
  const { data: paidOrders, error: paidOrdersError } = await supabase
    .from('Order')
    .select('totalAmount')
    .eq('paymentStatus', 'paid');

  if (paidOrdersError) {
    console.error('❌ Error fetching paid orders:', paidOrdersError);
  } else {
    console.log(`💰 Paid orders: ${paidOrders?.length || 0}`);
    const totalRevenue = paidOrders?.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0) || 0;
    console.log(`💵 Total Revenue: R${totalRevenue}`);
  }

  // 3. Check all users to see user IDs
  console.log('3. All Users (to check user IDs):');
  const { data: users, error: usersError } = await supabase
    .from('User')
    .select('id, email, firstName, lastName')
    .limit(10);

  if (usersError) {
    console.error('❌ Error fetching users:', usersError);
  } else {
    console.log(`👥 Total users shown: ${users?.length || 0}`);
    users?.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email}`);
      console.log(`      User ID: ${user.id}`);
      console.log(`      Name: ${user.firstName} ${user.lastName}`);
      console.log('');
    });
  }
}

debugOrders().catch(console.error);
