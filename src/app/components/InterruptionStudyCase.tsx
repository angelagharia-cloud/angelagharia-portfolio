import { 
  CaseStudyLayout, 
  Hero, 
  Section, 
  TextBlock 
} from './CaseStudyLayout';
import { ImpactSection } from './ImpactSection';
import { KeyLearnings } from './KeyLearnings';
import { ToolsUsed } from './ToolsUsed';
import { BarChart3, Brain, FlaskConical, TrendingUp, Database, Eye, Volume2 } from 'lucide-react';
import resultsImage from 'figma:asset/37356ce8f2ff813250e68a18f762f1b1f411edec.png';
import referencesImage from 'figma:asset/a2debfff0cc0fcf97f6d953c63105be982e50ec4.png';

export function InterruptionStudyCase() {
  return (
    <CaseStudyLayout>
      <Hero
        title="Interruption Modality Study"
        subtitle="HCI Research on Cognitive Load & Task Performance"
        tags={['HCI Research', 'Quantitative Analysis', 'Experimental Design']}
        overview="A controlled experiment investigating how auditory vs. visual interruptions affect task performance during Tetris gameplay. Bridging experimental psychology and HCI, this study revealed that interruption modality significantly impacts cognitive load, providing actionable insights for adaptive notification system design."
        role="Lead Researcher"
        duration="8 weeks"
        team="Solo Research Project"
        gradient="bg-gradient-to-br from-teal-50 to-cyan-50"
      />

      {/* Research Question */}
      <Section title="Research Question" subtitle="Defining the problem space through data">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-8">
            <FlaskConical className="w-10 h-10 text-teal-600 mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Hypothesis</h3>
            <p className="text-neutral-700 leading-relaxed">
              Auditory interruptions are less disruptive than visual interruptions during a high visual-load task (Tetris), because auditory cues use a separate cognitive channel and do not compete for the same visual-spatial resources.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
            <Brain className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Theoretical Framework</h3>
            <p className="text-neutral-700 leading-relaxed">
              Grounded in Wickens' Multiple Resource Theory (2005), which predicts that tasks sharing the same sensory modality compete for cognitive resources, while cross-modal interruptions allow parallel processing with less interference.
            </p>
          </div>
        </div>
      </Section>

      {/* Methodology */}
      <Section title="Methodology" subtitle="Rigorous experimental design for reliable insights" background="gray">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-neutral-200">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-teal-600" />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">Sample Size</h4>
            <div className="text-3xl font-bold text-teal-600 mb-1">n = 32</div>
            <p className="text-sm text-neutral-600">Participants per condition in a between-subjects design</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-neutral-200">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">Independent Variable</h4>
            <div className="text-lg font-bold text-blue-600 mb-1">Interruption Modality</div>
            <p className="text-sm text-neutral-600">Auditory vs. Visual interruption conditions</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-neutral-200">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">Dependent Variable</h4>
            <div className="text-lg font-bold text-purple-600 mb-1">Tetris Score</div>
            <p className="text-sm text-neutral-600">Mean performance score as a measure of disruption</p>
          </div>
        </div>

        <TextBlock
          heading="Experimental Procedure"
          content={[
            "Participants were randomly assigned to either an auditory or visual interruption condition while playing Tetris. The task was chosen because Tetris is a high visual-spatial load activity, making it an ideal context for testing modality-based resource competition.",
            "Data was collected under controlled lab conditions, with each participant completing a standardized gameplay session. Interruptions were delivered at fixed intervals, and Tetris scores were recorded as the primary performance metric."
          ]}
        />
      </Section>

      {/* Statistical Analysis & Results */}
      <Section title="Statistical Analysis & Results" subtitle="Extracting insights through rigorous data analysis">
        <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
          <div>
            <h3 className="text-2xl font-semibold text-neutral-900 mb-6">Key Statistical Findings</h3>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-teal-50 to-teal-100/50 border border-teal-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                  <span className="font-semibold text-neutral-900">Independent Samples t-test</span>
                </div>
                <p className="text-neutral-700 text-sm">
                  t(62) = 7.46, p &lt; .001 (statistically significant)
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-neutral-900">Effect Size</span>
                </div>
                <p className="text-neutral-700 text-sm">
                  Cohen's d = 1.86 (large effect size)
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Volume2 className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-neutral-900">Auditory Condition</span>
                </div>
                <p className="text-neutral-700 text-sm">
                  M = 67.94, SD = 11.05 (auditory interruptions)
                </p>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-neutral-900">Visual Condition</span>
                </div>
                <p className="text-neutral-700 text-sm">
                  M = 46.63, SD = 11.8 (visual interruptions)
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <img
              src={resultsImage}
              alt="Research results showing statistical analysis, descriptive statistics table, and bar chart of Tetris scores by interruption modality"
              className="w-full rounded-xl shadow-lg border border-neutral-200"
            />
            <p className="text-sm text-neutral-500 text-center">
              Results poster with descriptive statistics, bar chart visualization, discussion, and limitations
            </p>
          </div>
        </div>

        {/* Data Visualization Recreation */}
        <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200">
          <h3 className="text-xl font-semibold text-neutral-900 mb-6">Descriptive Statistics Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full max-w-2xl mx-auto">
              <thead>
                <tr className="border-b-2 border-teal-300">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-700">Condition</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-neutral-700">n</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-neutral-700">Mean</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-neutral-700">SD</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-neutral-700">SE</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-neutral-200 bg-teal-50/50">
                  <td className="py-3 px-4 font-medium text-neutral-900">Auditory</td>
                  <td className="py-3 px-4 text-center text-neutral-700">32</td>
                  <td className="py-3 px-4 text-center font-semibold text-teal-700">67.94</td>
                  <td className="py-3 px-4 text-center text-neutral-700">11.05</td>
                  <td className="py-3 px-4 text-center text-neutral-700">1.95</td>
                </tr>
                <tr className="bg-amber-50/50">
                  <td className="py-3 px-4 font-medium text-neutral-900">Visual</td>
                  <td className="py-3 px-4 text-center text-neutral-700">32</td>
                  <td className="py-3 px-4 text-center font-semibold text-amber-700">46.63</td>
                  <td className="py-3 px-4 text-center text-neutral-700">11.8</td>
                  <td className="py-3 px-4 text-center text-neutral-700">2.09</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      {/* Discussion & Implications */}
      <Section title="Discussion & Real-World Implications" subtitle="Translating data insights into design decisions" background="gray">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <TextBlock
              heading="Key Interpretation"
              content={[
                "The null hypothesis was rejected. Auditory interruptions were significantly less disruptive than visual ones during Tetris gameplay (t(62) = 7.46, p < .001, Cohen's d = 1.86).",
                "Wickens' Multiple Resource Theory offers one explanation. Tetris already demands visual attention, so an on-screen interruption competes with the game. A sound uses a different channel."
              ]}
            />
          </div>
          <div>
            <TextBlock
              heading="Design Implications"
              content={[
                "During a visually demanding task like Tetris, a sound may be easier to respond to than an on-screen alert.",
                "A follow-up study could test whether switching between sound and on-screen alerts helps as the visual demands of a task change."
              ]}
            />
          </div>
        </div>

        {/* References */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Relation to Previous Research</h3>
            <ul className="space-y-3 text-neutral-700">
              <li className="pl-4 border-l-3 border-teal-300">
                <strong>Wickens et al. (2005):</strong> Multiple Resource Theory predicts modality-based interference in task performance
              </li>
              <li className="pl-4 border-l-3 border-teal-300">
                <strong>Edwards et al. (2021):</strong> Proactive speech agent design supports choosing modality based on cognitive load
              </li>
              <li className="pl-4 border-l-3 border-teal-300">
                <strong>Warnock et al. (2011):</strong> In low-visual-load tasks, modality differences are smaller
              </li>
              <li className="pl-4 border-l-3 border-teal-300">
                <strong>Zhao et al. (2013):</strong> Visual competition becomes more detrimental in visual-heavy tasks
              </li>
            </ul>
          </div>
          <div>
            <img
              src={referencesImage}
              alt="Academic references for the interruption modality study"
              className="w-full rounded-xl shadow-lg border border-neutral-200"
            />
          </div>
        </div>
      </Section>

      {/* Impact */}
      <ImpactSection
        metrics={[
          { icon: 'trending', value: 't(62) = 7.46', label: 'Statistical Significance' },
          { icon: 'target', value: 'p < .001', label: 'Confidence Level' },
          { icon: 'award', value: 'd = 1.86', label: 'Large Effect Size' },
          { icon: 'users', value: '64', label: 'Total Participants' }
        ]}
        gradient="from-teal-600 to-cyan-600"
      />

      {/* Tools & Methods */}
      <ToolsUsed
        tools={[
          { name: 'SPSS', category: 'Statistical Analysis' },
          { name: 'Excel', category: 'Data Processing' },
          { name: 'Data Visualization', category: 'Reporting' },
          { name: 'Between-Subjects Design', category: 'Methodology' },
          { name: 'Independent t-test', category: 'Analysis' },
          { name: "Cohen's d", category: 'Effect Size' },
          { name: 'Controlled Experiment', category: 'Research Design' },
          { name: 'Academic Writing', category: 'Communication' }
        ]}
      />

      {/* Key Learnings */}
      <KeyLearnings
        learnings={[
          {
            icon: 'lightbulb',
            title: 'Data-Driven Decision Making',
            description: 'Rigorous statistical analysis transforms raw data into actionable design recommendations, bridging the gap between research and practice.'
          },
          {
            icon: 'zap',
            title: 'Experimental Rigour',
            description: 'Controlled experimental design with proper sample sizes and validated measures ensures findings are reliable and generalizable.'
          },
          {
            icon: 'book',
            title: 'Cross-Disciplinary Impact',
            description: 'This study gave me a way to test a design choice: compare two types of alert while people carry out the same task.'
          },
          {
            icon: 'heart',
            title: 'Communicating Insights',
            description: 'Translating complex statistical findings into clear visualizations and actionable recommendations is essential for stakeholder buy-in.'
          }
        ]}
        gradient="from-teal-600 to-cyan-600"
      />
    </CaseStudyLayout>
  );
}