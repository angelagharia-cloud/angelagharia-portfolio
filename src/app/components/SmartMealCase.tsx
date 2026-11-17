import lofi1 from "figma:asset/7a43ae9d91cee4fa39cc0a9b403fa9cecbd22db9.png";
import lofi1b from "figma:asset/59ca1fb7503b1f2d53ea96b2f4ee4830a8dd5d2b.png";
import lofi2 from "figma:asset/1c159d640710bbe2848724ab755d35203f9d4740.png";
import personaCharlotte from "figma:asset/9e6b34ca67263ca0bdb717a1595bd7b9e4ccfb84.png";
import personaLeon from "figma:asset/ca5f240ad0b7e922f66b3d28681dc54ad03d2e44.png";
import smartmealLogo from "figma:asset/edb78914b65297d915f33febeaf3ce0529d933d0.png";
import onboardingFlow from "figma:asset/ba7e578e41d763f95a96d276ad661b13342a44c8.png";
import homeNavFlow from "figma:asset/f01bac81f8b076762ee80e4627a473b39a3ffa04.png";
import planMealsFlow from "figma:asset/3e287457da39503e583e0017a72156a914a73e02.png";
import ingredientsFlow from "figma:asset/5b3660a52fd60422ad4330d01ae3ff1f92ecb937.png";
import { ImpactSection } from './ImpactSection';
import { KeyLearnings } from './KeyLearnings';
import { ToolsUsed } from './ToolsUsed';

