import { 
  CaseStudyLayout, 
  Hero, 
  Section, 
  TextBlock, 
  ImageGrid, 
  FullWidthImage 
} from './CaseStudyLayout';
import { CroppedImage } from './CroppedImage';
import { ScrollableImage } from './ScrollableImage';
import { ImpactSection } from './ImpactSection';
import { KeyLearnings } from './KeyLearnings';
import { ToolsUsed } from './ToolsUsed';
import stammerHaloComposite from 'figma:asset/70584962870b894fea48765febd6d84a4869bdb8.png';
import heroImage1 from 'figma:asset/aa2938d53e8270df61ff3524922a536cda1b07c0.png';
import heroImage2 from 'figma:asset/3edf6f2ac9e5a36d8c201e57ec17c4c0dd36ceb1.png';
import deviceCloseup from 'figma:asset/73841240bd7e1b64388eb5a7fdae58a4dd93c223.png';
import heroTitleImage from 'figma:asset/39af42a9734d392c9666e2e59e79e7852879aee3.png';
import researchImage from 'figma:asset/e59985801d0725b28775cde697a1d188c26fad4a.png';
import deviceFeaturesImage from 'figma:asset/49a0ce44deca5fe0f6adf91930bf9be94b602f43.png';
import userTestingImage from 'figma:asset/aefcdfb2da17aaf1662659a8c3c3448f1ec01a67.png';
import storyboardImage from 'figma:asset/bdd69359093247b03245c65a52ce91ae32ae7ffc.png';
import appInterfaceImage from 'figma:asset/be1044400aa497d8da683fed4bc46180eed9c524.png';
import appFeaturesImage from 'figma:asset/5d3cdcae1f35db924e3d8acd0991774fb1ee86d5.png';
import sketchesImage from 'figma:asset/1f7d6539098d8cc4611f236d092b43fba996b318.png';
import ringSketch from 'figma:asset/a59316503aaf2948a23d86418448f3d46d4b7fe8.png';
import earSketch from 'figma:asset/c786eaecacb1d0e9f65a1c1435eae9d34736ee34.png';
import prototyping3D from 'figma:asset/1322c827c919eeab2d4dac5354d60ffc3728a12c.png';
import makingProcess from 'figma:asset/842d4df08127eb8bc3754af41a6ca6eba209d856.png';
import rhythmQuote from 'figma:asset/89ca726bcb76304692a5b8af884e489194970a27.png';
import prototypeLineup from 'figma:asset/1fe97e61d6abb21e53a31f8b30ccd8dabc45225f.png';
import prototypeCloseup from 'figma:asset/a1e1b333f0a772f7361eddeadb1fd87831874b30.png';
import processCircle from 'figma:asset/7fa7f94c198e04be0ae5cb7ced2273e29e2e3659.png';

