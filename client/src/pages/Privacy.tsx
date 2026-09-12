import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Shield, Mail } from "lucide-react";

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | FarmerSanthe - Agricultural Marketplace</title>
        <meta
          name="description"
          content="Privacy Policy for FarmerSanthe (farmersanthe.com). Learn how we collect, use, and protect your personal data on our agricultural marketplace platform."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-green-700">Privacy Policy</h1>
        </div>
        <p className="text-sm text-gray-500 mb-8">
          Effective Date: January 1, 2025 &nbsp;|&nbsp; Last Updated: February 25, 2026
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <p className="text-green-800">
            <strong>Our Commitment:</strong> FarmerSanthe (operated by SAMSKRUTI AGRO TECH PRIVATE LIMITED, Karnataka, India) is committed to protecting your privacy. This policy explains how we collect, use, store, and share your personal information when you use our platform at farmersanthe.com.
          </p>
        </div>

        <div className="prose prose-green max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">1. Information We Collect</h2>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">1.1 Account Information</h3>
            <p className="text-gray-600">When you register on FarmerSanthe, we collect:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Personal Details:</strong> Full name, email address, phone number, and password (stored in encrypted form).</li>
              <li><strong>Address Information:</strong> Delivery address including street, city, district, state, and pincode.</li>
              <li><strong>District:</strong> Your selected district, used to filter products deliverable to your location and calculate delivery charges. Stored in your profile and browser local storage.</li>
              <li><strong>Role Information:</strong> Your selected role — customer, farmer, or district_manager (FPO operator).</li>
              <li><strong>Profile Data:</strong> Profile photo (uploaded via Cloudinary), bio, and preferences.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">1.2 Farmer-Specific Information</h3>
            <p className="text-gray-600">If you register as a farmer, we additionally collect:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Farm Details:</strong> Farm name, farm size, location coordinates (latitude/longitude), district, and farming methods.</li>
              <li><strong>Product Listings:</strong> Product names, descriptions, pricing (retail and wholesale slab-based), images (stored on Cloudinary), availability status, approximate weight per unit, and seasonal availability.</li>
              <li><strong>Certifications:</strong> Organic certification status, Natural Farming (NF) participation, and FPO affiliation.</li>
              <li><strong>Bank Details:</strong> Bank account information for receiving payments, managed securely through the FPO/District Manager.</li>
              <li><strong>Social Media:</strong> Optional Instagram handle or website URL for your farmer profile.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">1.3 FPO / District Manager Information</h3>
            <p className="text-gray-600">If you register as a District Manager (FPO operator), we additionally collect:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Organisation Details:</strong> Organisation name, logo, district, and a unique store slug used for your FPO storefront URL (e.g., /org/your-store-name).</li>
              <li><strong>Delivery Configuration:</strong> Per-district delivery pricing tiers set by you for your FPO — these govern the delivery charges shown to customers ordering from your store.</li>
              <li><strong>Subscription Plan:</strong> Your selected subscription plan tier and billing details.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">1.4 Transaction Information</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Order Data:</strong> Products purchased, quantities, order amounts, delivery addresses, and order status.</li>
              <li><strong>Delivery Charges:</strong> Per-FPO delivery fees calculated based on item weight and your district, as configured by each FPO.</li>
              <li><strong>Payment Information:</strong> Payment is processed through <strong>Cashfree</strong> payment gateway. We do not store your credit/debit card numbers or UPI details on our servers. Cashfree handles all payment processing in compliance with PCI-DSS standards.</li>
              <li><strong>Event Bookings:</strong> Event names, booking dates, ticket quantities, and payment status.</li>
              <li><strong>Wholesale Orders:</strong> Bulk order quantities, slab pricing applied, and business delivery details.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">1.5 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Device Information:</strong> Browser type, operating system, device type, and screen resolution.</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, search queries, and interaction patterns.</li>
              <li><strong>Location Data:</strong> GPS coordinates (with your permission) for finding nearby farmers and improving delivery district recommendations.</li>
              <li><strong>Log Data:</strong> IP address, access timestamps, and referral URLs.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">2. How We Use Your Information</h2>
            <p className="text-gray-600">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Create and manage your FarmerSanthe account and profile.</li>
              <li>Process retail and wholesale orders, including delivery fee calculation and coordination.</li>
              <li>Filter product listings to show only items deliverable to your selected district.</li>
              <li>Calculate and display delivery charges per FPO based on your district and order weight.</li>
              <li>Process event bookings and send booking confirmations.</li>
              <li>Connect customers with farmers and FPO stores.</li>
              <li>Provide AI-powered Natural Farming (NF) recommendations tailored to farmer profiles.</li>
              <li>Display farmer profiles, product listings, organic certifications, and reviews to customers.</li>
              <li>Send order updates, delivery notifications, and booking confirmations via email (using Zepto Mail).</li>
              <li>Manage FPO subscription plans and associated platform features.</li>
              <li>Improve our platform features, user experience, and search results.</li>
              <li>Ensure platform security and prevent fraudulent activity.</li>
              <li>Comply with legal obligations under Indian law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">3. How We Share Your Information</h2>
            <p className="text-gray-600">We share your information only as necessary for platform operations:</p>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">3.1 With FPOs and District Managers</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Order details (customer name, delivery address, items ordered, and delivery fee breakdown) are shared with the relevant FPO/District Manager to coordinate order fulfillment and delivery.</li>
              <li>Farmer details are visible to their assigned District Manager for management and quality oversight.</li>
              <li>FPO delivery pricing configurations (per-district tiers) are set by each FPO independently and are not shared with other FPOs.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">3.2 With Payment Processors</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Cashfree:</strong> We share necessary transaction details (order amount, customer identifier) with Cashfree to process payments and distribute payouts to FPOs/farmers via Easy Split. Cashfree's privacy practices are governed by their own privacy policy.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">3.3 With Third-Party Services</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Cloudinary:</strong> Product and profile images are stored on Cloudinary's cloud infrastructure.</li>
              <li><strong>Zepto Mail:</strong> We use Zepto Mail to send transactional emails such as order confirmations, password resets, and delivery notifications.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">3.4 Legal Requirements</h3>
            <p className="text-gray-600">
              We may disclose your information if required by law, court order, or government request, or to protect the rights, safety, or property of FarmerSanthe, our users, or the public.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">4. Cookies and Local Storage</h2>
            <p className="text-gray-600">We use cookies and browser local storage to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Authentication Tokens:</strong> Store your login session token so you remain logged in across visits.</li>
              <li><strong>District Selection:</strong> Remember your selected district to filter products and calculate delivery charges correctly.</li>
              <li><strong>Cart Data:</strong> Store your shopping cart contents locally for convenience across sessions.</li>
              <li><strong>Preferences:</strong> Remember your language preference and UI settings.</li>
              <li><strong>Analytics:</strong> Understand how users interact with our platform to improve the experience.</li>
            </ul>
            <p className="text-gray-600 mt-2">
              You can manage cookie and local storage preferences through your browser settings. Clearing local storage will log you out and reset your district selection. For more details, see our{" "}
              <Link href="/cookies" className="text-green-600 hover:underline">Cookie Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">5. Data Security</h2>
            <p className="text-gray-600">We implement appropriate security measures to protect your personal information:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Passwords are hashed using industry-standard encryption before storage.</li>
              <li>All data transmission is encrypted using HTTPS/TLS protocols.</li>
              <li>Payment processing is handled by PCI-DSS compliant Cashfree gateway — we never store card details.</li>
              <li>Access to user data is restricted to authorised personnel and relevant FPO managers.</li>
              <li>JWT tokens are used for secure API authentication.</li>
              <li>Regular security reviews and monitoring of our infrastructure.</li>
            </ul>
            <p className="text-gray-600 mt-2">
              While we strive to protect your data, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">6. Your Rights</h2>
            <p className="text-gray-600">You have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Update or correct inaccurate personal information through your account settings.</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data, subject to legal retention requirements.</li>
              <li><strong>Data Portability:</strong> Request your data in a machine-readable format.</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for optional data processing (e.g., location tracking, marketing emails).</li>
              <li><strong>Objection:</strong> Object to the processing of your data for specific purposes.</li>
            </ul>
            <p className="text-gray-600 mt-2">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:support@farmersanthe.com" className="text-green-600 hover:underline">support@farmersanthe.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">7. Data Retention</h2>
            <p className="text-gray-600">We retain your personal data for as long as:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Your account remains active on FarmerSanthe.</li>
              <li>Necessary to fulfill the purposes outlined in this policy.</li>
              <li>Required by applicable Indian laws and regulations (e.g., tax records, transaction logs).</li>
            </ul>
            <p className="text-gray-600 mt-2">
              After account deletion, we may retain anonymised data for analytical purposes. Transaction records are retained as required under the Information Technology Act, 2000 and applicable tax regulations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">8. Children's Privacy</h2>
            <p className="text-gray-600">
              FarmerSanthe is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If we become aware that a child under 18 has provided us with personal data, we will take steps to delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">9. Changes to This Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will notify you of significant changes by posting a notice on our platform or sending an email to your registered address. Your continued use of FarmerSanthe after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">10. Governing Law</h2>
            <p className="text-gray-600">
              This Privacy Policy is governed by and construed in accordance with the laws of India, including the Information Technology Act, 2000 and its associated rules. Any disputes arising under this policy shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka, India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">11. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
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
