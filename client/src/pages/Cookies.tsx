import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Cookie, Mail } from "lucide-react";

export default function Cookies() {
  return (
    <>
      <Helmet>
        <title>Cookie Policy | FarmerSanthe - Agricultural Marketplace</title>
        <meta
          name="description"
          content="Cookie Policy for FarmerSanthe (farmersanthe.com). Learn what cookies and local storage we use, why we use them, and how you can control them."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          <Cookie className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-green-700">Cookie Policy</h1>
        </div>
        <p className="text-sm text-gray-500 mb-8">
          Effective Date: January 1, 2025 &nbsp;|&nbsp; Last Updated: February 25, 2026
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <p className="text-green-800">
            <strong>About This Policy:</strong> This Cookie Policy explains how FarmerSanthe (operated by SAMSKRUTI AGRO TECH PRIVATE LIMITED) uses cookies and browser local storage when you use our platform at farmersanthe.com. We keep our use of cookies minimal and purposeful — we do not use cookies for advertising or third-party tracking.
          </p>
        </div>

        <div className="prose prose-green max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">1. What Are Cookies?</h2>
            <p className="text-gray-600">
              Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work properly, remember your preferences, and provide a better user experience. FarmerSanthe uses both cookies and browser <strong>local storage</strong> (a similar technology that stores data directly on your browser without expiry, unless cleared).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">2. What We Store and Why</h2>
            <p className="text-gray-600">
              FarmerSanthe uses cookies and local storage strictly for platform functionality. We do not use cookies for advertising or to track you across other websites.
            </p>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">2.1 Essential — Authentication</h3>
            <p className="text-gray-600">
              When you log in, your JWT (JSON Web Token) authentication token is stored in local storage so you stay logged in across page reloads and sessions. This is essential for accessing your account, dashboard, and placing orders. Without this, you would need to log in on every page visit.
            </p>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">2.2 Essential — District Selection</h3>
            <p className="text-gray-600">
              Your selected district is stored in local storage. This is used to filter the product listings shown to you — only products deliverable to your district are displayed. You can change your district at any time from the site header, which updates this stored value.
            </p>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">2.3 Essential — Shopping Cart</h3>
            <p className="text-gray-600">
              Your shopping cart contents are preserved in local storage so your cart is not lost if you navigate away from the page or close your browser tab before completing checkout.
            </p>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">2.4 Functional — User Preferences</h3>
            <p className="text-gray-600">
              Certain preferences such as your last viewed FPO store, language settings, and UI preferences may be stored in local storage to personalise your experience on return visits.
            </p>

            <h3 className="text-lg font-semibold text-gray-700 mt-4">2.5 Analytics</h3>
            <p className="text-gray-600">
              We may use analytics tools to understand how users interact with our platform — such as which pages are most visited and how users navigate through the marketplace. This data is used in anonymised, aggregated form to improve the platform and is not linked to your personal identity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">3. Specific Cookies and Local Storage Keys</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 my-4 text-sm">
                <thead>
                  <tr className="bg-green-100">
                    <th className="py-2 px-4 border-b text-left font-semibold">Name</th>
                    <th className="py-2 px-4 border-b text-left font-semibold">Type</th>
                    <th className="py-2 px-4 border-b text-left font-semibold">Purpose</th>
                    <th className="py-2 px-4 border-b text-left font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b font-mono text-xs">auth_token</td>
                    <td className="py-2 px-4 border-b">Local Storage</td>
                    <td className="py-2 px-4 border-b">Keeps you logged in securely between sessions</td>
                    <td className="py-2 px-4 border-b">Until logout or token expiry</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-2 px-4 border-b font-mono text-xs">selected_district</td>
                    <td className="py-2 px-4 border-b">Local Storage</td>
                    <td className="py-2 px-4 border-b">Stores your selected district for product filtering and delivery fee calculation</td>
                    <td className="py-2 px-4 border-b">Until you change district or clear storage</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b font-mono text-xs">cart</td>
                    <td className="py-2 px-4 border-b">Local Storage</td>
                    <td className="py-2 px-4 border-b">Stores your shopping cart items across sessions</td>
                    <td className="py-2 px-4 border-b">Until cart is cleared or checkout is complete</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-2 px-4 border-b font-mono text-xs">user_preferences</td>
                    <td className="py-2 px-4 border-b">Local Storage</td>
                    <td className="py-2 px-4 border-b">Stores UI preferences and settings</td>
                    <td className="py-2 px-4 border-b">Until cleared by browser</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b font-mono text-xs">session_id</td>
                    <td className="py-2 px-4 border-b">Cookie</td>
                    <td className="py-2 px-4 border-b">Maintains your active browsing session</td>
                    <td className="py-2 px-4 border-b">Session (cleared when browser closes)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">4. Third-Party Cookies</h2>
            <p className="text-gray-600">
              Certain third-party services integrated into FarmerSanthe may set their own cookies:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Cashfree (Payment Gateway):</strong> When you proceed to checkout, Cashfree may set cookies for payment session management and fraud prevention. These are governed by <a href="https://www.cashfree.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Cashfree's Privacy Policy</a>.</li>
              <li><strong>Cloudinary (Image Delivery):</strong> Product and profile images are served via Cloudinary's CDN, which may set performance-related cookies.</li>
            </ul>
            <p className="text-gray-600 mt-2">
              FarmerSanthe does not control third-party cookies. Please refer to the respective third-party privacy policies for details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">5. How to Control Cookies and Local Storage</h2>
            <p className="text-gray-600">
              You can control and delete cookies and local storage through your browser settings. Instructions for common browsers:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                  Google Chrome
                </a>
              </li>
              <li>
                <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                  Apple Safari
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                  Microsoft Edge
                </a>
              </li>
            </ul>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg mt-4">
              <p className="text-amber-900">
                <strong>Please Note:</strong> Clearing local storage will log you out and reset your district selection. Your cart contents will also be cleared. Essential functionality like staying logged in requires local storage to work correctly.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">6. Do Not Track</h2>
            <p className="text-gray-600">
              Some browsers allow you to send a "Do Not Track" (DNT) signal. FarmerSanthe currently does not alter its behaviour in response to DNT signals, as there is no universally accepted standard for how platforms should respond. We remain committed to using data only as described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">7. Changes to This Policy</h2>
            <p className="text-gray-600">
              We may update this Cookie Policy from time to time. Changes will be reflected with an updated "Last Updated" date at the top of this page. Continued use of FarmerSanthe after changes constitutes your acceptance of the revised policy. For significant changes, we will notify you via email or an in-platform notification.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">8. Related Policies</h2>
            <p className="text-gray-600">
              For more information about how we handle your personal data, please review our{" "}
              <Link href="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>.
              For information about our delivery charges, see our{" "}
              <Link href="/shipping" className="text-green-600 hover:underline">Shipping & Delivery Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">9. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
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
