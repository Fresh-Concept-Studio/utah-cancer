export interface ResourcePage {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  eyebrow: string;
  intro: string;
  icon: string;
  html: string;
  relatedLinks: { href: string; label: string }[];
}

export const resourcePages: ResourcePage[] = [
  {
    slug: 'visitorandguestinfo',
    title: 'Visitor & Guest Information',
    seoTitle: 'Visitor & Guest Information | Utah Cancer Specialists',
    description: 'Review visitor guidance for Utah Cancer Specialists clinics, including check-in, illness precautions, and how to confirm current policies.',
    eyebrow: 'Planning your visit',
    intro: 'A comfortable, safe visit starts with knowing what to expect before you arrive.',
    icon: 'groups',
    html: `<h2>Bringing someone with you</h2>
      <p>Patients may bring family members, friends, or caregivers to appointments when space and current clinic guidance allow. Visitors should check in at the front desk and follow instructions from the care team.</p>
      <h2>Help protect patients and staff</h2>
      <p>Please do not visit if you have a fever, cough, sore throat, vomiting, diarrhea, or another potentially contagious illness. If a visitor is essential to your care, call the clinic before arriving so the team can help plan safely.</p>
      <div class="resource-note"><strong>Policies can change.</strong> Call your clinic before your appointment if you need to confirm visitor limits, age requirements, masking, or accessibility accommodations.</div>`,
    relatedLinks: [
      { href: '/locations/index.html', label: 'Find your clinic' },
      { href: '/contact.html', label: 'Contact Utah Cancer Specialists' },
    ],
  },
  {
    slug: 'housing',
    title: 'Housing & Utility Resources',
    seoTitle: 'Housing Resources for Cancer Patients in Utah | UCS',
    description: 'Find Utah housing, rent, utility, and community assistance resources that may help during cancer treatment.',
    eyebrow: 'Practical support',
    intro: 'Cancer treatment can strain a household budget. These Utah programs may help with housing, utilities, and other essentials.',
    icon: 'location_on',
    html: `<h2>Where to start</h2>
      <p>Your Utah Cancer Specialists patient advocate can help you identify programs that fit your circumstances. You can also search statewide resources through <a href="https://211utah.org/" target="_blank" rel="noopener">Utah 211</a>.</p>
      <h2>Housing and utility assistance</h2>
      <ul>
        <li><a href="https://jobs.utah.gov/community/scso/seal/heat.html" target="_blank" rel="noopener">Utah HEAT Program</a> — energy assistance for eligible households.</li>
        <li><a href="https://jobs.utah.gov/assistance/" target="_blank" rel="noopener">Utah Department of Workforce Services assistance</a> — links to food, medical, child care, and financial help.</li>
        <li><a href="https://utahca.org/case-management-housing/" target="_blank" rel="noopener">Utah Community Action housing services</a> — housing case management and help navigating local programs.</li>
        <li><a href="https://mihp.utah.gov/maternal-resource-guide-utah/housing-resources" target="_blank" rel="noopener">Utah housing resource directory</a> — state and community housing programs.</li>
      </ul>
      <div class="resource-note">Eligibility and funding can change. Contact each organization directly for current availability.</div>`,
    relatedLinks: [
      { href: '/supportive-resources/', label: 'All practical support resources' },
      { href: '/programs-and-services.html#patient-advocacy', label: 'Patient advocacy' },
    ],
  },
  {
    slug: 'nutrition',
    title: 'Nutrition During Cancer Treatment',
    seoTitle: 'Nutrition During Cancer Treatment | Utah Cancer Specialists',
    description: 'Nutrition guidance and Utah food assistance resources for people receiving cancer treatment and their families.',
    eyebrow: 'Eating well during treatment',
    intro: 'Good nutrition can help you maintain strength, manage side effects, and support recovery during treatment.',
    icon: 'restaurant',
    html: `<h2>Talk with your care team</h2>
      <p>Cancer and treatment can change appetite, taste, digestion, weight, and the nutrients your body needs. Tell your care team about eating problems or unplanned weight loss. A registered dietitian can help create a plan for your diagnosis, treatment, and symptoms.</p>
      <h2>Trusted nutrition guidance</h2>
      <ul>
        <li><a href="https://www.cancer.org/cancer/supportive-care/nutrition-activity-with-cancer.html" target="_blank" rel="noopener">American Cancer Society: nutrition during and after treatment</a></li>
        <li><a href="https://www.cancer.org/cancer/side-effects/eating-problems.html" target="_blank" rel="noopener">Managing eating and drinking changes</a></li>
        <li><a href="https://www.cancer.org/cancer/side-effects/eating-problems/poor-appetite.html" target="_blank" rel="noopener">Loss of appetite guidance</a></li>
      </ul>
      <h2>Food assistance in Utah</h2>
      <ul>
        <li><a href="https://jobs.utah.gov/customereducation/services/foodstamps/index.html" target="_blank" rel="noopener">Utah SNAP food assistance</a></li>
        <li><a href="https://www.utahfoodbank.org/find-a-pantry/" target="_blank" rel="noopener">Utah Food Bank pantry finder</a></li>
        <li><a href="https://wic.utah.gov/" target="_blank" rel="noopener">Utah WIC</a> for eligible pregnant, postpartum, and breastfeeding people and children under five</li>
        <li><a href="https://211utah.org/" target="_blank" rel="noopener">Utah 211 community resource search</a></li>
      </ul>`,
    relatedLinks: [
      { href: '/supportive-resources/', label: 'All practical support resources' },
      { href: '/supportivecare/', label: 'Supportive care' },
    ],
  },
  {
    slug: 'personalsafety',
    title: 'Personal Safety & Crisis Resources',
    seoTitle: 'Personal Safety & Crisis Resources in Utah | UCS',
    description: 'Find immediate safety, mental health crisis, domestic violence, and Utah community support resources.',
    eyebrow: 'Immediate and confidential help',
    intro: 'If you or someone you care about feels unsafe, confidential help is available now.',
    icon: 'support_agent',
    html: `<div class="resource-emergency"><strong>In immediate danger?</strong><span>Call <a href="tel:911">911</a> now.</span></div>
      <h2>Mental health crisis support</h2>
      <p>Call or text <a href="tel:988">988</a> to reach the 988 Suicide &amp; Crisis Lifeline. It is free, confidential, and available 24 hours a day. You may also <a href="https://988lifeline.org/" target="_blank" rel="noopener">chat online with 988</a>.</p>
      <h2>Domestic violence support</h2>
      <p>Call the Utah Domestic Violence LINKLine at <a href="tel:18008975465">1-800-897-LINK (5465)</a>. The statewide line is available 24/7 and can connect you with shelter, counseling, transportation, advocacy, and other support.</p>
      <h2>Other community help</h2>
      <p>Dial <a href="tel:211">211</a> or visit <a href="https://211utah.org/" target="_blank" rel="noopener">211 Utah</a> for local housing, food, legal, medical, transportation, and mental health resources.</p>`,
    relatedLinks: [
      { href: '/supportive-resources/', label: 'All practical support resources' },
      { href: '/supportivecare/', label: 'Supportive care' },
    ],
  },
  {
    slug: 'cleaning',
    title: 'Home Cleaning Assistance',
    seoTitle: 'Home Cleaning Help for Cancer Patients | UCS',
    description: 'Learn about free home cleaning assistance available to eligible cancer patients through Cleaning for a Reason.',
    eyebrow: 'Help at home',
    intro: 'A national nonprofit may be able to help with home cleaning while you are in treatment or recovering.',
    icon: 'volunteer_activism',
    html: `<h2>Cleaning for a Reason</h2>
      <p>Cleaning for a Reason partners with local residential cleaning companies to provide free general house cleaning to eligible cancer patients in the United States and Canada.</p>
      <p>Patients in active treatment, recovering from cancer surgery or treatment, or receiving hospice care may apply. Service depends on participating cleaning companies in your area.</p>
      <p><a class="resource-button" href="https://cleaningforareason.org/patients/learn-more-apply-now/" target="_blank" rel="noopener">Learn more and apply <span aria-hidden="true">↗</span></a></p>
      <div class="resource-note">This is an independent community program. Utah Cancer Specialists does not determine eligibility or availability.</div>`,
    relatedLinks: [
      { href: '/supportive-resources/', label: 'All practical support resources' },
      { href: '/programs-and-services.html#patient-advocacy', label: 'Patient advocacy' },
    ],
  },
  {
    slug: 'transportation',
    title: 'Transportation Resources',
    seoTitle: 'Transportation Help for Cancer Patients in Utah | UCS',
    description: 'Explore transportation options for cancer appointments, including UTA reduced fares, UTA On Demand, and American Cancer Society rides.',
    eyebrow: 'Getting to care',
    intro: 'Transportation should not stand between you and an appointment. These programs may help you plan a ride.',
    icon: 'location_on',
    html: `<h2>Utah Transit Authority</h2>
      <ul>
        <li><a href="https://uta.rideuta.com/Fares-And-Passes/Individual-Fares/Reduced-Fare" target="_blank" rel="noopener">UTA Reduced Fare</a> offers discounted fares to qualifying riders.</li>
        <li><a href="https://www.rideuta.com/Services/UTA-On-Demand" target="_blank" rel="noopener">UTA On Demand</a> provides curb-to-curb service in designated service zones.</li>
      </ul>
      <h2>American Cancer Society rides</h2>
      <p>The American Cancer Society Road To Recovery program may provide free rides to cancer-related medical appointments when volunteer drivers are available. Call <a href="tel:18002272345">1-800-227-2345</a> or <a href="https://www.cancer.org/support-programs-and-services/road-to-recovery.html" target="_blank" rel="noopener">review the program online</a>. Advance notice is recommended.</p>
      <div class="resource-note">Availability varies by location and date. Ask a patient advocate if you need help exploring transportation options.</div>`,
    relatedLinks: [
      { href: '/supportive-resources/', label: 'All practical support resources' },
      { href: '/locations/index.html', label: 'Clinic locations' },
    ],
  },
  {
    slug: 'dignicap',
    title: 'DigniCap Scalp Cooling',
    seoTitle: 'DigniCap Scalp Cooling | Utah Cancer Specialists',
    description: 'Learn how DigniCap scalp cooling may reduce chemotherapy-related hair loss for eligible patients with solid tumors.',
    eyebrow: 'Support during chemotherapy',
    intro: 'Scalp cooling may reduce the likelihood of chemotherapy-related hair loss for some patients and treatment plans.',
    icon: 'healing',
    html: `<h2>How scalp cooling works</h2>
      <p>DigniCap cools the scalp before, during, and after chemotherapy. Lowering the scalp temperature reduces blood flow and slows activity in hair follicle cells, which may reduce the amount of chemotherapy reaching those cells.</p>
      <h2>Is DigniCap right for you?</h2>
      <p>DigniCap is FDA cleared to reduce the likelihood of chemotherapy-induced hair loss in patients with solid tumors. Results vary, some shedding is expected, and scalp cooling is not appropriate for every diagnosis or chemotherapy regimen.</p>
      <p>Ask your oncology team about eligibility, availability, added treatment time, possible discomfort, hair-care guidance, and cost before deciding.</p>
      <p><a class="resource-button" href="https://dignicap.com/scalp-cooling/" target="_blank" rel="noopener">Learn more from DigniCap <span aria-hidden="true">↗</span></a></p>`,
    relatedLinks: [
      { href: '/treatment-options.html', label: 'Treatment options' },
      { href: '/stories/amy-jensen.html', label: 'Read Amy Jensen’s story' },
    ],
  },
  {
    slug: 'medically-integrated-pharmacy',
    title: 'Medically Integrated Pharmacy',
    seoTitle: 'Medically Integrated Pharmacy | Utah Cancer Specialists',
    description: 'Learn how the Utah Cancer Specialists pharmacy team supports oral cancer medications, authorizations, education, and financial assistance.',
    eyebrow: 'Prescriptions to go',
    intro: 'Our pharmacy team works alongside your cancer care team to make oral medications easier to obtain, understand, and manage.',
    icon: 'medication',
    html: `<h2>Pharmacy support within your care team</h2>
      <p>A medically integrated pharmacy coordinates directly with your oncology team. This helps keep medication information, treatment changes, and questions close to the people managing your care.</p>
      <h2>How the pharmacy team can help</h2>
      <ul>
        <li>Coordinate insurance authorizations for oral cancer medications</li>
        <li>Explore eligible copay and financial assistance programs</li>
        <li>Explain how and when to take your medication</li>
        <li>Review side effects, interactions, storage, and safe handling</li>
        <li>Coordinate refills and communicate treatment changes with your care team</li>
      </ul>
      <div class="resource-note">Medication services and coverage vary by prescription and insurance plan. Ask your care team whether the integrated pharmacy can support your treatment.</div>`,
    relatedLinks: [
      { href: '/programs-and-services.html', label: 'Programs and services' },
      { href: '/patient-resources.html', label: 'Patient resources' },
    ],
  },
  {
    slug: 'supportivecare',
    title: 'Supportive & Palliative Care',
    seoTitle: 'Supportive & Palliative Care | Utah Cancer Specialists',
    description: 'Supportive and palliative care helps Utah Cancer Specialists patients manage symptoms, side effects, emotional needs, and quality of life.',
    eyebrow: 'Care for the whole person',
    intro: 'Supportive care can be part of cancer treatment at any stage, helping patients and families manage symptoms and focus on what matters most.',
    icon: 'favorite',
    html: `<h2>What supportive care can address</h2>
      <ul>
        <li>Pain, fatigue, nausea, appetite changes, sleep problems, and other symptoms</li>
        <li>Side effects related to cancer treatment</li>
        <li>Stress, anxiety, and emotional support for patients and families</li>
        <li>Care goals, priorities, and communication across your care team</li>
        <li>Referrals to insurance, financial, and community resources</li>
      </ul>
      <p>Supportive care is appropriate alongside treatment and does not require stopping cancer-directed care. Ask your oncologist or patient advocate whether a supportive care visit may help.</p>
      <h2>Meet the supportive care team</h2>
      <div class="resource-link-cards">
        <a href="/providers/gary-garner.html"><strong>Gary Garner, MD</strong><span>View provider profile</span></a>
        <a href="/providers/stephanie-ellis.html"><strong>Stephanie Ellis</strong><span>View provider profile</span></a>
      </div>`,
    relatedLinks: [
      { href: '/programs-and-services.html', label: 'Programs and services' },
      { href: '/nutrition/', label: 'Nutrition resources' },
    ],
  },
  {
    slug: 'breathwork-class',
    title: 'SOMA Method Breathwork',
    seoTitle: 'SOMA Method Breathwork Class | Utah Cancer Specialists',
    description: 'Learn about the monthly virtual SOMA Method Breathwork class for Utah Cancer Specialists patients and caregivers.',
    eyebrow: 'Monthly virtual class',
    intro: 'A guided breathing practice offers patients and caregivers a simple way to pause, reconnect, and support stress management.',
    icon: 'favorite',
    html: `<h2>Class details</h2>
      <div class="resource-facts">
        <div><span>When</span><strong>Second Thursday of each month at 7 p.m.</strong></div>
        <div><span>Where</span><strong>Online</strong></div>
        <div><span>Led by</span><strong>Marie Asay</strong></div>
        <div><span>Who can attend</span><strong>Patients and caregivers</strong></div>
      </div>
      <h2>What to expect</h2>
      <p>SOMA Method Breathwork combines rhythmic, mindful breathing with guided relaxation. No prior breathwork experience is required. Join from a quiet place where you can sit or lie down comfortably.</p>
      <p>Call Utah Cancer Specialists at <a href="tel:8012690231">801-269-0231</a> for current class details and the online registration link.</p>`,
    relatedLinks: [
      { href: '/programs-and-services.html', label: 'All programs and services' },
      { href: '/supportivecare/', label: 'Supportive care' },
    ],
  },
  {
    slug: 'low-dose-radiation-therapy-ldrt',
    title: 'Low-Dose Radiation Therapy for Joint Pain',
    seoTitle: 'Low-Dose Radiation Therapy for Joint Pain | UCS',
    description: 'Learn about low-dose radiation therapy for selected painful inflammatory and degenerative joint conditions at Utah Cancer Specialists.',
    eyebrow: 'Low-dose radiation therapy',
    intro: 'For selected patients, low-dose radiation therapy may offer a noninvasive option for persistent pain from certain inflammatory or degenerative conditions.',
    icon: 'radiology',
    html: `<h2>Relief without an injection or incision</h2>
      <p>Low-dose radiation therapy (LDRT) uses a much lower radiation dose than cancer treatment to reduce inflammation in selected benign conditions. Treatment is painless and noninvasive. A typical course may include six short visits over two to three weeks.</p>
      <h2>Conditions that may be evaluated</h2>
      <ul>
        <li>Osteoarthritis affecting the hands, wrists, knees, hips, feet, or ankles</li>
        <li>Selected tendon and soft-tissue conditions</li>
        <li>Dupuytren disease and other qualifying benign conditions</li>
      </ul>
      <p>Eligibility, expected benefit, and potential risks depend on the condition, prior treatment, age, and individual health history. A radiation oncologist will review whether LDRT is appropriate for you.</p>
      <h2>Radiation oncology team</h2>
      <div class="resource-link-cards">
        <a href="/providers/douglas-holt.html"><strong>Douglas Holt, MD</strong><span>View provider profile</span></a>
        <a href="/providers/leland-rogers.html"><strong>C. Leland Rogers, MD</strong><span>View provider profile</span></a>
      </div>
      <p>Treatment consultations are available at <a href="/locations/jordan-valley.html">Jordan Valley Cancer Center</a>.</p>`,
    relatedLinks: [
      { href: '/radiation-oncology.html', label: 'Radiation oncology' },
      { href: '/locations/jordan-valley.html', label: 'Jordan Valley Cancer Center' },
    ],
  },
];
