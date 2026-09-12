import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Truck, Mail } from "lucide-react";

export default function Shipping() {
  return (
    <>
      <Helmet>
        <title>Shipping & Delivery Policy | FarmerSanthe - Agricultural Marketplace</title>
        <meta
          name="description"
          content="Shipping and Delivery Policy for FarmerSanthe. Learn how delivery charges are set by FPOs per district, weight-based pricing tiers, delivery timelines, and order tracking."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          <Truck className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-green-700">Shipping & Delivery Policy</h1>
        </div>
        <p className="text-sm text-gray-500 mb-8">
          Effective Date: January 1, 2025 &nbsp;|&nbsp; Last Updated: February 25, 2026
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <p className="text-green-800">
            <strong>How Delivery Works on FarmerSanthe:</strong> FarmerSanthe is a multi-FPO marketplace. Each Farmer Producer Organisation (FPO) independently sets its own delivery charges per district using weight-based tiered pricing. When you shop from multiple FPOs in one order, each FPO's delivery fee is calculated separately and shown clearly at checkout before you pay.
          </p>
        </div>

        <div className="prose prose-green max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">1. District-Based Delivery</h2>
            <p className="text-gray-600">
              FarmerSanthe uses a <strong>district selection system</strong> to show you products that can be delivered to your location:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>When you first visit the platform, you will be prompted to select your district.</li>
              <li>Only products available for delivery in your selected district will be shown to you.</li>
              <li>You can change your district at any time from the header — your product feed will update automatically.</li>
              <li>For logged-in users, the district saved in your profile is used as a fallback.</li>
              <li>FPOs choose which districts they serve, so product availability varies by district.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">2. How Delivery Charges Are Calculated</h2>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg mb-4">
              <p className="text-amber-900">
                <strong>Important:</strong> Delivery charges are <strong>not set by FarmerSanthe</strong>. Each FPO independently sets their own delivery charges for each district they serve. Charges are based on the total weight of items from that FPO in your cart.
              </p>
            </div>
            <p className="text-gray-600">The delivery fee calculation works as follows:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Your cart items are grouped by FPO (Farmer Producer Organisation).</li>
              <li>For each FPO, the total weight of items is calculated using product weight data.</li>
              <li>The FPO's weight-based pricing tier for your selected district is applied.</li>
              <li>Each FPO's delivery fee is shown separately in your order summary at checkout.</li>
              <li>The total delivery charge is the sum of all FPO delivery fees in your order.</li>
            </ul>
            <p className="text-gray-600 mt-3">
              To see the exact delivery charges for your district and order, add items to your cart and proceed to checkout — charges are calculated in real time before you place the order.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">3. Delivery Timelines</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium text-sm mb-2">
                  Available Now
                </span>
                <p className="text-gray-600 mb-0">
                  Products listed as "Available Now" are in stock and ready for dispatch. Typical delivery is within <strong>1–2 business days</strong>, depending on your district and the FPO's logistics. Farm-fresh produce is harvested close to dispatch to ensure freshness.
                </p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-medium text-sm mb-2">
                  Preorder
                </span>
                <p className="text-gray-600 mb-0">
                  Products listed as "Preorder" are seasonal items not yet harvested. Your order is confirmed and payment collected upfront. Delivery occurs after the harvest season begins, as indicated on the product listing. Preorder access may be available to subscribers first.
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Delivery timelines are estimates and may vary due to weather conditions, crop harvests, or logistics in your area. The FPO will notify you of any significant delays.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">4. Multi-FPO Orders</h2>
            <p className="text-gray-600">
              You can shop from multiple FPO stores in a single cart. Here is what to expect:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Items from different FPOs are grouped and fulfilled separately by each FPO.</li>
              <li>Delivery charges are calculated and displayed separately per FPO at checkout.</li>
              <li>Items from different FPOs may arrive on different days, depending on each FPO's dispatch schedule.</li>
              <li>You will receive separate order updates for each FPO's portion of your order.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">5. Order Tracking</h2>
            <p className="text-gray-600">
              Once your order is placed, you can track its status from your account dashboard under "My Orders". Order statuses progress as follows:
            </p>
            <ol className="pl-6 text-gray-600 space-y-2 list-decimal">
              <li><strong>Order Placed</strong> — Your order has been received and payment confirmed.</li>
              <li><strong>Confirmed</strong> — The FPO has accepted and confirmed your order.</li>
              <li><strong>Processing</strong> — Your order is being prepared — produce is harvested and packed fresh.</li>
              <li><strong>Ready for Dispatch</strong> — Your order is packed and ready for collection by the delivery partner.</li>
              <li><strong>Out for Delivery</strong> — Your order is on its way to your address.</li>
              <li><strong>Delivered</strong> — Your order has been delivered to your address.</li>
            </ol>
            <p className="text-gray-600 mt-3">
              You will receive email notifications as your order moves through these stages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">6. Delivery Address</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Your delivery address is entered at checkout. Ensure your address is accurate and complete, including flat/house number, street, landmark, city, and pincode.</li>
              <li>The city and state fields are auto-filled based on your selected district for your convenience.</li>
              <li>FarmerSanthe and the FPO are not responsible for failed deliveries due to an incorrect or incomplete address provided by you.</li>
              <li>If you need to change your delivery address, contact the FPO before your order is dispatched.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">7. Freshness Guarantee</h2>
            <p className="text-gray-600">
              FarmerSanthe connects you directly with farmers, so your produce travels the shortest possible path from farm to your doorstep:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Produce is harvested as close to the dispatch date as possible.</li>
              <li>FPOs are responsible for proper packaging to maintain freshness during transit.</li>
              <li>Perishable items should be refrigerated promptly upon receipt.</li>
            </ul>
            <p className="text-gray-600 mt-2">
              If you receive produce that appears damaged, spoiled, or significantly different from the listing, please report it within <strong>24 hours of delivery</strong> with photographic evidence to support@farmersanthe.com. We will coordinate with the FPO for resolution.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">8. Order Modifications and Cancellations</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Before dispatch:</strong> You may request an order cancellation through your account dashboard or by contacting the FPO directly. A full refund will be processed.</li>
              <li><strong>After dispatch:</strong> Orders cannot be cancelled once they have been dispatched.</li>
              <li><strong>Preorders:</strong> Can be cancelled up to 7 days before the estimated harvest date.</li>
              <li>Refunds for cancelled orders are processed to your original payment method via Cashfree within 5–10 business days.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">9. Wholesale & Bulk Orders</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Wholesale orders use slab-based pricing — the price per kg/unit decreases as order quantity increases.</li>
              <li>Bulk delivery coordination is managed directly between you and the FPO.</li>
              <li>Delivery charges for wholesale orders are calculated separately by the FPO based on total weight and your district.</li>
              <li>For large bulk orders, the FPO may contact you to arrange a custom delivery schedule.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">10. Contact</h2>
            <p className="text-gray-600 mb-4">
              For delivery-related queries, first contact the FPO store from which you ordered (available in your order details). For platform-level support:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <address className="not-italic text-gray-700 space-y-1">
                <p className="font-semibold text-gray-900">FarmerSanthe</p>
                <p>Operated by SAMSKRUTI AGRO TECH PRIVATE LIMITED</p>
                <p>Karnataka, India</p>
                <div className="flex items-center gap-2 mt-3">
                  <Mail className="h-4 w-4 text-green-600" />
                  <a href="mailto:support@farmersanthe.com" className="text-green-600 hover:underline">
                    support@farmersanthe.com
                  </a>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Phone: <a href="tel:+918088240775" className="text-green-600 hover:underline">+91 80882 40775</a>
                </p>
                <p className="text-sm text-gray-500">Service Hours: Monday–Saturday, 9 AM–6 PM IST</p>
              </address>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
