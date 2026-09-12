import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Scale, Mail } from "lucide-react";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | FarmerSanthe - Agricultural Marketplace</title>
        <meta
          name="description"
          content="Terms of Service for FarmerSanthe (farmersanthe.com). Read our terms governing account usage, orders, FPO delivery charges, payments, refunds, and FPO store operations."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          <Scale className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-green-700">Terms of Service</h1>
        </div>
        <p className="text-sm text-gray-500 mb-8">
          Effective Date: January 1, 2025 &nbsp;|&nbsp; Last Updated: February 25, 2026
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <p className="text-green-800">
            <strong>Important:</strong> By accessing or using FarmerSanthe (farmersanthe.com), you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform. These terms constitute a legally binding agreement between you and SAMSKRUTI AGRO TECH PRIVATE LIMITED ("FarmerSanthe", "we", "us", "our").
          </p>
        </div>

        <div className="prose prose-green max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">1. About FarmerSanthe</h2>
            <p className="text-gray-600">
              FarmerSanthe is an agricultural marketplace platform operated by SAMSKRUTI AGRO TECH PRIVATE LIMITED, located in Karnataka, India. The platform connects Farmer Producer Organizations (FPOs), individual farmers, consumers, and businesses for the sale and purchase of fresh agricultural produce, farm events, and related services. Each FPO operates its own branded storefront (accessible at /org/[store-slug]) as a tenant on the platform.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg mt-3">
              <p className="text-amber-900">
                <strong>Intermediary Disclosure:</strong> FarmerSanthe acts as an intermediary marketplace. We facilitate transactions between buyers and sellers but are not a party to the actual sale. Responsibility for product quality, accuracy of listings, fulfillment, and delivery charges rests with the respective sellers (farmers/FPOs).
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">2. Definitions</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>"User"</strong> means any person who accesses or uses the FarmerSanthe platform.</li>
              <li><strong>"Customer"</strong> means a user who purchases products or books events through the platform.</li>
              <li><strong>"Farmer"</strong> means a user who lists and sells agricultural products or hosts farm events on the platform.</li>
              <li><strong>"District Manager"</strong> means a user who manages an FPO (Farmer Producer Organization), oversees farmer onboarding, product approvals, delivery pricing configuration, and order coordination within their district.</li>
              <li><strong>"FPO Store"</strong> means the branded online storefront of a Farmer Producer Organization, accessible at /org/[store-slug].</li>
              <li><strong>"Products"</strong> means agricultural produce, farm goods, and other items listed for sale on the platform.</li>
              <li><strong>"Wholesale"</strong> means bulk purchase orders with volume-based slab pricing.</li>
              <li><strong>"Farm Events"</strong> means experiences such as fruit picking, farm tours, workshops, and festivals hosted by farmers.</li>
              <li><strong>"NF"</strong> means Natural Farming, a sustainable farming methodology.</li>
              <li><strong>"District Selection"</strong> means the district chosen by a customer (stored in their profile and browser), used to filter products deliverable to their location and calculate applicable delivery charges.</li>
              <li><strong>"Delivery Charges"</strong> means fees set independently by each FPO for delivery to specific districts, calculated based on the total weight of items ordered from that FPO.</li>
              <li><strong>"Subscription Plan"</strong> means a paid or free-tier plan that determines an FPO's access to platform features, including commission rates and advanced capabilities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">3. Account Registration</h2>
            <p className="text-gray-600">To use certain features of FarmerSanthe, you must create an account. By registering, you agree to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Provide accurate, current, and complete information during registration.</li>
              <li>Maintain the security and confidentiality of your login credentials.</li>
              <li>Accept responsibility for all activities that occur under your account.</li>
              <li>Notify us immediately of any unauthorised use of your account.</li>
              <li>Not create multiple accounts or accounts with false information.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">User Roles</h3>
            <p className="text-gray-600">FarmerSanthe supports the following user roles:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Customer:</strong> Can browse products (filtered by selected district), place retail and wholesale orders, book farm events, follow FPO stores, and leave reviews.</li>
              <li><strong>Farmer:</strong> Can list products (retail and wholesale with slab pricing), manage inventory, host farm events, receive orders, access AI NF recommendations, and manage organic certification status.</li>
              <li><strong>District Manager:</strong> Can manage an FPO store and its branded storefront, onboard and manage farmers, approve product listings, configure per-district delivery pricing tiers, coordinate order fulfillment, manage FPO subscription plans, and oversee operations within their district(s).</li>
            </ul>
            <p className="text-gray-600 mt-2">
              We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or misuse the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">4. Product Listings</h2>
            <p className="text-gray-600">Farmers and FPOs listing products on FarmerSanthe agree to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Provide accurate product descriptions, pricing, images, and availability status.</li>
              <li>Only list products that comply with applicable food safety and agricultural regulations.</li>
              <li>Clearly indicate whether a product is "Available Now" (in stock) or "Preorder" (seasonal/upcoming). Preorder products allow customers to reserve items before harvest.</li>
              <li>Set fair and transparent pricing for retail (per unit/kg) and wholesale (slab-based) listings.</li>
              <li>Accurately indicate the approximate weight per unit for piece-based items, as this is used to calculate delivery charges.</li>
              <li>Accurately indicate organic certification status. False organic certification claims are a serious violation of these terms.</li>
              <li>Update product availability promptly when stock changes.</li>
              <li>Not list prohibited, illegal, or unsafe products.</li>
            </ul>
            <p className="text-gray-600 mt-2">
              All farmer product listings require approval by the FPO/District Manager before appearing publicly. FarmerSanthe reserves the right to remove any listing that violates these terms, without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">5. FPO Store Operations & Delivery Charges</h2>
            <p className="text-gray-600">
              FPO Stores are branded storefronts managed by District Managers on behalf of Farmer Producer Organizations. District Managers operating FPO Stores agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Onboard only legitimate farmers within their district and verify their credentials.</li>
              <li>Review and approve product listings for quality and accuracy before they appear in the FPO store.</li>
              <li>Coordinate order fulfillment between customers and farmers in a timely manner.</li>
              <li>Maintain accurate store information including organisation name, logo, and district details.</li>
              <li>Handle customer queries and complaints related to their FPO store professionally.</li>
              <li>Distribute payments fairly to farmers as per agreed terms, facilitated through Cashfree Easy Split.</li>
              <li>Comply with all applicable laws and FarmerSanthe policies.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">FPO-Set Delivery Charges</h3>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
              <p className="text-amber-900">
                <strong>Delivery charges are set entirely by each FPO independently.</strong> FarmerSanthe does not set or control delivery charges. Each District Manager configures their own delivery pricing per district they serve, using weight-based pricing tiers.
              </p>
            </div>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-3">
              <li>Delivery fees are calculated per FPO based on the total weight of items in the customer's cart from that FPO.</li>
              <li>FPOs are responsible for setting fair, transparent, and accurate delivery charges.</li>
              <li>FPOs must only configure delivery for districts they are genuinely able to serve.</li>
              <li>Delivery charges are shown clearly at checkout before the customer confirms payment.</li>
              <li>FarmerSanthe is not liable for delivery delays, failures, or disputes arising from FPO delivery operations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">6. District-Based Product Filtering</h2>
            <p className="text-gray-600">
              FarmerSanthe uses a district selection system to ensure customers see only products they can actually receive:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Customers are prompted to select their district on first visit. This selection is stored in their profile and browser local storage.</li>
              <li>Product listings are filtered to show only items from FPOs that deliver to the customer's selected district.</li>
              <li>Customers can change their district at any time from the site header.</li>
              <li>FarmerSanthe does not guarantee product availability in all districts — availability depends on which FPOs serve each district.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">7. FPO Store Follow System</h2>
            <p className="text-gray-600">
              Customers can follow FPO stores on FarmerSanthe to receive updates and stay connected with their preferred producers:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Following an FPO store is free and available to all registered customers.</li>
              <li>Follower counts are visible on FPO store and farmer profile pages.</li>
              <li>FarmerSanthe does not use follow data for advertising or third-party marketing.</li>
              <li>You can unfollow an FPO store at any time from your account or the store page.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">8. Subscription Plans</h2>
            <p className="text-gray-600">
              FarmerSanthe offers subscription plans for FPOs (District Managers) that determine platform access and commission structure:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Subscription plan details, pricing, and feature access are described on the platform's pricing page.</li>
              <li>Certain subscription plans offer reduced or zero platform commission fees on transactions.</li>
              <li>Preorder product access and other advanced features may be available on specific plan tiers.</li>
              <li>Subscription fees (if applicable) are billed as per the plan terms and processed through Cashfree.</li>
              <li>FarmerSanthe reserves the right to modify subscription plan features and pricing, with reasonable notice to existing subscribers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">9. Orders and Fulfillment</h2>
            <p className="text-gray-600">When you place an order on FarmerSanthe:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Your order constitutes an offer to purchase the listed products at the stated price plus the applicable delivery charges.</li>
              <li>Orders are confirmed upon successful payment processing through Cashfree.</li>
              <li>The farmer/FPO is responsible for fulfilling the order with the correct products, quantities, and quality.</li>
              <li>Delivery timelines are estimated and may vary based on harvest schedules, weather, and logistics.</li>
              <li>For "Preorder" products, delivery will occur after the harvest season begins as indicated on the listing.</li>
              <li>FarmerSanthe does not guarantee product availability — products are subject to natural conditions and seasonal availability.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">Wholesale Orders</h3>
            <p className="text-gray-600">Wholesale orders follow slab-based volume pricing:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Price per kg/unit decreases as order quantity increases, based on slabs set by the farmer/FPO.</li>
              <li>The applicable slab price is automatically calculated at checkout.</li>
              <li>Minimum order quantities may apply for wholesale listings.</li>
              <li>Bulk delivery coordination and delivery charges are handled by the farmer/FPO.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">10. Payment Terms</h2>
            <p className="text-gray-600">All payments on FarmerSanthe are processed through the <strong>Cashfree</strong> payment gateway:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>We accept payments via UPI, credit/debit cards, net banking, and other methods supported by Cashfree.</li>
              <li>All prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise.</li>
              <li>Payment is collected at the time of order placement, including product price and all applicable delivery charges.</li>
              <li>FarmerSanthe does not store your payment card or banking details — all payment data is handled securely by Cashfree.</li>
              <li>Farmers and FPOs receive payouts for fulfilled orders through Cashfree Easy Split, after deducting any applicable platform fees as per their subscription plan.</li>
            </ul>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mt-3">
              <p className="text-green-800">
                <strong>Payment Distribution:</strong> When a customer pays for an order, the total amount (products + delivery charges) is processed through Cashfree. The FPO receives their payout minus any applicable platform service fee as per their subscription plan. District Managers coordinate final payment distribution to individual farmers.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">11. Cancellation and Refund Policy</h2>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">Product Order Cancellations</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>"Available Now" orders:</strong> Can be cancelled before the order is marked as dispatched. Once dispatched, cancellation is not possible.</li>
              <li><strong>"Preorder" orders:</strong> Can be cancelled up to 7 days before the estimated harvest date.</li>
              <li>Cancellation requests must be submitted through your account dashboard or by emailing support@farmersanthe.com.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">Product Refunds</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Full Refund:</strong> If the order is cancelled before dispatch, or if the farmer/FPO fails to fulfill the order.</li>
              <li><strong>Partial Refund:</strong> If products received are significantly different from the listing (wrong item, damaged goods).</li>
              <li><strong>Quality Issues:</strong> Report quality concerns within 24 hours of delivery with photographic evidence. We will investigate and process appropriate refunds.</li>
              <li><strong>Delivery Charge Refund:</strong> Delivery charges are refunded in full when an order is cancelled before dispatch or is unfulfilled by the FPO.</li>
              <li><strong>Refund Method:</strong> Refunds are processed to the original payment method via Cashfree. Processing time is typically 5–10 business days.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">Event Cancellations</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>More than 48 hours before event:</strong> Full refund.</li>
              <li><strong>24–48 hours before event:</strong> 50% refund.</li>
              <li><strong>Less than 24 hours before event:</strong> No refund.</li>
              <li><strong>Event cancelled by farmer:</strong> Full refund processed automatically.</li>
              <li><strong>No-show:</strong> No refund for no-show attendees.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">12. Farm Events</h2>
            <p className="text-gray-600">FarmerSanthe allows farmers to host and customers to book farm events including fruit picking, farm tours, workshops, seasonal festivals, and more:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Event details, dates, pricing, and capacity are set by the hosting farmer.</li>
              <li>Booking is confirmed upon successful payment.</li>
              <li>Attendees must follow all safety guidelines and instructions provided by the farmer at the event.</li>
              <li>FarmerSanthe is not liable for injuries, accidents, or incidents that occur during farm events. Attendance is at your own risk.</li>
              <li>Farmers hosting events must ensure adequate safety measures and comply with applicable regulations.</li>
              <li>Events may be modified or cancelled by the farmer due to weather, crop conditions, or other circumstances. Affected attendees will be notified and refunded as per the cancellation policy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">13. Organic Certification</h2>
            <p className="text-gray-600">FarmerSanthe allows farmers to display their organic certification status on their profile and product listings:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Farmers are solely responsible for the accuracy of their organic certification claims.</li>
              <li>Displaying false or misleading organic certification information is a serious violation of these terms and applicable consumer protection laws.</li>
              <li>FarmerSanthe does not independently verify organic certifications. Customers who wish to verify certification may request supporting documentation from the farmer or FPO.</li>
              <li>FarmerSanthe reserves the right to remove organic certification badges and suspend accounts where false claims are reported and substantiated.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">14. Reviews and Ratings</h2>
            <p className="text-gray-600">Users may post reviews and ratings for products, farmers, and events. By posting a review, you agree to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Provide honest, accurate feedback based on your genuine experience.</li>
              <li>Not post defamatory, abusive, discriminatory, or misleading content.</li>
              <li>Not post reviews for products or events you have not purchased or attended.</li>
              <li>Grant FarmerSanthe a non-exclusive licence to display your reviews on the platform.</li>
            </ul>
            <p className="text-gray-600 mt-2">
              FarmerSanthe reserves the right to remove reviews that violate these guidelines without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">15. AI Services and NF Recommendations</h2>
            <p className="text-gray-600">FarmerSanthe offers AI-powered Natural Farming (NF) recommendations for farmers:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>AI recommendations are generated based on farmer-provided data including soil type, region, climate, crop history, and farm layout.</li>
              <li>These recommendations are advisory in nature and do not constitute professional agricultural consulting.</li>
              <li>FarmerSanthe does not guarantee crop yields, income, or outcomes based on AI recommendations.</li>
              <li>Farmers should consult qualified agricultural experts before making significant farming decisions.</li>
              <li>AI recommendation data may be used in anonymised form to improve the recommendation engine.</li>
            </ul>
            <p className="text-gray-600 mt-2">
              Natural Farming methodology is inspired by the principles of Subhash Palekar. FarmerSanthe acknowledges and respects the contributions of Shri Subhash Palekar to sustainable agriculture.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">16. Intellectual Property</h2>
            <p className="text-gray-600">
              All content on the FarmerSanthe platform — including the website design, logos, text, graphics, software, and code — is the intellectual property of SAMSKRUTI AGRO TECH PRIVATE LIMITED or its licensors and is protected by Indian copyright and trademark laws.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>You may not copy, reproduce, modify, distribute, or create derivative works from our platform content without written permission.</li>
              <li>Product images and descriptions uploaded by farmers remain the property of the respective farmers, with a licence granted to FarmerSanthe for display on the platform.</li>
              <li>User-generated content (reviews, photos) grants FarmerSanthe a non-exclusive, royalty-free licence to use, display, and distribute such content on the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">17. Prohibited Activities</h2>
            <p className="text-gray-600">Users must not:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Use the platform for any illegal or unauthorised purpose.</li>
              <li>List counterfeit, adulterated, or prohibited products, or make false organic certification claims.</li>
              <li>Engage in price manipulation, fake reviews, or deceptive practices.</li>
              <li>Attempt to gain unauthorised access to other users' accounts or platform systems.</li>
              <li>Use automated scripts, bots, or scraping tools on the platform.</li>
              <li>Harass, threaten, or abuse other users, farmers, or FarmerSanthe staff.</li>
              <li>Circumvent or manipulate the payment system or delivery charge calculations.</li>
              <li>Violate any applicable laws or regulations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">18. Limitation of Liability</h2>
            <p className="text-gray-600">To the maximum extent permitted by law:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>FarmerSanthe is provided on an "as is" and "as available" basis without warranties of any kind.</li>
              <li>We do not guarantee uninterrupted, error-free, or secure access to the platform.</li>
              <li>We are not liable for the quality, safety, legality, or accuracy of products listed by farmers.</li>
              <li>We are not liable for the accuracy or fairness of delivery charges set by individual FPOs.</li>
              <li>We are not liable for any direct, indirect, incidental, special, or consequential damages arising from the use of the platform.</li>
              <li>Our total liability for any claims related to the platform shall not exceed the amount paid by you for the specific transaction in question.</li>
              <li>We are not responsible for delays, failures, or errors caused by third-party services (Cashfree, Cloudinary, Zepto Mail, or FPO delivery operations).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">19. Indemnification</h2>
            <p className="text-gray-600">
              You agree to indemnify and hold harmless FarmerSanthe, SAMSKRUTI AGRO TECH PRIVATE LIMITED, its officers, directors, employees, and agents from any claims, losses, damages, liabilities, and expenses (including legal fees) arising from your use of the platform, violation of these terms, or infringement of any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">20. Dispute Resolution</h2>
            <p className="text-gray-600">In the event of a dispute:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Between Buyer and Seller:</strong> FarmerSanthe will assist in mediating disputes related to orders, quality, delivery, or delivery charges. Contact us at support@farmersanthe.com with your order details.</li>
              <li><strong>Escalation:</strong> If mediation fails, disputes shall be resolved through arbitration in accordance with the Arbitration and Conciliation Act, 1996.</li>
              <li><strong>Jurisdiction:</strong> All disputes shall be subject to the exclusive jurisdiction of courts in Bangalore, Karnataka, India.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">21. Governing Law</h2>
            <p className="text-gray-600">
              These Terms of Service are governed by and construed in accordance with the laws of India, including but not limited to the Information Technology Act, 2000, the Consumer Protection Act, 2019, the Indian Contract Act, 1872, and applicable rules and regulations. The courts of Bangalore, Karnataka shall have exclusive jurisdiction over any disputes arising from these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">22. Modifications to Terms</h2>
            <p className="text-gray-600">
              FarmerSanthe reserves the right to modify these Terms of Service at any time. Changes will be posted on this page with an updated "Last Updated" date. Continued use of the platform after changes are posted constitutes your acceptance of the revised terms. We may notify you of material changes via email or platform notifications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">23. Termination</h2>
            <p className="text-gray-600">
              FarmerSanthe may suspend or terminate your account at any time, with or without cause, including but not limited to violation of these terms, fraudulent activity, or misuse of the platform. Upon termination, your right to use the platform ceases immediately. Provisions that by their nature should survive termination (including limitation of liability, indemnification, and dispute resolution) shall remain in effect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">24. Severability</h2>
            <p className="text-gray-600">
              If any provision of these Terms is found to be invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">25. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions or concerns about these Terms of Service, please contact us:
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
                <p className="text-sm text-gray-500 mt-1">
                  Website:{" "}
                  <a href="https://farmersanthe.com" className="text-green-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    farmersanthe.com
                  </a>
                </p>
              </address>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
