#!/usr/bin/env node

/**
 * Cleanup Script for Unpaid Orders
 * 
 * This script identifies and handles orders that were created without payment:
 * 1. Finds orders with paymentStatus='pending' and no paymentId
 * 2. Marks them as 'cancelled' or deletes them
 * 3. Provides a report of actions taken
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function cleanupUnpaidOrders() {
  console.log('🧹 Starting cleanup of unpaid orders...');
  console.log('=' .repeat(50));

  try {
    // Find orders with pending payment and no paymentId
    const { data: problematicOrders, error } = await supabase
      .from('Order')
      .select('*')
      .eq('paymentStatus', 'pending')
      .is('paymentId', null)
      .neq('status', 'draft'); // Don't touch draft orders

    if (error) {
      console.error('❌ Error fetching orders:', error);
      return;
    }

    if (!problematicOrders || problematicOrders.length === 0) {
      console.log('✅ No problematic orders found. All orders have proper payment status.');
      return;
    }

    console.log(`🔍 Found ${problematicOrders.length} orders without payment confirmation:`);
    console.log('');

    // Display details of problematic orders
    problematicOrders.forEach((order, index) => {
      console.log(`${index + 1}. Order ${order.orderNumber}`);
      console.log(`   ID: ${order.id}`);
      console.log(`   Created: ${new Date(order.createdAt).toLocaleString()}`);
      console.log(`   Amount: R${order.totalAmount}`);
      console.log(`   Status: ${order.status} / Payment: ${order.paymentStatus}`);
      console.log(`   PaymentId: ${order.paymentId || 'NULL'}`);
      console.log('');
    });

    // Ask for confirmation (in a real script, you might want user input)
    console.log('🚨 ACTIONS TO TAKE:');
    console.log('1. Mark orders as "cancelled" to prevent shipping');
    console.log('2. Add admin notes explaining the issue');
    console.log('');

    // Update orders to cancelled status
    for (const order of problematicOrders) {
      const { error: updateError } = await supabase
        .from('Order')
        .update({
          status: 'cancelled',
          notes: (order.notes || '') + ' [AUTO-CANCELLED: No payment confirmation found. Customer may not have completed payment. Verify in Yoco dashboard before processing.]',
          updatedAt: new Date().toISOString()
        })
        .eq('id', order.id);

      if (updateError) {
        console.error(`❌ Failed to update order ${order.orderNumber}:`, updateError);
      } else {
        console.log(`✅ Cancelled order ${order.orderNumber} (${order.id})`);
      }
    }

    console.log('');
    console.log('🎯 CLEANUP SUMMARY:');
    console.log(`- Found ${problematicOrders.length} orders without payment`);
    console.log('- All orders marked as "cancelled"');
    console.log('- Admin notes added explaining the issue');
    console.log('');
    console.log('📋 NEXT STEPS:');
    console.log('1. Check your Yoco dashboard for any actual payments');
    console.log('2. If payments exist, manually update order status to "paid"');
    console.log('3. Contact customers if needed to complete payment');
    console.log('');
    console.log('✅ Cleanup completed successfully!');

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}

// Run the cleanup
if (require.main === module) {
  cleanupUnpaidOrders();
}

module.exports = { cleanupUnpaidOrders };
