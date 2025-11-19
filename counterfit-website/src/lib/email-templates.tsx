import React from 'react'

interface Product {
  id: string
  productName: string
  quantity: number
  price: number
  size?: string
  color?: string
  image?: string
}

interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: Product[]
  totalAmount: number
  status: string
  paymentStatus: string
  shippingAddress: {
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    province: string
    postalCode: string
    country: string
    phone?: string
  }
  trackingNumber?: string
  carrier?: string
  estimatedDelivery?: string
  orderDate: string
}

export const OrderConfirmationTemplate = ({ order }: { order: OrderEmailData }) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Order Confirmation - Counterfit</title>
    </head>
    <body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#000000', padding: '20px', textAlign: 'center' }}>
          <h1 style={{ color: '#ffffff', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            COUNTERFIT
          </h1>
          <p style={{ color: '#ffffff', margin: '5px 0 0 0', fontSize: '14px' }}>
            Luxury Streetwear
          </p>
        </div>

        {/* Order Confirmed */}
        <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#f8f9fa' }}>
          <h2 style={{ color: '#28a745', margin: '0 0 10px 0', fontSize: '28px' }}>✅ Order Confirmed!</h2>
          <p style={{ color: '#6c757d', margin: 0, fontSize: '16px' }}>
            Thank you for your order, {order.customerName}
          </p>
        </div>

        {/* Order Details */}
        <div style={{ padding: '0 30px' }}>
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#343a40' }}>Order Details</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#6c757d' }}>Order Number:</span>
              <span style={{ fontWeight: 'bold', color: '#343a40' }}>{order.orderNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#6c757d' }}>Order Date:</span>
              <span style={{ color: '#343a40' }}>{new Date(order.orderDate).toLocaleDateString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#6c757d' }}>Status:</span>
              <span style={{ 
                color: '#ffffff', 
                backgroundColor: order.status === 'confirmed' ? '#28a745' : '#ffc107',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                {order.status}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6c757d' }}>Total Amount:</span>
              <span style={{ fontWeight: 'bold', color: '#343a40', fontSize: '18px' }}>R{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Products */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#343a40' }}>Items Ordered</h3>
            {order.items.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                padding: '15px', 
                borderBottom: '1px solid #e9ecef',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#343a40', fontSize: '16px' }}>
                    {item.productName}
                  </h4>
                  <p style={{ margin: '0', color: '#6c757d', fontSize: '14px' }}>
                    Quantity: {item.quantity} × R{item.price.toFixed(2)}
                    {item.size && ` • Size: ${item.size}`}
                    {item.color && ` • Color: ${item.color}`}
                  </p>
                </div>
                <div style={{ fontWeight: 'bold', color: '#343a40' }}>
                  R{(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#343a40' }}>Shipping Address</h3>
            <p style={{ margin: '0', color: '#343a40', lineHeight: '1.5' }}>
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
              {order.shippingAddress.address1}<br />
              {order.shippingAddress.address2 && <>{order.shippingAddress.address2}<br /></>}
              {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}
              {order.shippingAddress.phone && <><br />Phone: {order.shippingAddress.phone}</>}
            </p>
          </div>

          {/* Next Steps */}
          <div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#1976d2' }}>What's Next?</h3>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#343a40' }}>
              <li style={{ marginBottom: '8px' }}>We'll prepare your order for shipping</li>
              <li style={{ marginBottom: '8px' }}>You'll receive a tracking number once shipped</li>
              <li style={{ marginBottom: '8px' }}>Estimated delivery: 4-5 business days</li>
              <li>Contact us if you have any questions</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div style={{ backgroundColor: '#343a40', padding: '30px', textAlign: 'center', color: '#ffffff' }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Need Help?</h3>
          <p style={{ margin: '0 0 15px 0' }}>
            Contact us at <a href="mailto:hello@counterfit.co.za" style={{ color: '#ffffff' }}>hello@counterfit.co.za</a>
          </p>
          <p style={{ margin: '0', fontSize: '14px', color: '#adb5bd' }}>
            © 2025 Counterfit. All rights reserved.
          </p>
        </div>
      </div>
    </body>
  </html>
)

export const OrderShippedTemplate = ({ order }: { order: OrderEmailData }) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Order Shipped - Counterfit</title>
    </head>
    <body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#000000', padding: '20px', textAlign: 'center' }}>
          <h1 style={{ color: '#ffffff', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            COUNTERFIT
          </h1>
          <p style={{ color: '#ffffff', margin: '5px 0 0 0', fontSize: '14px' }}>
            Luxury Streetwear
          </p>
        </div>

        {/* Order Shipped */}
        <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#f8f9fa' }}>
          <h2 style={{ color: '#28a745', margin: '0 0 10px 0', fontSize: '28px' }}>🚚 Your Order is on the Way!</h2>
          <p style={{ color: '#6c757d', margin: 0, fontSize: '16px' }}>
            Hi {order.customerName}, your order has been shipped
          </p>
        </div>

        {/* Tracking Info */}
        <div style={{ padding: '0 30px' }}>
          {order.trackingNumber && (
            <div style={{ backgroundColor: '#e8f5e8', padding: '20px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>Tracking Information</h3>
              <p style={{ margin: '0 0 10px 0', color: '#155724' }}>
                <strong>Tracking Number: {order.trackingNumber}</strong>
              </p>
              {order.carrier && (
                <p style={{ margin: '0 0 10px 0', color: '#155724' }}>
                  Carrier: {order.carrier}
                </p>
              )}
              {order.estimatedDelivery && (
                <p style={{ margin: '0', color: '#155724' }}>
                  Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {/* Order Summary */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#343a40' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#6c757d' }}>Order Number:</span>
              <span style={{ fontWeight: 'bold', color: '#343a40' }}>{order.orderNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6c757d' }}>Total Amount:</span>
              <span style={{ fontWeight: 'bold', color: '#343a40' }}>R{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Items */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#343a40' }}>Items in this Shipment</h3>
            {order.items.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                padding: '10px', 
                borderBottom: '1px solid #e9ecef',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <span style={{ color: '#343a40', fontSize: '16px' }}>
                    {item.productName} × {item.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Address */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#343a40' }}>Delivery Address</h3>
            <p style={{ margin: '0', color: '#343a40', lineHeight: '1.5' }}>
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
              {order.shippingAddress.address1}<br />
              {order.shippingAddress.address2 && <>{order.shippingAddress.address2}<br /></>}
              {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ backgroundColor: '#343a40', padding: '30px', textAlign: 'center', color: '#ffffff' }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Questions about your delivery?</h3>
          <p style={{ margin: '0 0 15px 0' }}>
            Contact us at <a href="mailto:hello@counterfit.co.za" style={{ color: '#ffffff' }}>hello@counterfit.co.za</a>
          </p>
          <p style={{ margin: '0', fontSize: '14px', color: '#adb5bd' }}>
            © 2025 Counterfit. All rights reserved.
          </p>
        </div>
      </div>
    </body>
  </html>
)

export const OrderDeliveredTemplate = ({ order }: { order: OrderEmailData }) => (
  <html>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Order Delivered - Counterfit</title>
    </head>
    <body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' }}>
        {/* Header */}
        <div style={{ backgroundColor: '#000000', padding: '20px', textAlign: 'center' }}>
          <h1 style={{ color: '#ffffff', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
            COUNTERFIT
          </h1>
          <p style={{ color: '#ffffff', margin: '5px 0 0 0', fontSize: '14px' }}>
            Luxury Streetwear
          </p>
        </div>

        {/* Order Delivered */}
        <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#f8f9fa' }}>
          <h2 style={{ color: '#28a745', margin: '0 0 10px 0', fontSize: '28px' }}>🎉 Order Delivered!</h2>
          <p style={{ color: '#6c757d', margin: 0, fontSize: '16px' }}>
            Hi {order.customerName}, your order has been delivered successfully
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '0 30px' }}>
          <div style={{ backgroundColor: '#e8f5e8', padding: '20px', borderRadius: '8px', marginBottom: '30px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#155724' }}>Thank you for choosing Counterfit!</h3>
            <p style={{ margin: '0', color: '#155724' }}>
              We hope you love your new streetwear. Tag us @counterfit on social media to show off your style!
            </p>
          </div>

          {/* Order Summary */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#343a40' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#6c757d' }}>Order Number:</span>
              <span style={{ fontWeight: 'bold', color: '#343a40' }}>{order.orderNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6c757d' }}>Total Amount:</span>
              <span style={{ fontWeight: 'bold', color: '#343a40' }}>R{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Review Request */}
          <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', marginBottom: '30px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#856404' }}>Love your purchase?</h3>
            <p style={{ margin: '0 0 15px 0', color: '#856404' }}>
              Help other streetwear enthusiasts by leaving a review!
            </p>
            <a href="https://counterfit.co.za/reviews" 
               style={{ 
                 backgroundColor: '#000000', 
                 color: '#ffffff', 
                 padding: '12px 24px', 
                 textDecoration: 'none', 
                 borderRadius: '6px',
                 fontWeight: 'bold'
               }}>
              Leave a Review
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={{ backgroundColor: '#343a40', padding: '30px', textAlign: 'center', color: '#ffffff' }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Stay Connected</h3>
          <p style={{ margin: '0 0 15px 0' }}>
            Follow us for the latest drops and exclusive content
          </p>
          <p style={{ margin: '0', fontSize: '14px', color: '#adb5bd' }}>
            © 2025 Counterfit. All rights reserved.
          </p>
        </div>
      </div>
    </body>
  </html>
)


