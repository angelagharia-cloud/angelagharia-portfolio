import { Printer, ArrowLeft } from 'lucide-react';

interface BakkenCVProps {
  onBack: () => void;
}

export function BakkenCV({ onBack }: BakkenCVProps) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .bb-wrap * { font-family: 'Inter', sans-serif; box-sizing: border-box; margin: 0; padding: 0; }

        @media print {
          .no-print { display: none !important; }
          html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
          nav { display: none !important; }
          .bb-shell { padding: 0 !important; background: white !important; }
          .bb-doc { width: 100%; max-width: 100%; margin: 0 !important; box-shadow: none !important; border-radius: 0 !important; }
          .pg2 { page-break-before: always; }
        }

        @page { margin: 12mm 14mm; size: A4; }

        .bb-tag {
          display: inline-block;
          border: 1px solid #e5e7eb;
          border-radius: 3px;
          padding: 2px 7px;
          font-size: 11px;
          color: #374151;
          margin: 2px 2px 2px 0;
          background: #fafafa;
        }

        .bb-bar {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .bb-bar::before {
          content: '';
          display: block;
          width: 2.5px;
          min-height: 14px;
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
          margin-bottom: 8px;
        }

        .job-title { font-size: 14px; font-weight: 700; color: #111827; }
        .job-meta  { font-size: 11px; color: #6b7280; margin-bottom: 7px; }
        .bullet    { font-size: 12px; color: #374151; line-height: 1.6; }

        .proj-card {
          border-radius: 6px;
          padding: 10px 12px;
          margin-bottom: 10px;
        }
        .proj-card-title { font-size: 13px; font-weight: 700; color: #111827; margin-bottom: 2px; }
        .proj-card-cat   { font-size: 10.5px; font-weight: 600; margin-bottom: 7px; }
      `}</style>

      {/* Shell */}
      <div className="bb-wrap bb-shell min-h-screen bg-neutral-100 pt-24 pb-16">

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
        <div className="bb-doc max-w-[840px] mx-auto bg-white shadow-xl rounded-xl overflow-hidden">

          {/* ══ PAGE 1 ══════════════════════════════════════════ */}
          <div style={{ padding: '30px 36px 28px' }}>

            {/* Header */}
            <div style={{ marginBottom: '12px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', marginBottom: '5px' }}>
                Angel Agharia
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '11.5px', color: '#6b7280' }}>
                <span>Dublin, Ireland</span>
                <span>angelagharia@gmail.com</span>
                <span>+353 89 222 5859</span>
                <span>angelaghariaportfolio.figma.site</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e5e7eb', marginBottom: '14px' }} />

            {/* Profile */}
            <div style={{ borderLeft: '2.5px solid #2563eb', paddingLeft: '12px', marginBottom: '18px' }}>
              <p style={{ fontSize: '11.5px', color: '#374151', lineHeight: '1.65' }}>
                Product designer with a BSc in Product Design and an MSc in Human-Computer Interaction, combining product thinking, interaction design and user research. I work across the full design process: from understanding the problem and conducting research, through user flows, wireframes and prototyping, to iterative testing and a polished, accessible experience. I care about design that is honest, purposeful and grounded in how people actually use things.
              </p>
            </div>

            {/* Two-column */}
            <div style={{ display: 'grid', gridTemplateColumns: '162px 1fr', gap: '28px' }}>

              {/* ── Sidebar ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <div>
                  <div className="lbl">Education</div>
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '2px' }}>Sep 2025 – Sep 2026</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>University College Dublin</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.4' }}>MSc Human-Computer Interaction</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '2px' }}>2019 – 2023</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>Maynooth University</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>BSc in Product Design</div>
                  </div>
                </div>

                <div>
                  <div className="lbl">Skills</div>

                  <div style={{ marginBottom: '9px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#374151', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product Design</div>
                    {['Product thinking', 'Interaction design', 'User flows', 'Rapid prototyping'].map(s => <span key={s} className="bb-tag">{s}</span>)}
                  </div>

                  <div style={{ marginBottom: '9px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#374151', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Design & Systems</div>
                    {['Figma', 'Responsive UI', 'Design systems', 'Accessibility / WCAG'].map(s => <span key={s} className="bb-tag">{s}</span>)}
                  </div>

                  <div style={{ marginBottom: '9px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#374151', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Research & Testing</div>
                    {['User interviews', 'Usability testing', 'Journey mapping', 'Quantitative research'].map(s => <span key={s} className="bb-tag">{s}</span>)}
                  </div>

                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#374151', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Collaboration</div>
                    {['Stakeholder communication', 'Cross-functional teamwork', 'Agile delivery', 'Presenting design rationale'].map(s => <span key={s} className="bb-tag">{s}</span>)}
                  </div>
                </div>

              </div>

              {/* ── Main ── */}
              <div>
                <div className="lbl">Work Experience</div>

                {/* Gravitad */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span className="job-title">UX/UI Designer</span>
                    <span style={{ fontSize: '10.5px', color: '#9ca3af' }}>Feb 2025 – Present</span>
                  </div>
                  <div className="job-meta">Gravitad (Freelance) · Remote</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {[
                      'Designed interfaces and responsive wireframes for digital ad products, balancing user needs and business requirements throughout',
                      'Built and tested interactive prototypes against accessibility standards, iterating based on findings to improve usability across devices',
                      'Contributed to a modular design system and collaborated with cross-functional stakeholders to ship work within agile timelines',
                    ].map((b, i) => (
                      <div key={i} className="bb-bar"><span className="bullet">{b}</span></div>
                    ))}
                  </div>
                </div>

                {/* Emplio */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span className="job-title">UX/UI Intern</span>
                    <span style={{ fontSize: '10.5px', color: '#9ca3af' }}>Jan 2024 – May 2024</span>
                  </div>
                  <div className="job-meta">Creative for You (Emplio) · Remote</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {[
                      'Conducted user research and usability testing to identify friction points, then produced wireflows and interface improvements based on findings',
                      'Presented design decisions and rationale clearly to stakeholders, grounding recommendations in user and business evidence',
                      'Produced a documented Figma UI kit to support consistent design system maintenance and reduce future rework',
                    ].map((b, i) => (
                      <div key={i} className="bb-bar"><span className="bullet">{b}</span></div>
                    ))}
                  </div>
                </div>

                {/* Shamrock */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span className="job-title">UX/UI Designer</span>
                    <span style={{ fontSize: '10.5px', color: '#9ca3af' }}>Jun 2023 – Present</span>
                  </div>
                  <div className="job-meta">Shamrock Beats · Remote</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {[
                      'Designed digital touchpoints and experience-led brand communications for a leading dance collective, maintaining quality across platforms',
                      'Led creative direction across multiple campaigns, working with a range of stakeholders to balance creative vision with practical delivery',
                      'Developed community-facing digital experiences, using performance feedback and audience response to guide iteration',
                    ].map((b, i) => (
                      <div key={i} className="bb-bar"><span className="bullet">{b}</span></div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ══ PAGE 2 ══════════════════════════════════════════ */}
          <div className="pg2" style={{ padding: '30px 36px 30px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '162px 1fr', gap: '28px' }}>

              {/* Sidebar p2 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <div>
                  <div className="lbl">Tools</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {['Figma', 'Adobe XD', 'SPSS', 'Excel', 'Google Workspace', 'Microsoft 365'].map(t => (
                      <span key={t} className="bb-tag">{t}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="lbl">Languages</div>
                  <p style={{ fontSize: '11.5px', color: '#374151' }}>English (Fluent)</p>
                </div>

                <div>
                  <div className="lbl">Interests</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11.5px', color: '#374151' }}>
                    <span>Basketball (University &amp; Local League)</span>
                    <span>Digital Design &amp; Content Creation</span>
                    <span>Dance (Choreographer &amp; Freestyle)</span>
                  </div>
                </div>

                <div>
                  <div className="lbl">Work Rights</div>
                  <p style={{ fontSize: '11.5px', color: '#374151', lineHeight: '1.55' }}>
                    Irish citizen. Open to hybrid and in-office roles.
                  </p>
                </div>

              </div>

              {/* Main p2 */}
              <div>
                <div className="lbl">Projects</div>

                {/* Stammer Halo */}
                <div className="proj-card" style={{ background: '#f5f3ff', borderLeft: '3px solid #7c3aed' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span className="proj-card-title">Stammer Halo</span>
                    <span style={{ fontSize: '10.5px', color: '#9ca3af' }}>Sep 2022 – May 2023</span>
                  </div>
                  <div className="proj-card-cat" style={{ color: '#7c3aed' }}>Physical + Digital Product Design · Accessibility</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {[
                      'Designed a wearable earpiece and companion app to support people who stammer, drawing on lived experience to frame the problem with honesty and precision',
                      'Conducted user interviews to understand needs around trust, dignity and real-world use, translating findings into user flows, wireframes and an iterative app prototype',
                      'Tested with 6 participants across hardware and software configurations, consulting specialist stakeholders to validate that the solution met real user needs',
                    ].map((b, i) => (
                      <div key={i} className="bb-bar"><span className="bullet">{b}</span></div>
                    ))}
                  </div>
                </div>

                {/* Interruption Study */}
                <div className="proj-card" style={{ background: '#eff6ff', borderLeft: '3px solid #2563eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span className="proj-card-title">Interruption Modality Study</span>
                    <span style={{ fontSize: '10.5px', color: '#9ca3af' }}>2025 – 2026</span>
                  </div>
                  <div className="proj-card-cat" style={{ color: '#2563eb' }}>HCI Research · Evidence to Design Recommendations</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {[
                      'Designed and ran a controlled study (n=64) examining how different interruption types affect cognitive performance, managing all data collection throughout',
                      'Performed statistical analysis in SPSS (t-test, Cohen\'s d; p < .001, d = 1.86) and produced data visualisations to communicate findings clearly',
                      'Translated quantitative evidence into actionable design recommendations for system and interface improvements',
                    ].map((b, i) => (
                      <div key={i} className="bb-bar"><span className="bullet">{b}</span></div>
                    ))}
                  </div>
                </div>

                {/* Campus Collective */}
                <div className="proj-card" style={{ background: '#f0fdf4', borderLeft: '3px solid #16a34a' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span className="proj-card-title">UCD Campus Collective</span>
                    <span style={{ fontSize: '10.5px', color: '#9ca3af' }}>2026</span>
                  </div>
                  <div className="proj-card-cat" style={{ color: '#16a34a' }}>User Research · Mixed Methods · Stakeholder Engagement</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {[
                      'Engaged 180+ students in person, supporting collection of 400+ survey responses through clear, accessible participation materials',
                      'Organised qualitative and quantitative data for follow-up stakeholder reporting, capturing both measurable patterns and nuanced student perspectives',
                    ].map((b, i) => (
                      <div key={i} className="bb-bar"><span className="bullet">{b}</span></div>
                    ))}
                  </div>
                </div>

                <p style={{ fontSize: '10.5px', color: '#9ca3af', fontStyle: 'italic', marginTop: '6px' }}>References available upon request</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