export function StammerHaloCase() {
  return (
    <CaseStudyLayout>
      <Hero
        title="Stammer Halo"
        subtitle="Wearable Technology for Speech Confidence"
        tags={['Wearable Design', 'Mobile App', 'User Testing', 'Accessibility']}
        overview="A wearable device and companion mobile application designed to help people who stammer build confidence through real-time biometric feedback, personalized tracking, and supportive tools for speech therapy."
        role="UX Designer & Researcher"
        duration="12 weeks"
        team="Solo Project"
        gradient="bg-gradient-to-br from-blue-50 to-purple-50"
        heroImage={heroTitleImage}
      />

      {/* Project At a Glance */}
      <Section background="white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-700 mb-2">70M</div>
              <p className="text-sm text-neutral-700">People affected by stammering worldwide</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <div className="text-3xl font-bold text-purple-700 mb-2">8</div>
              <p className="text-sm text-neutral-700">User interviews conducted</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="text-3xl font-bold text-green-700 mb-2">6</div>
              <p className="text-sm text-neutral-700">Participants in 2-week testing</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <div className="text-3xl font-bold text-orange-700 mb-2">85%</div>
              <p className="text-sm text-neutral-700">Found device helpful</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Hero Image - Using standalone professional photos */}
      <Section background="white" noPadding>
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <img 
              src={heroImage1} 
              alt="User wearing Stammer Halo device with others"
              className="w-full rounded-2xl shadow-2xl"
            />
            <img 
              src={heroImage2} 
              alt="Side profile view of Stammer Halo wearable device"
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </Section>

      <Section title="The Problem" background="white">
        {/* Problem Statement Highlight */}
        <div className="mb-12 border-l-4 border-blue-600 bg-blue-50 p-8 rounded-r-lg">
          <h3 className="text-2xl text-blue-900 mb-4 font-semibold">The Challenge</h3>
          <p className="text-lg text-blue-800 leading-relaxed">
            How might we provide discreet, real-time support for people who stammer while helping them understand their patterns and build confidence—without adding stigma or drawing unwanted attention?
          </p>
        </div>

        <TextBlock
          content={[
            "Stammering affects approximately 70 million people worldwide, impacting daily communication, professional opportunities, and self-confidence. Existing solutions focus primarily on clinical speech therapy but often lack continuous support in real-world situations.",
            "People who stammer need tools that provide discreet, real-time support during conversations while also helping them understand their patterns and progress over time. The challenge was to design a solution that felt empowering rather than stigmatizing."
          ]}
          columns={2}
        />
      </Section>

      <Section title="Research & Discovery" background="gray">
        {/* Research Overview with highlight */}
        <div className="mb-12 bg-white rounded-xl p-8 shadow-sm border-l-4 border-purple-500">
          <h3 className="text-xl text-neutral-900 mb-4 font-semibold">User Interviews & Secondary Research</h3>
          <p className="text-neutral-700 leading-relaxed">
            Conducted interviews with <strong>8 people who stammer</strong>, <strong>3 speech therapists</strong>, and reviewed academic literature on stammering, anxiety management, and wearable technology. Key insights revealed that stammering severity varies with context, anxiety, and social settings.
          </p>
        </div>

        {/* Design Process Overview */}
        <div className="mt-12 bg-white rounded-2xl p-10 shadow-lg">
          <h3 className="text-2xl text-neutral-900 mb-8 text-center">My Design Process</h3>
          <img 
            src={processCircle} 
            alt="Six-phase design process: Audit, Research, Reframe, Ideate, Validate, Execute"
            className="max-w-3xl mx-auto"
          />
          <p className="text-sm text-neutral-600 text-center mt-6">A human-centered, iterative approach to solving complex accessibility challenges</p>
        </div>

        {/* Expert Research Insight - Full width quote with emphasis */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-2xl">
            <img 
              src={rhythmQuote} 
              alt="Research insight: Speaking rhythmically has been known for centuries to be a fluency-inducing condition for people who stutter"
              className="w-full rounded-xl shadow-lg"
            />
          </div>
          <p className="text-sm text-neutral-600 text-center mt-4 italic">Research-backed insight that informed the core haptic rhythm feature</p>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl text-neutral-900 mb-6">Research Synthesis</h3>
          <img 
            src={researchImage} 
            alt="Research synthesis and affinity mapping"
            className="w-full rounded-2xl shadow-2xl"
          />
          <p className="text-sm text-neutral-600 text-center mt-4">Affinity mapping from user interviews revealing patterns and pain points</p>
        </div>

        <div className="mt-16 bg-white rounded-2xl p-10 shadow-lg">
          <h3 className="text-3xl text-neutral-900 mb-10 text-center">Key Research Findings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <div className="text-4xl">😰</div>
              </div>
              <h4 className="font-semibold text-neutral-900 mb-3 text-lg">Anxiety Trigger</h4>
              <p className="text-neutral-600">Anxiety significantly increases stammering frequency, creating a negative feedback loop that compounds the challenge</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="text-4xl">📊</div>
              </div>
              <h4 className="font-semibold text-neutral-900 mb-3 text-lg">Pattern Awareness</h4>
              <p className="text-neutral-600">Users struggle to identify their own patterns and progress without objective data and visualization</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="text-4xl">🤫</div>
              </div>
              <h4 className="font-semibold text-neutral-900 mb-3 text-lg">Discretion Matters</h4>
              <p className="text-neutral-600">Any assistive device must be subtle to avoid drawing unwanted attention or social stigma</p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Ideation & Sketching" background="white">
        <TextBlock
          content="Explored multiple form factors including rings, necklaces, and wrist-worn devices. The wearable needed to measure heart rate and provide haptic feedback without being obtrusive. Early sketches focused on balancing functionality with discretion."
        />

        {/* Creative layout: sketches in a magazine-style grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Large sketch on left */}
          <div className="md:col-span-7">
            <img 
              src={ringSketch} 
              alt="Detailed annotated sketch of ring wearable form factor"
              className="w-full h-full object-cover rounded-lg shadow-lg bg-white p-4"
            />
          </div>

          {/* Stacked sketches on right */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
              <h4 className="text-sm font-medium text-neutral-900 mb-2">Design Considerations</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>✓ 6cm diameter for comfort</li>
                <li>✓ Earpiece integration</li>
                <li>✓ Controller placement</li>
                <li>✓ Sensor positioning</li>
              </ul>
            </div>
            
            <div>
              <img 
                src={earSketch} 
                alt="Earpiece wearable concept sketch"
                className="w-full h-auto rounded-lg shadow-lg bg-white p-4"
              />
            </div>
          </div>
        </div>

        {/* User journey storyboard - Full width */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
            <h3 className="text-xl text-neutral-900 mb-4">User Journey</h3>
            <img 
              src={storyboardImage} 
              alt="User journey storyboard showing the Stammer Halo experience"
              className="w-full rounded-lg shadow-lg"
            />
            <p className="text-sm text-neutral-600 text-center mt-4">Storyboard illustrating the user journey from problem discovery to increased confidence</p>
          </div>
        </div>

        {/* Multi-form factor exploration */}
        <div className="mt-12">
          <h3 className="text-xl text-neutral-900 mb-6">Form Factor Exploration</h3>
          <img 
            src={sketchesImage} 
            alt="Early wearable device sketches exploring different form factors"
            className="w-full rounded-lg shadow-lg"
          />
          <p className="text-sm text-neutral-600 text-center mt-3">Exploring various wearable form factors: rings, bracelets, and earpieces</p>
        </div>
      </Section>

      <Section title="The Solution" background="gray">
        {/* Solution Overview - Hero Statement */}
        <div className="mb-16 text-center max-w-4xl mx-auto">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium mb-6">
            Final Design
          </div>
          <h3 className="text-3xl text-neutral-900 mb-6">Wearable Device + Mobile App Ecosystem</h3>
          <p className="text-lg text-neutral-700 leading-relaxed">
            Stammer Halo consists of a discreet wrist-worn device that monitors biometric signals (heart rate, skin conductance) 
            and provides gentle haptic feedback during moments of elevated anxiety. The companion mobile app offers personalized 
            insights, progress tracking, and exercises from speech therapy.
          </p>
        </div>

        {/* Device features showcase - Asymmetric layout */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <img 
              src={deviceFeaturesImage} 
              alt="Device features - smart ring, earpiece, and app connectivity"
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
              <div className="text-3xl mb-3">⌚</div>
              <h4 className="text-lg font-semibold text-neutral-900 mb-3">Wearable Device</h4>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li>✓ Real-time biometric monitoring</li>
                <li>✓ Subtle haptic breathing guidance</li>
                <li>✓ All-day wear comfort</li>
                <li>✓ Waterproof & durable design</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
              <div className="text-3xl mb-3">📱</div>
              <h4 className="text-lg font-semibold text-neutral-900 mb-3">Mobile App</h4>
              <ul className="space-y-2 text-sm text-neutral-700">
                <li>✓ Pattern recognition & insights</li>
                <li>✓ Progress tracking over time</li>
                <li>✓ Personalized exercises</li>
                <li>✓ Therapy session integration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile app interface - Center spotlight */}
        <div className="mb-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-12">
          <h3 className="text-2xl text-neutral-900 mb-8 text-center">Mobile Experience</h3>
          <div className="max-w-md mx-auto">
            <img 
              src={appInterfaceImage} 
              alt="Mobile app interface with home screen and navigation"
              className="w-full rounded-2xl shadow-2xl border-8 border-white"
            />
          </div>
          <p className="text-sm text-neutral-600 text-center mt-6">Mobile app home screen showing rhythm playback and device connectivity</p>
        </div>

        {/* App features detail - Full width showcase */}
        <div className="mt-16">
          <h3 className="text-2xl text-neutral-900 mb-8 text-center">Key Features</h3>
          <img 
            src={appFeaturesImage} 
            alt="App features - heart rate monitoring, usage monitoring, and vibrating rhythms"
            className="w-full rounded-2xl shadow-2xl"
          />
          <p className="text-sm text-neutral-600 text-center mt-4">Heart rate monitoring, usage tracking, and customizable vibrating rhythms for speech pacing</p>
        </div>
      </Section>

      <Section title="Prototyping & Iteration" background="white">
        <TextBlock
          content="Created functional prototypes of both the wearable device and mobile app. Physical prototypes were built using Arduino and haptic motors to test the feedback mechanism. App prototypes progressed from paper sketches to interactive Figma designs."
        />

        {/* Physical Prototype Showcase - Hero Layout */}
        <div className="mt-12">
          <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-lg p-8">
            <h3 className="text-2xl text-neutral-900 mb-6">Physical Prototype Evolution</h3>
            
            {/* Full lineup of prototypes */}
            <div className="mb-6">
              <img 
                src={prototypeLineup} 
                alt="Complete lineup of physical prototypes in various materials and iterations"
                className="w-full rounded-lg shadow-lg"
              />
              <p className="text-sm text-neutral-600 text-center mt-3">Prototype iterations exploring different materials, sizes, and form factors</p>
            </div>
            
            {/* Close-up detail shot */}
            <div className="max-w-md mx-auto">
              <img 
                src={prototypeCloseup} 
                alt="Close-up of spiral ring prototype showing 3D printing detail"
                className="w-full rounded-lg shadow-lg"
              />
              <p className="text-sm text-neutral-600 text-center mt-3">Detail view of the signature spiral design - 3D printed for haptic motor housing</p>
            </div>
          </div>
        </div>

        {/* Making process in action */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img 
              src={makingProcess} 
              alt="Hands-on prototyping and making process"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
          <div>
            <img 
              src={prototyping3D} 
              alt="3D printed ring prototypes showing iterations"
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
        <p className="text-sm text-neutral-600 text-center mt-3">Physical prototyping: hands-on making process and 3D printed iterations of the ring device</p>

        <div className="mt-8">
          <CroppedImage
            src={stammerHaloComposite}
            startPercent={89}
            endPercent={100}
            alt="Physical wearable prototypes and iterations"
            caption="Physical wearable prototypes showing device iterations and testing"
          />
        </div>

        <div className="mt-8">
          <CroppedImage
            src={stammerHaloComposite}
            startPercent={56}
            endPercent={69}
            alt="Design process and competitive audit"
            caption="Design process documentation and competitive analysis"
          />
        </div>
      </Section>

      <Section title="User Testing & Validation" background="gray">
        <TextBlock
          content="Conducted usability testing with participants who stammer over a 2-week period. Participants wore the device during daily activities and provided feedback through diary studies and follow-up interviews."
        />

        {/* Testing Methodology */}
        <div className="mt-12 bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl text-neutral-900 mb-6">Testing Methodology</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-neutral-900 mb-3 text-lg">Participants</h4>
              <ul className="space-y-2 text-neutral-700">
                <li>• <strong>6 participants</strong> who stammer (ages 22-45)</li>
                <li>• <strong>Mixed severity levels</strong> from mild to severe</li>
                <li>• <strong>Diverse backgrounds</strong> including students and working professionals</li>
                <li>• <strong>Various speech therapy experience</strong> from none to ongoing treatment</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-3 text-lg">Study Design</h4>
              <ul className="space-y-2 text-neutral-700">
                <li>• <strong>2-week longitudinal study</strong> with daily device usage</li>
                <li>• <strong>Diary entries</strong> documenting experiences and anxiety levels</li>
                <li>• <strong>Real-world scenarios</strong> including work meetings, social events, phone calls</li>
                <li>• <strong>Follow-up interviews</strong> to gather qualitative feedback</li>
              </ul>
            </div>
          </div>
        </div>

        {/* User Testing Photos */}
        <div className="mt-12">
          <h3 className="text-xl text-neutral-900 mb-6">Testing Sessions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img 
                src={userTestingImage} 
                alt="Participant testing the device in real-world scenario with mobile app companion"
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="grid grid-rows-2 gap-6">
              <CroppedImage
                src={stammerHaloComposite}
                startPercent={76}
                endPercent={82.5}
                alt="User testing session with participant"
                className="h-full object-cover"
              />
              <CroppedImage
                src={stammerHaloComposite}
                startPercent={82.5}
                endPercent={89}
                alt="User testing session documentation"
                className="h-full object-cover"
              />
            </div>
          </div>
          <p className="text-sm text-neutral-600 text-center mt-4">Participants testing the wearable device and app in real-world scenarios</p>
        </div>

        {/* Detailed Testing Results */}
        <div className="mt-12 bg-white rounded-lg p-8 shadow-sm">
          <h3 className="text-2xl text-neutral-900 mb-6">Key Testing Outcomes</h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold mb-2">85%</div>
              <p className="text-blue-50 text-sm">
                Found Device Helpful
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold mb-2">4.3/5</div>
              <p className="text-green-50 text-sm">
                Average Comfort Rating
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold mb-2">67%</div>
              <p className="text-purple-50 text-sm">
                Reported Reduced Anxiety
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex-shrink-0 text-2xl">✅</div>
              <div>
                <h4 className="font-bold text-green-900 mb-1">Most Valued Feature</h4>
                <p className="text-green-800">
                  The rhythmic vibration feedback during moments of tension was praised by all participants. One user noted: "It's like having a supportive friend tapping my shoulder, reminding me to breathe."
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex-shrink-0 text-2xl">💡</div>
              <div>
                <h4 className="font-bold text-blue-900 mb-1">Key Insight</h4>
                <p className="text-blue-800">
                  Users wanted more control over the intensity and pattern of the haptic feedback. I added customizable vibration settings in the app, allowing users to personalize their experience based on context and comfort level.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex-shrink-0 text-2xl">🔧</div>
              <div>
                <h4 className="font-bold text-amber-900 mb-1">Iteration Made</h4>
                <p className="text-amber-800">
                  Three participants found the wearable too noticeable in professional settings. I refined the form factor to be more discreet and explored alternative placement options (ring vs. ear piece) to better fit different social contexts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Accessibility & Design Decisions */}
      <Section title="Accessibility & Design Decisions" background="white">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 lg:p-12 border border-gray-200">
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Designing for people who stammer required deep consideration of accessibility, stigma, and inclusivity. Every decision was made to empower users without drawing unwanted attention:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🤫</span>
                </div>
                <h4 className="font-bold text-gray-900">Discreet Feedback</h4>
              </div>
              <p className="text-gray-700">
                The wearable uses silent haptic vibrations instead of visual or audio cues, ensuring support remains private. Users can receive calming feedback during conversations without anyone else noticing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">⚙️</span>
                </div>
                <h4 className="font-bold text-gray-900">Personalization</h4>
              </div>
              <p className="text-gray-700">
                Every user's stammer is different. The app allows deep customization of feedback intensity, tracking preferences, and trigger patterns, ensuring the device adapts to individual needs rather than forcing a one-size-fits-all approach.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🎯</span>
                </div>
                <h4 className="font-bold text-gray-900">Reduced Cognitive Load</h4>
              </div>
              <p className="text-gray-700">
                During high-stress speaking moments, users need minimal distraction. The device provides gentle, intuitive cues that feel natural and don't require active attention, allowing users to focus on their conversation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">💪</span>
                </div>
                <h4 className="font-bold text-gray-900">Empowerment Over Stigma</h4>
              </div>
              <p className="text-gray-700">
                Language throughout the app focuses on progress and confidence building, not "fixing" or "correcting" speech. The design celebrates small wins and reframes stammering as a natural variation rather than a deficit.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
                <h4 className="font-bold text-gray-900">Multiple Feedback Channels</h4>
              </div>
              <p className="text-gray-700">
                The system uses haptic feedback (vibration), visual tracking in the app, and biometric sensors to provide comprehensive support. This multi-modal approach ensures users with different needs can benefit from the device.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🔒</span>
                </div>
                <h4 className="font-bold text-gray-900">Privacy & Data Security</h4>
              </div>
              <p className="text-gray-700">
                All biometric and speech data is stored locally on the device and app, never sent to external servers. Users have complete control over their information, which is especially important for sensitive health data.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Future Iterations */}
      <Section title="Future Iterations & Next Steps" background="gray">
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100">
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Stammer Halo showed promising results, but there's so much more I'd love to explore with additional time and resources:
          </p>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-6 py-2">
              <h4 className="text-xl font-bold text-gray-900 mb-2">🧠 AI-Powered Pattern Recognition</h4>
              <p className="text-gray-700">
                With more development resources, integrating machine learning could help the device predict high-anxiety moments before they happen, providing proactive support rather than reactive feedback. The device could learn each user's unique triggers over time.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-6 py-2">
              <h4 className="text-xl font-bold text-gray-900 mb-2">🤝 Speech Therapist Integration</h4>
              <p className="text-gray-700">
                I'd love to test adding features that allow speech therapists to access anonymized progress data (with user consent), enabling more informed therapy sessions and better collaboration between clinical support and daily self-management.
              </p>
            </div>

            <div className="border-l-4 border-teal-500 pl-6 py-2">
              <h4 className="text-xl font-bold text-gray-900 mb-2">📱 Expanded Wearable Form Factors</h4>
              <p className="text-gray-700">
                User feedback revealed different preferences for wearable placement. I'd explore developing multiple form factors (ring, earpiece, wristband) so users can choose what feels most comfortable and discreet for their lifestyle.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-6 py-2">
              <h4 className="text-xl font-bold text-gray-900 mb-2">🌍 Community Support Features</h4>
              <p className="text-gray-700">
                Several participants expressed interest in connecting with others who stammer. A thoughtfully designed community space within the app could provide peer support, success story sharing, and mutual encouragement while maintaining complete privacy.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-6 py-2">
              <h4 className="text-xl font-bold text-gray-900 mb-2">🔬 Clinical Validation Study</h4>
              <p className="text-gray-700">
                Partnering with speech therapy clinics to conduct a 6-month clinical study would validate long-term efficacy and potentially support medical device certification, making Stammer Halo eligible for health insurance coverage.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Impact & Results Section */}
      <ImpactSection
        title="Impact & Results"
        subtitle="Validated success through comprehensive user testing and feedback"
        gradient="from-blue-600 to-purple-600"
        metrics={[
          {
            icon: 'users',
            value: '85%',
            label: 'User Satisfaction',
            description: 'Found the haptic feedback helpful during conversations'
          },
          {
            icon: 'trending',
            value: '78%',
            label: 'Confidence Boost',
            description: 'Reported increased speech confidence after 2 weeks'
          },
          {
            icon: 'target',
            value: '92%',
            label: 'App Engagement',
            description: 'Valued pattern insights and progress tracking features'
          },
          {
            icon: 'award',
            value: '6/6',
            label: 'Would Recommend',
            description: 'All participants would recommend to others who stammer'
          }
        ]}
      />

      {/* Key Learnings Section */}
      <KeyLearnings
        gradient="from-blue-600 to-purple-600"
        learnings={[
          {
            icon: 'heart',
            title: 'Empathy Through Co-Design',
            description: 'Involving users throughout the design process was crucial. Their lived experience shaped features I wouldn\'t have considered, like customizable haptic intensity levels and discretion-first design principles.'
          },
          {
            icon: 'lightbulb',
            title: 'Balancing Technology & Simplicity',
            description: 'The most advanced solution isn\'t always the best. Users valued subtlety and ease of use over complex features. This taught me to prioritize user needs over technological possibilities.'
          },
          {
            icon: 'zap',
            title: 'Importance of Longitudinal Testing',
            description: 'Two weeks of testing revealed patterns that wouldn\'t appear in a single session. Longitudinal studies are essential for health-related products to understand real-world impact and behavior change.'
          },
          {
            icon: 'book',
            title: 'Universal Accessibility Principles',
            description: 'Designing for stammering taught me principles applicable to broader accessibility challenges—reducing cognitive load, providing multiple feedback channels, and enabling deep personalization.'
          }
        ]}
      />

      {/* Tools Used Section */}
      <ToolsUsed
        gradient="from-blue-600 to-purple-600"
        tools={[
          { name: 'Figma', category: 'Design & Prototyping' },
          { name: 'Adobe Illustrator', category: 'Design & Prototyping' },
          { name: 'Miro', category: 'Research & Strategy' },
          { name: 'User Interviews', category: 'Research & Strategy' },
          { name: 'Affinity Mapping', category: 'Research & Strategy' },
          { name: 'Journey Mapping', category: 'Research & Strategy' },
          { name: 'Arduino', category: 'Physical Prototyping' },
          { name: '3D Printing', category: 'Physical Prototyping' },
          { name: 'Usability Testing', category: 'Validation' },
          { name: 'Diary Studies', category: 'Validation' }
        ]}
      />

      <Section title="Final Composite" background="white">
        <ScrollableImage
          src={stammerHaloComposite}
          alt="Complete Stammer Halo project overview"
          caption="Full project composite - scroll to explore the entire case study"
          maxHeight="1000px"
        />
      </Section>
    </CaseStudyLayout>
  );
}