import { Printer, ArrowLeft } from 'lucide-react';

interface ServiceDeskCVProps {
  onBack: () => void;
}

export function ServiceDeskCV({ onBack }: ServiceDeskCVProps) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .cv-wrap * { font-family: 'Inter', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }

        @media print {
          .no-print { display: none !important; }
          html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
          nav { display: none !important; }
          .cv-shell { padding: 0 !important; background: white !important; }
          .cv-doc { width: 100%; max-width: 100%; margin: 0 !important; box-shadow: none !important; border-radius: 0 !important; }
          .pg2 { page-break-before: always; }
        }

        @page { margin: 12mm 14mm; size: A4; }

        .cv-tag {
          display: inline-block;
          border: 1px solid #e5e7eb;
          border-radius: 3px;
          padding: 2px 7px;
          font-size: 11px;
          color: #374151;
          margin: 2px 2px 2px 0;
          background: #fafafa;
        }

        .cv-bar {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .cv-bar::before {
          content: '';
          display: block;
          width: 2.5px;
          min-height: 15px;
          border-radius: 2px;
          background: #2563eb;
          flex-shrink: 0;
          margin-top: 3px;
        }

        .lbl {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #111827;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 4px;
          margin-bottom: 10px;
        }

        .job-title { font-size: 14px; font-weight: 700; color: #111827; }
        .job-meta  { font-size: 11.5px; color: #6b7280; margin-bottom: 7px; }
        .bullet    { font-size: 12px; color: #374151; line-height: 1.6; }
        .proj-title { font-size: 14px; font-weight: 700; color: #111827; }
        .proj-cat   { font-size: 11px; font-weight: 600; color: #2563eb; margin-bottom: 7px; }
      `}</style>

      {/* Shell */}
      <div className="cv-wrap cv-shell min-h-screen bg-neutral-100 pt-24 pb-16">

        {/* Toolbar */}
        <div className="no-print max-w-[840px] mx-auto px-6 mb-5 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-700 transition-colors text-sm font-medium shadow-sm">
            <Printer className="w-4 h-4" /> Save as PDF
          </button>
        </div>

        {/* Document */}
        <div className="cv-doc max-w-[840px] mx-auto bg-white shadow-xl rounded-xl overflow-hidden">

          {/* ══ PAGE 1 ══════════════════════════════════════════ */}
          <div style={{ padding: '34px 38px 32px' }}>

            {/* Header */}
            <div style={{ marginBottom: '14px' }}>
              <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', marginBottom: '6px' }}>
                Angel Agharia
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: '#6b7280' }}>
                <span>Dublin, Ireland</span>
                <span>angelagharia@gmail.com</span>
                <span>+353 89 222 5859</span>
                <span>angelaghariaportfolio.figma.site</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: '16px' }} />

            {/* Profile */}
            <div style={{ borderLeft: '2.5px solid #2563eb', paddingLeft: '13px', marginBottom: '22px' }}>
              <p style={{ fontSize: '12px', color: '#374151', lineHeight: '1.7' }}>
                Analytical graduate with a BSc in Product Design and an MSc in Human-Computer Interaction, with hands-on experience in technical problem diagnosis, structured documentation, and stakeholder communication. Comfortable working across a range of software tools and systems, applying a methodical approach to identifying and resolving issues. Strong communicator who takes full ownership of tasks, collaborates well across teams, and consistently delivers to a high standard in fast-paced environments.
              </p>
            </div>

            {/* Two-column */}
            <div style={{ display: 'grid', gridTemplateColumns: '168px 1fr', gap: '30px' }}>

              {/* ── Sidebar ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                <div>
                  <div className="lbl">Education</div>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '10.5px', color: '#9ca3af', marginBottom: '2px' }}>Sep 2025 – Sep 2026</div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#111827' }}>University College Dublin</div>
                    <div style={{ fontSize: '11.5px', color: '#6b7280', lineHeight: '1.45' }}>MSc Human-Computer Interaction</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10.5px', color: '#9ca3af', marginBottom: '2px' }}>2019 – 2023</div>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#111827' }}>Maynooth University</div>
                    <div style={{ fontSize: '11.5px', color: '#6b7280' }}>BSc in Product Design</div>
                  </div>
                </div>

                <div>
                  <div className="lbl">Skills</div>

                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#374151', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Technical</div>
                    {['HTML / CSS', 'JavaScript', 'React', 'Git', 'Microsoft 365', 'Google Workspace'].map(s => <span key={s} className="cv-tag">{s}</span>)}
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#374151', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tools</div>
                    {['Figma', 'Adobe XD', 'SPSS', 'Excel', 'Data Visualisation'].map(s => <span key={s} className="cv-tag">{s}</span>)}
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#374151', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Analytical</div>
                    {['Troubleshooting', 'Root Cause Analysis', 'Statistical Analysis', 'Documentation'].map(s => <span key={s} className="cv-tag">{s}</span>)}
                  </div>

                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#374151', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delivery</div>
                    {['Stakeholder Comms', 'Agile Delivery', 'Accessibility (WCAG)', 'Usability Testing'].map(s => <span key={s} className="cv-tag">{s}</span>)}
                  </div>
                </div>

              </div>

              {/* ── Main ── */}
              <div>
                <div className="lbl">Work Experience</div>

                {/* Gravitad */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span className="job-title">UX/UI Designer</span>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>Feb 2025 – Present</span>
                  </div>
                  <div className="job-meta">Gravitad (Freelance) · Remote</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {[
                      'Diagnosed and resolved usability and performance issues across digital ad products, improving consistency and reliability across systems',
                      'Built responsive prototypes and wireframes to strict accessibility standards, ensuring solutions worked effectively across varied devices and environments',
                      'Supported a modular design system rollout, maintaining documented standards and reducing recurring issues across the product',
                      'Collaborated with cross-functional stakeholders to gather requirements, align on technical solutions, and deliver on time within agile workflows',
                    ].map((b, i) => (
                      <div key={i} className="cv-bar"><span className="bullet">{b}</span></div>
                    ))}
                  </div>
                </div>

                {/* Emplio */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span className="job-title">UX/UI Intern</span>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>Jan 2024 – May 2024</span>
                  </div>
                  <div className="job-meta">Creative for You (Emplio) · Remote</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {[
                      'Identified and resolved interface and workflow issues through structured usability testing, communicating findings and solutions clearly to stakeholders',
                      'Presented technical decisions with clear rationale, balancing user needs with business requirements',
                      'Produced a documented, scalable UI kit to support consistent system maintenance and reduce future rework',
                    ].map((b, i) => (
                      <div key={i} className="cv-bar"><span className="bullet">{b}</span></div>
                    ))}
                  </div>
                </div>

                {/* Shamrock */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span className="job-title">UX/UI Designer</span>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>Jun 2023 – Present</span>
                  </div>
                  <div className="job-meta">Shamrock Beats (UX + VX) · Remote</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {[
                      'Managed end-to-end digital delivery for a leading dance collective, maintaining reliable and consistent standards across all platforms',
                      'Coordinated multi-stakeholder creative projects, balancing competing priorities with clear communication and dependable delivery',
                      'Developed social and motion-based digital content, monitoring performance and iterating based on feedback',
                    ].map((b, i) => (
                      <div key={i} className="cv-bar"><span className="bullet">{b}</span></div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ══ PAGE 2 ══════════════════════════════════════════ */}
          <div className="pg2" style={{ padding: '34px 38px 34px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '168px 1fr', gap: '30px' }}>

              {/* Sidebar p2 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                <div>
                  <div className="lbl">Languages</div>
                  <p style={{ fontSize: '12px', color: '#374151' }}>English (Fluent)</p>
                </div>

                <div>
                  <div className="lbl">Interests</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', color: '#374151' }}>
                    <span>Basketball (University &amp; Local League)</span>
                    <span>Digital Design &amp; Content Creation</span>
                    <span>Dance (Choreographer &amp; Freestyle)</span>
                  </div>
                </div>

                <div>
                  <div className="lbl">Core Values</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    {[
                      'Irish citizen, open to hybrid & in-office roles',
                      'Strong commitment to quality and confidentiality',
                      'Passion for combining technical rigour with clear, effective communication',
                    ].map((v, i) => (
                      <div key={i} className="cv-bar">
                        <span style={{ fontSize: '11.5px', color: '#374151', lineHeight: '1.55' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Main p2 */}
              <div>
                <div className="lbl">Featured Projects</div>

                {/* Interruption */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span className="proj-title">Interruption Modality Study</span>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>2025 – 2026</span>
                  </div>
                  <div className="proj-cat">HCI Research &amp; Analytics</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {[
                      'Designed and executed a controlled experiment (n=64) analysing how different interruption types affect cognitive performance, managing all data collection and logging throughout',
                      'Performed statistical analysis in SPSS (independent t-test, Cohen\'s d; p < .001, d = 1.86) and produced data visualisations to communicate complex findings clearly to stakeholders',
                      'Translated quantitative results into documented, actionable recommendations for system design improvements',
                    ].map((b, i) => (
                      <div key={i} className="cv-bar"><span className="bullet">{b}</span></div>
                    ))}
                  </div>
                </div>

                {/* Stammer Halo */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span className="proj-title">Stammer Halo</span>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>Sep 2022 – May 2023</span>
                  </div>
                  <div className="proj-cat">Inclusive Product Design</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {[
                      'Led design and development of a wearable assistive device end-to-end, taking full ownership from brief through to tested prototype',
                      'Iterated on hardware and software configurations based on structured testing with 6 participants, resolving issues systematically and documenting outcomes at each stage',
                      'Consulted specialist stakeholders to define technical requirements and validate that the solution met real-world user needs',
                    ].map((b, i) => (
                      <div key={i} className="cv-bar"><span className="bullet">{b}</span></div>
                    ))}
                  </div>
                </div>

                {/* UCD */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span className="proj-title">UCD Campus Collective Project</span>
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>2026</span>
                  </div>
                  <div className="proj-cat">Research &amp; Stakeholder Engagement</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {[
                      'Engaged 180+ students in person and supported collection of 400+ survey responses, managing high-volume interactions professionally and efficiently',
                      'Organised and structured qualitative and quantitative data for follow-up reporting to project stakeholders, ensuring accurate and accessible outputs',
                      'Designed survey questions and engagement materials that made participation quick and accessible for a wide student audience',
                    ].map((b, i) => (
                      <div key={i} className="cv-bar"><span className="bullet">{b}</span></div>
                    ))}
                  </div>
                </div>

                <p style={{ fontSize: '11px', color: '#9ca3af', fontStyle: 'italic' }}>References available upon request</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
