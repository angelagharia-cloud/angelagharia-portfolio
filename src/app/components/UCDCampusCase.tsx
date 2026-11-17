import { 
  CaseStudyLayout, 
  Hero, 
  Section, 
  TextBlock 
} from './CaseStudyLayout';
import { ImpactSection } from './ImpactSection';
import { KeyLearnings } from './KeyLearnings';
import { ToolsUsed } from './ToolsUsed';
import { Users, Lightbulb, ClipboardList, PenTool, BarChart, MessagesSquare } from 'lucide-react';

import ucdImage1 from '../../imports/opt/ucd-synthesis-1600.webp';
import ucdImage2 from '../../imports/opt/ucd-stall-1536.webp';
import ucdImage3 from '../../imports/opt/ucd-wheel-1600.webp';
import { UcdLogo } from './UcdLogo';

export function UCDCampusCase() {
  return (
    <CaseStudyLayout>
      <Hero
        title="UCD Campus Collective"
        subtitle="UX Research & Student Engagement"
        tags={['UX Research', 'Student Engagement', 'Survey Design', 'Qualitative Data']}
        overview="Co-designed and delivered a campus research activation exploring commuter students' sense of belonging at UCD. Through an interactive stall and broad survey outreach, we captured diverse perspectives on the student experience, driving actionable insights for university stakeholders."
        role="UX Researcher & Engagement Lead"
        duration="4 Weeks"
        team="Campus Collective Team"
        gradient="bg-gradient-to-br from-amber-50 to-orange-50"
        icon={<UcdLogo className="w-48 h-48 text-[#003B5C]" />}
      />

      {/* The Challenge & Approach */}
      <Section title="The Challenge & Approach" subtitle="Understanding the commuter student experience">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-8">
            <Users className="w-10 h-10 text-amber-600 mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">The Objective</h3>
            <p className="text-neutral-700 leading-relaxed">
              Commuter students often face unique barriers to feeling a sense of belonging on campus. Our objective was to gather authentic, broad-based student feedback on their daily commuting challenges and their overall connection to the UCD community.
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-8">
            <Lightbulb className="w-10 h-10 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Our Approach</h3>
            <p className="text-neutral-700 leading-relaxed">
              We bypassed traditional, dry survey methods by deploying an interactive, high-energy activation on campus. By gamifying the feedback process, we created a welcoming space where students were excited to share their stories.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <img
              src={ucdImage2}
              alt="Students gathering around the interactive UCD Campus Collective stall"
              className="w-full rounded-xl shadow-lg border border-neutral-200 aspect-[4/3] object-cover object-bottom"
            />
            <p className="text-sm text-neutral-500 text-center">
              Our interactive campus stall capturing student feedback in real-time
            </p>
          </div>
          <div>
            <TextBlock
              heading="Engaging the Community"
              content={[
                "We set up an interactive stall in a high-traffic area, using quick-question prompts and sticker voting to lower the barrier to entry. This tactical placement helped us intercept students during their natural daily routines.",
                "We invited students to spin a wheel for a small prize. It gave us a way to start conversations, and we spoke with over 180 students face to face."
              ]}
            />
          </div>
        </div>
      </Section>

      {/* Methodology & Data Collection */}
      <Section title="Data Collection" subtitle="Combining qualitative interactions with quantitative scale" background="gray">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-neutral-200">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
              <MessagesSquare className="w-6 h-6 text-amber-600" />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">In-Person Engagement</h4>
            <div className="text-3xl font-bold text-amber-600 mb-1">180+</div>
            <p className="text-sm text-neutral-600">Students engaged face-to-face at our stall</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-neutral-200">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <ClipboardList className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">Survey Responses</h4>
            <div className="text-3xl font-bold text-orange-600 mb-1">400+</div>
            <p className="text-sm text-neutral-600">Digital surveys completed by the wider student body</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-neutral-200">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <PenTool className="w-6 h-6 text-red-600" />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">Research Design</h4>
            <div className="text-lg font-bold text-red-600 mb-1">Mixed Methods</div>
            <p className="text-sm text-neutral-600">Combining quick sticker votes with detailed form data</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <TextBlock
              heading="Designing the Research Materials"
              content={[
                "I was responsible for creating accessible and engaging survey questions. The language was intentionally kept informal and relatable to encourage honest responses rather than 'survey fatigue'.",
                "Students used stickers to vote on topics on our response boards. As the votes came in, they could see which concerns they shared with others.",
                "Simultaneously, a Google Form was distributed across digital channels to reach those who couldn't attend the physical stall, securing a robust dataset of 400+ responses."
              ]}
            />
          </div>
          <div className="space-y-4">
            <img
              src={ucdImage3}
              alt="Student researcher engaging with the prize wheel and survey setup"
              className="w-full rounded-xl shadow-lg border border-neutral-200 aspect-[4/3] object-cover"
            />
            <p className="text-sm text-neutral-500 text-center">
              Using gamification (a spinning wheel) to encourage survey participation
            </p>
          </div>
        </div>
      </Section>

      {/* Synthesis & Reporting */}
      <Section title="Synthesis & Reporting" subtitle="Making sense of the data">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <img
              src={ucdImage1}
              alt="Team members organizing and coding qualitative feedback written on paper slips"
              className="w-full rounded-xl shadow-lg border border-neutral-200 aspect-[4/3] object-cover"
            />
            <p className="text-sm text-neutral-500 text-center">
              Thematic analysis of qualitative responses gathered during the activation
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-neutral-900 mb-6">From Notes to Narrative</h3>
            <p className="text-neutral-700 leading-relaxed mb-6">
              We sorted the survey responses, handwritten notes and sticker votes together. Three themes kept coming up: the stress of commuting, campus facilities and finding a place in the campus community.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <BarChart className="w-5 h-5 text-amber-600 mt-1" />
                <span className="text-neutral-700"><strong>Quantitative Structuring:</strong> Cross-referencing survey data to map peak commuting pain points and demographic trends.</span>
              </li>
              <li className="flex items-start gap-3">
                <MessagesSquare className="w-5 h-5 text-amber-600 mt-1" />
                <span className="text-neutral-700"><strong>Qualitative Theming:</strong> Coding handwritten feedback into distinct emotional and logistical categories.</span>
              </li>
              <li className="flex items-start gap-3">
                <ClipboardList className="w-5 h-5 text-amber-600 mt-1" />
                <span className="text-neutral-700"><strong>Stakeholder Reporting:</strong> Packaging these insights into a cohesive narrative to present actionable recommendations to UCD administrators.</span>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Impact */}
      <ImpactSection
        metrics={[
          { icon: 'users', value: '180+', label: 'In-Person Engagements' },
          { icon: 'file-text', value: '400+', label: 'Survey Responses' },
          { icon: 'message-circle', value: 'Mixed', label: 'Methods Approach' },
          { icon: 'target', value: '1', label: 'Cohesive Report' }
        ]}
        gradient="from-amber-600 to-orange-600"
      />

      {/* Tools & Methods */}
      <ToolsUsed
        tools={[
          { name: 'Survey Design', category: 'Research' },
          { name: 'In-Person Moderation', category: 'Engagement' },
          { name: 'Thematic Analysis', category: 'Synthesis' },
          { name: 'Google Forms', category: 'Tools' },
          { name: 'Visual Response Boards', category: 'Materials' },
          { name: 'Gamification', category: 'Strategy' },
          { name: 'Data Organization', category: 'Analysis' },
          { name: 'Stakeholder Reporting', category: 'Communication' }
        ]}
      />

      {/* Key Learnings */}
      <KeyLearnings
        learnings={[
          {
            icon: 'heart',
            title: 'Empathy Drives Engagement',
            description: 'Approaching research with a welcoming, informal tone dramatically increases willingness to participate and yields more honest feedback.'
          },
          {
            icon: 'zap',
            title: 'Gamification Works',
            description: 'Simple incentives and playful mechanics (like sticker voting and prize wheels) effectively break down the initial barrier of "survey fatigue."'
          },
          {
            icon: 'layers',
            title: 'Messy Data is Valuable Data',
            description: 'Handwritten notes and informal chats often capture nuanced emotional insights that rigid multiple-choice questions miss.'
          },
          {
            icon: 'users',
            title: 'Visible Feedback Builds Community',
            description: 'Allowing participants to see others\' responses in real-time validates their own experiences and fosters a spontaneous sense of belonging.'
          }
        ]}
        gradient="from-amber-600 to-orange-600"
      />
    </CaseStudyLayout>
  );
}
