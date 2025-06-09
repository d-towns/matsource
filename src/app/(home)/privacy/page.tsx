import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            BlueAgent Privacy Policy
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Effective Date: June 9, 2025
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="text-base leading-7 text-gray-700 space-y-8">
            <p>
              BlueAgent, Inc. (“BlueAgent,” “we,” “us,” or “our”) provides
              AI-powered voice agents that answer and place phone calls on
              behalf of service businesses. This Privacy Policy explains how we
              collect, use, share, and protect information when anyone
              (“User,” “Customer,” “Caller,” or “you”) visits blueagent.co,
              uses our web or mobile apps, or interacts with calls placed
              through our platform (collectively, the “Services”).
            </p>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                1. Scope
              </h3>
              <p className="mt-6">
                <span className="font-semibold">Applies to:</span> all
                visitors, account holders, call participants, and business
                contacts whose data we process in connection with the
                Services.
              </p>
              <p className="mt-4">
                <span className="font-semibold">Does not cover:</span>{' '}
                third-party sites or services we merely link to. Their policies
                govern those interactions.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                2. Categories of Data We Collect
              </h3>
              <div className="mt-6 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                          >
                            Category
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Examples
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Source
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            Account Data
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Name, business name, email, billing address, phone
                            number, login credentials, Twilio sub-account
                            SID/Auth Token
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            Direct from Customer
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            Usage Data
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Log-ins, feature clicks, API calls, browser type, IP
                            address, cookies, device identifiers
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            Automated (website & app)
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            Telecom Events
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            From/To numbers, call SID, duration, carrier codes,
                            SMS body (if SMS add-on enabled)
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            Twilio webhook
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            Call Audio & Transcripts
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Voice recordings, AI-generated transcripts, agent
                            responses
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            Recorded by BlueAgent on Customer’s behalf
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            CRM / Script Content
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Knowledge-base articles, calendars, appointment
                            data, downstream CRM records
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            Synced from Customer-configured integrations
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            Payment Data
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Last four digits of card, expiration, billing ZIP
                            (full card handled by Stripe)
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            Stripe
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            Support Data
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Chat messages, emails, attachments
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            Direct
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <p className="mt-6">
                We intentionally do not ask for or store government-issued IDs,
                full payment card numbers, or biometric markers.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                3. How and Why We Use Data
              </h3>
              <div className="mt-6 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                          >
                            Purpose
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Legal Basis (GDPR) / Business Purpose (US)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="whitespace-normal py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                            Provide, secure, and maintain the Services (e.g.,
                            routing calls, generating AI responses, preventing
                            fraud)
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Contract (Art 6 (1)(b)); Legitimate Interests
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-normal py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                            Train and continuously improve our speech-to-text,
                            intent detection, and response models using
                            aggregated, de-identified data only
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Legitimate Interests
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-normal py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                            Generate usage analytics for Customers (e.g.,
                            first-call resolution rate, booking conversion)
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Contract
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-normal py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                            Send transactional emails (invoices, system alerts)
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Contract
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-normal py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                            Send product updates or marketing (opt-in only where
                            required)
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Consent / Legitimate Interests
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-normal py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                            Comply with law, enforce Terms, defend legal claims
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Legal Obligation (Art 6 (1)(c)); Legitimate
                            Interests
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <p className="mt-6 font-semibold">
                Plain-talk promise: We never sell Customer or Caller data—no
                shady ad networks, period.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                4. Sharing & Disclosure
              </h3>
              <div className="mt-6 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                          >
                            Recipient
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Why & What
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Safeguards
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            Twilio
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Telephony transport metadata, audio streams
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            DPA & SCCs in place
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            OpenAI
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Prompt text, context snippets for response
                            generation
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Enterprise agreement; no training on your
                            proprietary scripts
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            Stripe
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Billing contact info, amount, plan, card token
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            PCI-DSS Level 1
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            Zapier / CRM Integrations
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Transcripts, booking details per Customer mappings
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Each integration governed by its DPA
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            Affiliates & Service Providers
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Cloud hosting, error monitoring, analytics
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Confidentiality + access-minimization
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            Law enforcement / regulators
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Only when legally compelled and narrow in scope
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            We fight over-broad requests
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            Corporate transactions
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Data transfers in mergers, acquisitions
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Contractual continuity of safeguards
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <p className="mt-6">
                We do not allow third-party tracking cookies or behavioral ads
                on authenticated dashboard pages.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                5. Cookies & Similar Tech
              </h3>
              <ul className="mt-6 list-disc list-inside space-y-2">
                <li>
                  <span className="font-semibold">Strictly necessary</span> –
                  login session, CSRF token.
                </li>
                <li>
                  <span className="font-semibold">Functional</span> – remember
                  UI prefs.
                </li>
                <li>
                  <span className="font-semibold">Analytics</span> –
                  privacy-respecting first-party metrics (Plausible). No
                  cross-site advertising cookies.
                </li>
              </ul>
              <p className="mt-4">
                Browser Do-Not-Track signals are respected where technically
                feasible.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                6. Data Retention
              </h3>
              <div className="mt-6 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                          >
                            Data Type
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Default Retention
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Options
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            Call audio & transcripts
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            30 days
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Customer-configurable to 0-365 days; cold-storage
                            add-on for longer
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            Account & billing records
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Life of account + 7 years (tax law)
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            —
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            Logs & telemetry
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            12 months
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Critical security logs kept up to 3 years
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            AI model training artifacts (de-identified)
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Indefinite
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Not linked to Customer or Caller
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <p className="mt-6">
                Deletion requests (see § 8) override these defaults unless
                retention is legally required.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                7. Security Measures
              </h3>
              <ul className="mt-6 list-disc list-inside space-y-2">
                <li>
                  <span className="font-semibold">Encryption</span> – TLS 1.3
                  in transit; AES-256 at rest.
                </li>
                <li>
                  <span className="font-semibold">Least privilege</span> –
                  scoped API keys, role-based access controls.
                </li>
                <li>
                  <span className="font-semibold">Isolation</span> – each
                  Customer gets their own Twilio sub-account; no cross-account
                  mingling of call SIDs or tokens.
                </li>
                <li>
                  <span className="font-semibold">Pen-testing</span> – annual
                  third-party assessment plus continuous vulnerability
                  scanning.
                </li>
                <li>
                  <span className="font-semibold">Incident response</span> –
                  24-hour internal SLA; breach notifications within 72 hours
                  of confirmation as required by law.
                </li>
              </ul>
              <p className="mt-4">
                Remember: no system is perfectly secure. You share
                responsibility by safeguarding your credentials and choosing
                sensible data-retention windows.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                8. Your Rights
              </h3>
              <div className="mt-6 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                          >
                            Region
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Rights & How to Exercise
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            EEA/UK (GDPR)
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Access, rectify, erase, restrict, data portability,
                            object, lodge complaint with DPA. Email
                            privacy@blueagent.co or use in-dashboard request
                            flow.
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            California (CCPA/CPRA)
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Know, delete, correct, opt-out of “sale”/“share” (we
                            don’t sell), limit use of sensitive info. Toll-free:
                            +1 (800) 123-4567.
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            Colorado / Virginia / Other US State Laws
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Similar rights; we honor them.
                          </td>
                        </tr>
                        <tr>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            Marketing Emails
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500">
                            Click “unsubscribe” or update preferences any time.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <p className="mt-6">
                We will verify your identity before fulfilling requests and
                respond within the statutory period (30–45 days, extendable
                once).
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                9. International Transfers
              </h3>
              <p className="mt-6">
                We host data on AWS us-east-1 (N. Virginia) and may replicate
                to us-west-2 (Oregon) for resilience. For EEA/UK data we rely
                on:
              </p>
              <ul className="mt-4 list-disc list-inside space-y-2">
                <li>
                  Standard Contractual Clauses (SCCs) with subprocessors;
                </li>
                <li>
                  Supplementary measures (server-side encryption keys, strict
                  access logging);
                </li>
                <li>
                  Data minimization – most personal data never leaves the
                  Twilio region chosen by Customer (if using Twilio’s Regional
                  SIP).
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                10. Children’s Privacy
              </h3>
              <p className="mt-6">
                BlueAgent is not directed to children under 13 and we do not
                knowingly collect their data. If you believe we have, contact
                us and we’ll delete it.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                11. Automated Decision-Making & Profiling
              </h3>
              <p className="mt-6">
                Our AI agents generate conversational responses automatically,
                but decisions that have legal or significant effects (e.g.,
                appointment confirmations, payments) are ultimately made or
                reviewed by the Customer’s staff. You can request human review
                of any automated outcome.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                12. Changes to This Policy
              </h3>
              <p className="mt-6">
                We may update this Policy from time to time. We’ll post the
                revised version with a new Effective Date and, for material
                changes, provide 30 days’ advance notice via email or in-app
                banner. Continuing to use the Services after the new date means
                you accept the changes.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                13. Contact Us
              </h3>
              <p className="mt-6">
                BlueAgent, Inc.
                <br />
                <address className="not-italic">
                6272 Saginaw Road<br/>
                #1014<br/>
                Grand Blanc, Michigan 48439<br/>
                United States
              </address>
                <br />
                Email:{' '}
                <a
                  href="mailto:support@blueagent.co"
                  className="text-blue-600 hover:underline"
                >
                  support@blueagent.co
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
