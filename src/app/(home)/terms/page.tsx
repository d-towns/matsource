import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            BlueAgent Terms of Service
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Effective Date: June 9, 2025
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl">
          <div className="text-base leading-7 text-gray-700 space-y-8">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                1. Acceptance of These Terms
              </h3>
              <p className="mt-6">
                By clicking "I Agree," signing an order form, or using the
                BlueAgent platform in any way, you ("Customer," "you," or
                "your") agree to be bound by (a) these Terms, (b) any Order
                Form that references them, and (c) our Privacy Policy. If you
                don't agree, don't use the Service.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                2. Who Can Use BlueAgent
              </h3>
              <p className="mt-6">
                You must be at least 18 years old and able to form a legally
                binding contract.
              </p>
              <p className="mt-4">
                If you use the Service on behalf of another entity, you
                represent that you have authority to bind that entity to these
                Terms.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                3. What BlueAgent Does
              </h3>
              <p className="mt-6">
                BlueAgent is a software-as-a-service platform that supplies
                AI-powered voice "agents" for inbound and outbound phone calls.
                The product:
              </p>
              <ul className="mt-4 list-disc list-inside space-y-2">
                <li>
                  Answers or initiates calls on the business's phone number
                  24/7.
                </li>
                <li>
                  Uses machine-learning models (OpenAI, proprietary fine-tunes,
                  etc.) to follow your scripts and knowledge base.
                </li>
                <li>
                  Books appointments, writes call notes, updates your CRM, and
                  triggers downstream automations.
                </li>
                <li>
                  Runs on Twilio sub-accounts provisioned for each Customer; we
                  bill you for minutes, messages, and any carrier fees on a
                  passthrough basis plus our SaaS subscription.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                4. Account Registration & Security
              </h3>
              <p className="mt-6">
                You must provide accurate contact, billing, and compliance
                information and keep it up to date.
              </p>
              <p className="mt-4">
                You control your Twilio sub-account SID, Auth Token, and
                verified caller IDs; guard them like cash. Anything done with
                your credentials is on you.
              </p>
              <p className="mt-4">
                You are responsible for all activity occurring under your
                account, including that of your employees, contractors, bots,
                or anyone you give access to.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                5. Subscriptions, Usage Fees & Payment
              </h3>
              <p className="mt-6">
                <span className="font-semibold">Subscription Plans.</span>{' '}
                Plans are month-to-month unless the Order Form says otherwise.
                Each plan includes a concurrency cap (simultaneous calls) and a
                pool of monthly talk-minutes.
              </p>
              <p className="mt-4">
                <span className="font-semibold">Voice & SMS Usage.</span>{' '}
                Minutes and carrier charges in excess of the plan are billed at
                the current overage rates listed on our pricing page. Rates may
                change to track Twilio's wholesale changes; we'll give at
                least 30 days' notice.
              </p>
              <p className="mt-4">
                <span className="font-semibold">Taxes.</span> All fees are
                exclusive of any sales, VAT, or similar taxes, which you must
                pay.
              </p>
              <p className="mt-4">
                <span className="font-semibold">Late Payments.</span> Overdue
                amounts accrue 1.5 % interest per month (or the highest lawful
                rate, if lower). We may suspend the Service for non-payment
                after 10 days' notice.
              </p>
              <p className="mt-4">
                <span className="font-semibold">No Refunds.</span> Except where
                required by law, all fees are non-refundable.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                6. Telephone Numbers & Caller ID
              </h3>
              <p className="mt-6">
                <span className="font-semibold">Provisioning.</span> By default
                we purchase a new local number for you. You may instead port
                an existing number into—or delegate hosted voice/SMS to—Twilio.
              </p>
              <p className="mt-4">
                <span className="font-semibold">Ownership.</span> Telephone
                numbers are ultimately controlled by Twilio and the underlying
                carriers. Number availability is not guaranteed.
              </p>
              <p className="mt-4">
                <span className="font-semibold">Verified Caller ID.</span> If
                you choose to present your own number as caller ID, you must
                complete Twilio's verification workflow.
              </p>
              <p className="mt-4">
                <span className="font-semibold">Compliance.</span> You must
                comply with all telecom regulations (TCPA, CAN-SPAM,
                STIR/SHAKEN, state robocall laws, etc.). We simply transmit
                your calls; we do not supply legal advice or compliance
                guarantees.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                7. Use Restrictions & Acceptable Use
              </h3>
              <p className="mt-6">You agree NOT to:</p>
              <ul className="mt-4 list-disc list-inside space-y-2">
                <li>
                  Use the Service to send unlawful, harassing, fraudulent, or
                  defamatory communications.
                </li>
                <li>
                  Place robocalls to emergency services, hospitals, or any
                  number on a Do-Not-Call registry without a lawful exception.
                </li>
                <li>
                  Attempt to reverse engineer, probe, or breach BlueAgent's or
                  Twilio's security.
                </li>
                <li>
                  Use the Service to build or support a competing product.
                </li>
                <li>
                  Process or store personal data subject to HIPAA, CJIS, or
                  other heightened regimes unless we sign a separate BAA or
                  addendum.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                8. Customer Data & Call Recordings
              </h3>
              <p className="mt-6">
                <span className="font-semibold">Ownership.</span> As between
                the parties, Customer retains all rights in Customer Data (call
                recordings, transcriptions, CRM records, etc.).
              </p>
              <p className="mt-4">
                <span className="font-semibold">License to BlueAgent.</span>{' '}
                You grant us a non-exclusive license to process Customer Data
                solely to provide and improve the Service.
              </p>
              <p className="mt-4">
                <span className="font-semibold">Retention.</span> By default
                call audio and transcripts are stored for 30 days; you can
                request deletion sooner or extended archiving for an additional
                fee.
              </p>
              <p className="mt-4">
                <span className="font-semibold">Security.</span> We follow
                industry-standard technical and organizational measures
                (encryption in transit and at rest, role-based access
                controls, annual penetration testing). No system is 100 %
                secure; you use BlueAgent at your own risk.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                9. AI & Machine-Learning Specific Disclaimers
              </h3>
              <p className="mt-6">
                <span className="font-semibold">Probabilistic Output.</span> AI
                agents can hallucinate or misunderstand user intent. You should
                monitor critical calls and review transcripts.
              </p>
              <p className="mt-4">
                <span className="font-semibold">Training.</span> We may use
                de-identified, aggregated interaction data to retrain models
                and improve accuracy. We will not use proprietary scripts or
                your CRM data to benefit other customers.
              </p>
              <p className="mt-4">
                <span className="font-semibold">Human-in-the-Loop.</span> For
                regulated industries (healthcare, finance, legal), you must
                keep a human review step; BlueAgent is not a substitute for
                professional advice.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                10. Third-Party Services
              </h3>
              <p className="mt-6">
                The Service integrates with Twilio (telephony), OpenAI (LLM
                inference), Zapier (workflow triggers), and optional CRM APIs
                (HubSpot, Salesforce, etc.). Use of any third-party service is
                subject to that provider's terms; BlueAgent is not liable for
                their acts or omissions.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                11. Intellectual Property
              </h3>
              <p className="mt-6">
                BlueAgent and its licensors own all right, title, and interest
                in the Service, including all software, logos, and content
                (except Customer Data).
              </p>
              <p className="mt-4">
                You may not remove or alter proprietary notices or use our
                marks without permission.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                12. Feedback
              </h3>
              <p className="mt-6">
                You grant BlueAgent a perpetual, worldwide, royalty-free
                license to use any suggestions, feedback, or ideas you provide,
                without restriction.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                13. Confidentiality
              </h3>
              <p className="mt-6">
                Each party agrees to protect the other's non-public information
                with at least the same care it uses for its own confidential
                info (and never less than reasonable care) and to use it only
                for performing under these Terms.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                14. Term & Termination
              </h3>
              <p className="mt-6">
                <span className="font-semibold">By You.</span> Cancel inside
                the dashboard or via written notice at least 5 calendar days
                before your next billing date.
              </p>
              <p className="mt-4">
                <span className="font-semibold">By Us.</span> We may suspend or
                terminate if you materially breach these Terms and fail to cure
                within 10 days after notice, or immediately if your breach
                threatens system integrity or violates law.
              </p>
              <p className="mt-4">
                <span className="font-semibold">Effect of Termination.</span>{' '}
                All outstanding fees become immediately due. We will make
                Customer Data exportable for 30 days; then we delete it.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                15. Warranty Disclaimers
              </h3>
              <p className="mt-6 uppercase">
                The Service is provided "as is" and "as available." BlueAgent,
                its suppliers, and licensors disclaim all
                warranties—express, implied, or statutory—including
                merchantability, fitness for a particular purpose, and
                non-infringement. We do not warrant that the service will be
                uninterrupted, error-free, or secure.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                16. Limitation of Liability
              </h3>
              <p className="mt-6 uppercase">
                To the maximum extent permitted by law, BlueAgent's total
                liability for all claims in a calendar year will not exceed the
                amounts you paid us in that year. BlueAgent will not be liable
                for indirect, special, incidental, consequential, punitive, or
                exemplary damages, or for loss of profits, revenue, data, or
                goodwill.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                17. Indemnification
              </h3>
              <p className="mt-6">
                You will defend and indemnify BlueAgent, its officers,
                directors, and employees against any third-party claims arising
                from (a) your violation of these Terms, applicable law, or
                telecom regulations, or (b) Customer Data or your use of the
                Service, including any calls or messages sent by your agents.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                18. Modifications to the Service or Terms
              </h3>
              <p className="mt-6">
                We may modify the Service or these Terms at any time. We'll
                post the revised Terms and update the "Effective Date."
                Material changes will be emailed or shown in-app at least 30
                days before they take effect. Continued use after that means
                acceptance.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                19. Governing Law & Dispute Resolution
              </h3>
              <p className="mt-6">
                <span className="font-semibold">Law.</span> These Terms are
                governed by the laws of the State of Michigan, USA, without
                regard to conflict-of-laws rules.
              </p>
              <p className="mt-4">
                <span className="font-semibold">Arbitration.</span> Any dispute
                arising under or relating to these Terms will be finally
                settled by binding arbitration in Detroit, Michigan, under the
                Commercial Arbitration Rules of the American Arbitration
                Association. Judgment may be entered in any court of competent
                jurisdiction.
              </p>
              <p className="mt-4">
                <span className="font-semibold">Opt-Out.</span> You may opt out
                of arbitration by providing written notice within 30 days of
                accepting these Terms.
              </p>
              <p className="mt-4">
                <span className="font-semibold">Class Action Waiver.</span>{' '}
                Disputes must be arbitrated on an individual basis; class or
                representative actions are prohibited.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                20. Miscellaneous
              </h3>
              <p className="mt-6">
                <span className="font-semibold">Entire Agreement.</span> These
                Terms and any Order Form are the complete agreement and
                supersede all prior proposals.
              </p>
              <p className="mt-4">
                <span className="font-semibold">Force Majeure.</span> Neither
                party is liable for delays or failures due to events beyond its
                reasonable control.
              </p>
              <p className="mt-4">
                <span className="font-semibold">Assignment.</span> You may not
                assign these Terms without our prior written consent; we may
                assign as part of a merger, acquisition, or asset sale.
              </p>
              <p className="mt-4">
                <span className="font-semibold">Severability.</span> If any
                provision is unenforceable, the rest remain in effect.
              </p>
              <p className="mt-4">
                <span className="font-semibold">Waiver.</span> A party's
                failure to enforce a provision is not a waiver of future
                enforcement.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                21. Contact
              </h3>
              <p className="mt-6">
                BlueAgent, Inc.
                <br />
                [Address line]
                <br />
                Grand Rapids, MI 49503 USA
                <br />
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