export function SmartMealCase() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32 relative">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1">
              <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                UX/UI Case Study • Mobile App Design
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
                SmartMeal
              </h1>
              <p className="text-xl lg:text-2xl text-emerald-50 leading-relaxed">
                Empowering students to reduce food waste, save money, and cook sustainably through intelligent meal planning and inventory tracking.
              </p>
            </div>
            <div className="flex-shrink-0">
              <img 
                src={smartmealLogo} 
                alt="SmartMeal logo - a teal bowl with leaves and letter S"
                className="w-48 lg:w-64 drop-shadow-2xl"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        {/* Project Overview */}
        <section className="mb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Project Overview
              </h2>
              <div className="space-y-4 text-lg leading-relaxed text-gray-700">
                <p>
                  <strong className="text-gray-900">The Problem:</strong> I noticed many students (myself included!) end up wasting food, not because we don't care, but because it's genuinely hard to keep track of what's in the fridge, plan meals on a tight budget, and remember what's about to expire.
                </p>
                <p>
                  <strong className="text-gray-900">My Solution:</strong> I designed SmartMeal to be that friend who helps you use what you have. It tracks your ingredients, suggests recipes based on what's expiring soon, generates smart grocery lists tailored to your budget, and even shows you the money and carbon you're saving.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-100">
                <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-4">
                  My Role
                </h3>
                <p className="text-gray-800">
                  I led the entire design process, from initial user research and interviews to wireframing, prototyping, and creating the final hi-fi interactive prototype in Figma.
                </p>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-2xl border border-cyan-100">
                <h3 className="text-sm font-semibold text-cyan-700 uppercase tracking-wider mb-4">
                  Tools & Methods
                </h3>
                <p className="text-gray-800">
                  Figma, user questionnaires and interviews, brainstorming workshops, prototyping
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Problem & Key Insights */}
        <section className="mb-24">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Problem & Key Insights
          </h2>
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100">
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              I surveyed <strong className="text-emerald-600">31 students</strong> and conducted <strong className="text-emerald-600">seven in-depth interviews</strong> at UCD. Here's what really stood out to me:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white p-8 rounded-2xl">
                <div className="text-5xl font-bold mb-2">66.8%</div>
                <p className="text-emerald-50">
                  of students prioritize preventing food waste
                </p>
              </div>

              <div className="bg-gradient-to-br from-rose-500 to-pink-500 text-white p-8 rounded-2xl">
                <div className="text-5xl font-bold mb-2">87.1%</div>
                <p className="text-rose-50">
                  feel guilty when they throw food away
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-8 rounded-2xl">
                <div className="text-5xl font-bold mb-2">76.7%</div>
                <p className="text-amber-50">
                  want recipe generation from unused ingredients
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white p-8 rounded-2xl">
                <div className="text-5xl font-bold mb-2">70%</div>
                <p className="text-blue-50">
                  value smart shopping lists personalized to budget & diet
                </p>
              </div>
            </div>

            <div className="space-y-6 text-gray-700">
              <div className="border-l-4 border-emerald-500 pl-6">
                <h4 className="font-bold text-gray-900 mb-2">Motivators</h4>
                <p>
                  Carbon-savings, money-saved scores, and gamified points were the top incentive mechanisms.
                </p>
              </div>

              <div className="border-l-4 border-teal-500 pl-6">
                <h4 className="font-bold text-gray-900 mb-2">Planning Challenges</h4>
                <p>
                  Many students cook only for themselves and meal-plan frequently, yet still struggle to prepare the right portion sizes and track expiration dates. They use ad-hoc tools (notes, physical planners, Google Keep) which makes planning inconsistent.
                </p>
              </div>

              <div className="border-l-4 border-cyan-500 pl-6">
                <h4 className="font-bold text-gray-900 mb-2">Interview Findings</h4>
                <p>
                  Food often expires because students forget what they have. Participants wanted features that automatically generate recipes and shopping lists based on portion size, dietary needs, budgets, and ingredient expiry dates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Personas Section - Placeholder */}
        <section className="mb-24">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            User Personas
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Two fictional personas were developed from the research to guide design decisions:
          </p>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-3xl border border-purple-100">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Charlotte Schulz</h3>
                <p className="text-purple-700 font-medium">International Master's Student</p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Charlotte really cares about sustainability and actually enjoys cooking. What she needs is a way to keep her meals healthy and affordable while making sure nothing goes to waste. She's organized but needs help tracking when things expire so she can use them in time.
              </p>
              <div className="mt-6 pt-6 border-t border-purple-200">
                <img 
                  src={personaCharlotte} 
                  alt="Persona card image for Charlotte Schulz"
                  className="w-full rounded-2xl shadow-lg border border-gray-200"
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-3xl border border-blue-100">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Leon Kelly</h3>
                <p className="text-blue-700 font-medium">First-Year Irish Student</p>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Leon would honestly rather grab takeout than cook, which means his groceries often end up going bad. He's on a tight budget though, so what he really needs are simple, cheap recipes and gentle reminders to actually use what he's bought before it's too late.
              </p>
              <div className="mt-6 pt-6 border-t border-blue-200">
                <img 
                  src={personaLeon} 
                  alt="Persona card image for Leon Kelly"
                  className="w-full rounded-2xl shadow-lg border border-gray-200"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Ideation & Lo-Fi Prototypes */}
        <section className="mb-24">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Ideation & Lo-Fi Prototypes
          </h2>
          
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 lg:p-12 mb-12 border border-gray-200">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              I explored a bunch of different ideas through brainstorming sessions, but two concepts really stood out. I created lo-fi prototypes for both and got them in front of users to see what actually worked:
            </p>

            {/* Prototype 1 */}
            <div className="mb-16">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Prototype 1: Food Sharing & Swaps
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    My first idea centered on community, letting students share surplus food and swap items with each other through a map and messaging system. It sounded great on paper (free food!), but testing revealed some major issues: people weren't comfortable sharing their location, and the whole thing relied too heavily on others actively posting food.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <img 
                  src={lofi1} 
                  alt="Lo-Fi Prototype 1 - Initial screens showing PrepPro concept with login and main dashboard"
                  className="w-full rounded-2xl shadow-lg border border-gray-200"
                />
                <img 
                  src={lofi1b} 
                  alt="Lo-Fi Prototype 1 - Food tracking and swap features with map interface"
                  className="w-full rounded-2xl shadow-lg border border-gray-200"
                />
              </div>

              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-6">
                <h4 className="font-bold text-amber-900 mb-2">Key Issues Identified:</h4>
                <ul className="list-disc list-inside text-amber-800 space-y-2">
                  <li>Privacy concerns with location disclosure</li>
                  <li>Dependence on other users posting food</li>
                  <li>Need for deletion controls for accidental posts</li>
                  <li>Complexity around image uploading and food description</li>
                </ul>
              </div>
            </div>

            {/* Prototype 2 */}
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Prototype 2: Household-Oriented Planning (Selected)
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    This approach focused on what you actually do in your own kitchen: planning meals, tracking ingredients, and using stuff before it expires. The layout felt immediately familiar, a home screen with clear tiles for each function, plus smart features like recipe generation from what you already have and notifications when food is about to go bad.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <img 
                  src={lofi2} 
                  alt="Lo-Fi Prototype 2 - Home screen and main navigation showing selected design direction"
                  className="w-full rounded-2xl shadow-lg border border-gray-200"
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                <h4 className="font-bold text-emerald-900 mb-2">Why Prototype 2 Was Chosen:</h4>
                <ul className="list-disc list-inside text-emerald-800 space-y-2">
                  <li>Login/welcome flow aligned with app-store conventions</li>
                  <li>Rectangular icon layout was intuitive and familiar</li>
                  <li>Plan Meals tile with "+" button made adding meals obvious</li>
                  <li>Streamlined household-oriented functions reduced manual input</li>
                  <li>Better balance between user control and automated suggestions</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Final Design & Functionality */}
        <section className="mb-24">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Final Design & Functionality
          </h2>
          
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100 mb-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              The hi-fi prototype introduced a cohesive end-to-end flow for SmartMeal with these core features:
            </p>

            {/* Interactive Prototype Link */}
            <div className="mb-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                ✨ Try the Interactive Prototype
              </h3>
              <p className="text-emerald-50 mb-6 max-w-2xl mx-auto">
                Click through the full SmartMeal experience, from onboarding to meal planning to tracking your sustainability progress. I'd love for you to see how it all comes together!
              </p>
              <a
                href="https://www.figma.com/proto/3PxMPFs0oGbXB2HLTHV3az/Hi-Fi-Prototype?node-id=0-1&p=f&t=fMrCa3vLVPZoUABn-0&scaling=scale-down&content-scaling=fixed&starting-point-node-id=302%3A5778&show-proto-sidebar=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:bg-emerald-50 hover:shadow-xl transition-all duration-300 group"
              >
                Explore the Prototype
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            <div className="grid gap-6">
              {/* Home Screen */}
              <div className="border-l-4 border-emerald-500 pl-6 py-2">
                <h4 className="text-xl font-bold text-gray-900 mb-2">🏠 Home Screen</h4>
                <p className="text-gray-700">
                  Displays quick-access tiles for Plan Meals, Smart Grocery List, Ingredients, and Use Soon. A notification badge on Use Soon signals when items are nearing expiry.
                </p>
              </div>

              {/* Plan Meals */}
              <div className="border-l-4 border-teal-500 pl-6 py-2">
                <h4 className="text-xl font-bold text-gray-900 mb-2">🍽️ Plan Meals</h4>
                <p className="text-gray-700">
                  Users can add meals manually or generate recipes based on budget, dietary preferences, and ingredients on hand.
                </p>
              </div>

              {/* Smart Grocery List */}
              <div className="border-l-4 border-cyan-500 pl-6 py-2">
                <h4 className="text-xl font-bold text-gray-900 mb-2">🛒 Smart Grocery List</h4>
                <p className="text-gray-700">
                  Automatically compiles ingredients from selected recipes and allows users to tick off items as they shop. It calculates a running total and suggests cheaper alternatives where available.
                </p>
              </div>

              {/* Ingredients */}
              <div className="border-l-4 border-blue-500 pl-6 py-2">
                <h4 className="text-xl font-bold text-gray-900 mb-2">🥕 Ingredients</h4>
                <p className="text-gray-700">
                  Serves as the user's inventory, storing items along with expiration dates. Users can filter by "Use Soon" or "Recently Added" and add items via barcode scanning.
                </p>
              </div>

              {/* Use Soon */}
              <div className="border-l-4 border-rose-500 pl-6 py-2">
                <h4 className="text-xl font-bold text-gray-900 mb-2">⏰ Use Soon</h4>
                <p className="text-gray-700">
                  Highlights ingredients approaching expiry, encouraging users to prioritize those items and suggesting relevant recipes.
                </p>
              </div>

              {/* Progress Report */}
              <div className="border-l-4 border-purple-500 pl-6 py-2">
                <h4 className="text-xl font-bold text-gray-900 mb-2">📊 Progress Report</h4>
                <p className="text-gray-700">
                  Gamifies sustainability by showing metrics such as CO₂ saved and money saved each week.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 lg:p-12 border border-emerald-100 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">How Everything Connects</h3>
            <p className="text-gray-700 leading-relaxed mb-8">
              One thing I'm really proud of is how the app creates this natural cycle. You pick a recipe, it automatically adds ingredients to your grocery list, those get added to your inventory when you shop, and then the "Use Soon" feature surfaces items before they expire. It's designed to feel effortless, like the app is doing the thinking for you.
            </p>
          </div>

          {/* Hi-Fi Prototype Flows */}
          <div className="space-y-12">
            {/* Onboarding Flow */}
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Onboarding Flow</h3>
              <p className="text-gray-700 mb-6">
                I wanted the first experience to feel welcoming and set expectations right away. The onboarding asks a few quick questions about dietary preferences and budget so the app can personalize recipe suggestions from day one.
              </p>
              <img 
                src={onboardingFlow} 
                alt="Onboarding flow showing welcome screens and introductory questions"
                className="w-full rounded-2xl shadow-lg border border-gray-200"
              />
            </div>

            {/* Home & Navigation */}
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Home Page & Navigation</h3>
              <p className="text-gray-700 mb-6">
                Everything you need is accessible from this central hub. I designed it with big, clear tiles so you can jump straight to planning meals, checking your grocery list, or seeing your sustainability impact without hunting through menus.
              </p>
              <img 
                src={homeNavFlow} 
                alt="Home page and navigation flow showing main dashboard and smart grocery list"
                className="w-full rounded-2xl shadow-lg border border-gray-200"
              />
            </div>

            {/* Plan Meals & Recipes */}
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Plan Meals & Recipe Flow</h3>
              <p className="text-gray-700 mb-6">
                Users can organize their week by meal type, then dive into detailed recipe cards. One feature I'm particularly excited about is that the app highlights which ingredients you already have, so you know exactly what you need to buy. When you finish a meal, you can mark it complete, keeping everything synced with your inventory.
              </p>
              <img 
                src={planMealsFlow} 
                alt="Plan meals screen and recipe details with completion flow"
                className="w-full rounded-2xl shadow-lg border border-gray-200"
              />
            </div>

            {/* Ingredients & Use Soon */}
            <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ingredients Inventory & Use Soon</h3>
              <p className="text-gray-700 mb-6">
                This is where the app really helps prevent waste. The inventory tracks everything in your kitchen with expiry dates, and the "Use Soon" filter brings urgent items front and center with visual badges showing how many days are left. It's a gentle nudge to use things before they go bad.
              </p>
              <img 
                src={ingredientsFlow} 
                alt="Ingredients inventory and use soon filter showing expiring items"
                className="w-full rounded-2xl shadow-lg border border-gray-200"
              />
            </div>
          </div>
        </section>

        {/* Usability Testing Results */}
        <section className="mb-24">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Usability Testing Results
          </h2>
          
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100 mb-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              I conducted moderated usability tests with 6 participants to validate the hi-fi prototype's flows and identify friction points. Here's what I measured:
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white p-6 rounded-2xl text-center">
                <div className="text-4xl font-bold mb-2">100%</div>
                <p className="text-emerald-50 text-sm">
                  Task Completion Rate
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6 rounded-2xl text-center">
                <div className="text-4xl font-bold mb-2">4.7/5</div>
                <p className="text-blue-50 text-sm">
                  Average Ease of Use
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-2xl text-center">
                <div className="text-4xl font-bold mb-2">1m 45s</div>
                <p className="text-purple-50 text-sm">
                  Avg. Time to Add Meal & Generate List
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex-shrink-0 text-2xl">✅</div>
                <div>
                  <h4 className="font-bold text-emerald-900 mb-1">Most Successful Feature</h4>
                  <p className="text-emerald-800">
                    The "Use Soon" notification badge and expiry warnings were immediately understood by all participants, with 5 out of 6 calling it "the most useful feature."
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex-shrink-0 text-2xl">💡</div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Key Insight</h4>
                  <p className="text-blue-800">
                    Users loved the automatic grocery list generation but wanted clearer visual confirmation when ingredients were added from a recipe. I added a brief toast notification to address this.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex-shrink-0 text-2xl">🔧</div>
                <div>
                  <h4 className="font-bold text-amber-900 mb-1">Iteration Made</h4>
                  <p className="text-amber-800">
                    Two users struggled to find the barcode scanner for adding ingredients. I increased the button size and added a subtle pulsing animation on first use to draw attention.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility & Design Decisions */}
        <section className="mb-24">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Accessibility & Design Decisions
          </h2>
          
          <div className="bg-gradient-to-br from-gray-50 to-emerald-50 rounded-3xl p-8 lg:p-12 border border-gray-200">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              I wanted SmartMeal to be usable by everyone, regardless of ability. Here are the intentional choices I made to ensure inclusive design:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🎨</span>
                  </div>
                  <h4 className="font-bold text-gray-900">Color Contrast</h4>
                </div>
                <p className="text-gray-700">
                  All text meets WCAG 2.1 AA standards with a minimum contrast ratio of 4.5:1. Important actions like "Use Soon" badges use high-contrast combinations (red text on white background) for visibility.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">👆</span>
                  </div>
                  <h4 className="font-bold text-gray-900">Touch Targets</h4>
                </div>
                <p className="text-gray-700">
                  All interactive elements (buttons, checkboxes, tiles) are at least 44x44px, meeting iOS and Android accessibility guidelines for easy tapping, especially for users with motor impairments.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🔤</span>
                  </div>
                  <h4 className="font-bold text-gray-900">Readable Typography</h4>
                </div>
                <p className="text-gray-700">
                  I used a minimum font size of 16px for body text and 14px for secondary labels, ensuring readability without requiring zoom. Line height is set to 1.5 for comfortable reading.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🚦</span>
                  </div>
                  <h4 className="font-bold text-gray-900">Status Beyond Color</h4>
                </div>
                <p className="text-gray-700">
                  Expiry warnings use both color (red/amber) and text labels ("2 days left"), ensuring colorblind users can still understand urgency without relying solely on color cues.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📱</span>
                  </div>
                  <h4 className="font-bold text-gray-900">Screen Reader Support</h4>
                </div>
                <p className="text-gray-700">
                  All icons have descriptive labels, and interactive elements include clear ARIA labels. The notification badge on "Use Soon" announces "3 items expiring soon" for screen reader users.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">⚡</span>
                  </div>
                  <h4 className="font-bold text-gray-900">Clear Focus States</h4>
                </div>
                <p className="text-gray-700">
                  Keyboard navigation is fully supported with visible focus indicators (blue outline) on all interactive elements, ensuring users who navigate without a mouse can see where they are.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Future Iterations */}
        <section className="mb-24">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Future Iterations & Next Steps
          </h2>
          
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              While I'm really happy with where SmartMeal landed, there are a few things I'd love to explore further with more time and resources:
            </p>

            <div className="space-y-6">
              <div className="border-l-4 border-emerald-500 pl-6 py-2">
                <h4 className="text-xl font-bold text-gray-900 mb-2">🤝 Household Sharing Features</h4>
                <p className="text-gray-700">
                  Many students live with roommates and share groceries. I'd test adding household accounts where multiple users can contribute to a shared inventory and meal plan, helping groups reduce waste together.
                </p>
              </div>

              <div className="border-l-4 border-teal-500 pl-6 py-2">
                <h4 className="text-xl font-bold text-gray-900 mb-2">🤖 AI-Powered Recipe Suggestions</h4>
                <p className="text-gray-700">
                  With more development resources, integrating a language model could generate personalized recipes that not only use expiring ingredients but also learn from user preferences over time, getting smarter with each meal.
                </p>
              </div>

              <div className="border-l-4 border-cyan-500 pl-6 py-2">
                <h4 className="text-xl font-bold text-gray-900 mb-2">📊 Long-Term Impact Tracking</h4>
                <p className="text-gray-700">
                  I'd love to conduct a longitudinal study with real users over 3-6 months to measure actual food waste reduction and cost savings, validating whether the app creates lasting behavioral change beyond initial engagement.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-6 py-2">
                <h4 className="text-xl font-bold text-gray-900 mb-2">🔗 Grocery Store API Integration</h4>
                <p className="text-gray-700">
                  Partnering with stores like Tesco or Lidl could allow users to order groceries directly from the app, auto-populating their cart with the exact quantities needed. This would remove friction and make the experience truly seamless.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-6 py-2">
                <h4 className="text-xl font-bold text-gray-900 mb-2">🌍 Expanded Sustainability Metrics</h4>
                <p className="text-gray-700">
                  Beyond CO₂ and money saved, I'd explore showing water usage saved, packaging waste avoided, and comparative stats like "You've saved the equivalent of 42 car miles this month!" to make impact even more tangible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact & Results Section */}
        <ImpactSection
          title="Impact & Results"
          subtitle="Research and testing validated the app's potential to create behavioral change"
          gradient="from-emerald-600 to-teal-600"
          metrics={[
            {
              icon: 'users',
              value: '31',
              label: 'Students Surveyed',
              description: 'In-depth research with the target demographic'
            },
            {
              icon: 'target',
              value: '87.1%',
              label: 'Feel Guilt',
              description: 'Students feel guilty throwing away food'
            },
            {
              icon: 'trending',
              value: '76.7%',
              label: 'Want Recipes',
              description: 'Wanted recipe generation from existing ingredients'
            },
            {
              icon: 'award',
              value: '66.8%',
              label: 'Prioritize Waste Reduction',
              description: 'Students actively try to prevent food waste'
            }
          ]}
        />

        {/* Key Learnings Section */}
        <KeyLearnings
          gradient="from-emerald-600 to-teal-600"
          learnings={[
            {
              icon: 'heart',
              title: 'User-Centered Feature Prioritization',
              description: 'People wanted help cooking with food they already had. We shifted our focus from sharing food to tracking ingredients and suggesting recipes.'
            },
            {
              icon: 'lightbulb',
              title: 'Automation Reduces Friction',
              description: 'Manual data entry is a barrier to adoption. Automated flows like generating grocery lists from recipes and surfacing expiring ingredients dramatically improved engagement. This taught me to design for minimal user effort while maximizing value.'
            },
            {
              icon: 'zap',
              title: 'Gamification Drives Engagement',
              description: 'Visual feedback through progress metrics (CO₂ saved, money saved, badges) proved highly motivating. Students responded positively to seeing tangible impact, reinforcing the importance of quantified feedback in behavior-change apps.'
            },
            {
              icon: 'book',
              title: 'Privacy Concerns Override Social Features',
              description: 'People raised privacy concerns when they tried the early food-sharing and location features. That helped us decide which parts of the app should work without sharing personal information.'
            }
          ]}
        />

        {/* Tools Used Section */}
        <ToolsUsed
          gradient="from-emerald-600 to-teal-600"
          tools={[
            { name: 'Figma', category: 'Design & Prototyping' },
            { name: 'Adobe Illustrator', category: 'Design & Prototyping' },
            { name: 'User Surveys', category: 'Research & Strategy' },
            { name: 'User Interviews', category: 'Research & Strategy' },
            { name: 'Persona Development', category: 'Research & Strategy' },
            { name: 'Brainstorming Workshops', category: 'Ideation' },
            { name: 'Lo-Fi Prototyping', category: 'Prototyping' },
            { name: 'Hi-Fi Prototyping', category: 'Prototyping' },
            { name: 'Usability Testing', category: 'Validation' },
            { name: 'User Feedback Analysis', category: 'Validation' }
          ]}
        />

        {/* Closing Statement */}
        <section className="bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-600 text-white rounded-3xl p-12 lg:p-16 text-center">
          <h3 className="text-3xl lg:text-4xl font-bold mb-4">
            A Sustainable Solution for Student Life
          </h3>
          <p className="text-xl text-emerald-50 max-w-3xl mx-auto leading-relaxed">
            SmartMeal addresses a real problem faced by students daily: balancing tight budgets with sustainability goals. By combining intelligent automation with user-centered design, it empowers students to waste less, save more, and cook with confidence.
          </p>
        </section>
      </div>
    </div>
  );
}