import { AssetCard } from './AssetCard';
import { CroppedAsset } from './CroppedAsset';
import stammerHaloComposite from 'figma:asset/70584962870b894fea48765febd6d84a4869bdb8.png';
import smartMealComposite from 'figma:asset/3b9f3c23bb3085a057bbdfed2dcdb87ccce819ba.png';
import brandingLogo from 'figma:asset/2b322c33996f8a352a9ef4daae3a74fb78312083.png';

interface ImageProcessorProps {
  selectedProject: string | null;
}

export function ImageProcessor({ selectedProject }: ImageProcessorProps) {
  // Define all extracted assets with their metadata and crop coordinates
  // Adjusted to respect natural content boundaries - no text or images cut off
  const assets = [
    // Stammer Halo Project Assets - Longer sections allowed, clean cuts only
    {
      id: 'sh-1',
      project: 'stammer-halo',
      projectLabel: 'Stammer Halo',
      type: 'Device / Wearable + Branding',
      description: 'Hero section with wearable device and project introduction',
      src: stammerHaloComposite,
      segment: 'hero-intro',
      cropData: { startPercent: 0, endPercent: 17 }
    },
    {
      id: 'sh-2',
      project: 'stammer-halo',
      projectLabel: 'Stammer Halo',
      type: 'UI Screens',
      description: 'Mobile app interface - All core screens',
      src: stammerHaloComposite,
      segment: 'ui-screens-complete',
      cropData: { startPercent: 17, endPercent: 38 }
    },
    {
      id: 'sh-3',
      project: 'stammer-halo',
      projectLabel: 'Stammer Halo',
      type: 'Process / Ideation',
      description: 'Sketches, storyboards, and early concepts',
      src: stammerHaloComposite,
      segment: 'sketches-storyboard',
      cropData: { startPercent: 38, endPercent: 50 }
    },
    {
      id: 'sh-4',
      project: 'stammer-halo',
      projectLabel: 'Stammer Halo',
      type: 'Validation Artifact',
      description: 'User testing handout and instructions',
      src: stammerHaloComposite,
      segment: 'handout',
      cropData: { startPercent: 50, endPercent: 56 }
    },
    {
      id: 'sh-5',
      project: 'stammer-halo',
      projectLabel: 'Stammer Halo',
      type: 'Process & Research',
      description: 'Design process and competitive audit',
      src: stammerHaloComposite,
      segment: 'process-audit',
      cropData: { startPercent: 56, endPercent: 69 }
    },
    {
      id: 'sh-6',
      project: 'stammer-halo',
      projectLabel: 'Stammer Halo',
      type: 'Research / Experiments',
      description: 'Research synthesis and affinity mapping',
      src: stammerHaloComposite,
      segment: 'research-synthesis',
      cropData: { startPercent: 69, endPercent: 76 }
    },
    {
      id: 'sh-7',
      project: 'stammer-halo',
      projectLabel: 'Stammer Halo',
      type: 'Validation / Experiment',
      description: 'User testing sessions - All photos',
      src: stammerHaloComposite,
      segment: 'testing-sessions',
      cropData: { startPercent: 76, endPercent: 89 }
    },
    {
      id: 'sh-8',
      project: 'stammer-halo',
      projectLabel: 'Stammer Halo',
      type: 'Device / Prototype',
      description: 'Physical wearable prototypes and iterations',
      src: stammerHaloComposite,
      segment: 'prototypes',
      cropData: { startPercent: 89, endPercent: 100 }
    },

    // SmartMeal Project Assets - Clean boundaries
    {
      id: 'sm-1',
      project: 'smartmeal',
      projectLabel: 'SmartMeal',
      type: 'UI Screen + Context',
      description: 'Project introduction with health tracking UI',
      src: smartMealComposite,
      segment: 'intro',
      cropData: { startPercent: 0, endPercent: 13 }
    },
    {
      id: 'sm-2',
      project: 'smartmeal',
      projectLabel: 'SmartMeal',
      type: 'UI Screen',
      description: 'Solution overview with app interface',
      src: smartMealComposite,
      segment: 'solution',
      cropData: { startPercent: 13, endPercent: 26 }
    },
    {
      id: 'sm-3',
      project: 'smartmeal',
      projectLabel: 'SmartMeal',
      type: 'Research / User Profiles',
      description: 'User personas - Ben and Eric profiles',
      src: smartMealComposite,
      segment: 'personas',
      cropData: { startPercent: 26, endPercent: 38 }
    },
    {
      id: 'sm-4',
      project: 'smartmeal',
      projectLabel: 'SmartMeal',
      type: 'Research / Experiments',
      description: 'Research synthesis wall with sticky notes',
      src: smartMealComposite,
      segment: 'research-wall',
      cropData: { startPercent: 38, endPercent: 50 }
    },
    {
      id: 'sm-5',
      project: 'smartmeal',
      projectLabel: 'SmartMeal',
      type: 'Research Findings',
      description: 'User study interview findings and insights',
      src: smartMealComposite,
      segment: 'interview-findings',
      cropData: { startPercent: 50, endPercent: 63 }
    },
    {
      id: 'sm-6',
      project: 'smartmeal',
      projectLabel: 'SmartMeal',
      type: 'Research Analysis',
      description: 'Detailed analysis spread with data visualization',
      src: smartMealComposite,
      segment: 'analysis-spread-1',
      cropData: { startPercent: 63, endPercent: 76 }
    },
    {
      id: 'sm-7',
      project: 'smartmeal',
      projectLabel: 'SmartMeal',
      type: 'Research Analysis',
      description: 'Additional analysis and research insights',
      src: smartMealComposite,
      segment: 'analysis-spread-2',
      cropData: { startPercent: 76, endPercent: 89 }
    },
    {
      id: 'sm-8',
      project: 'smartmeal',
      projectLabel: 'SmartMeal',
      type: 'Validation / Experiment',
      description: 'Co-design workshop and prototyping session photos',
      src: smartMealComposite,
      segment: 'workshop',
      cropData: { startPercent: 89, endPercent: 100 }
    },

    // Branding
    {
      id: 'brand-1',
      project: 'branding',
      projectLabel: 'Portfolio Branding',
      type: 'Logo / Identity',
      description: 'Personal portfolio branding - Angel Agharia logo mark',
      src: brandingLogo,
      segment: 'logo',
      cropData: { startPercent: 0, endPercent: 100 }
    }
  ];

  // Filter assets based on selected project
  const filteredAssets = selectedProject
    ? assets.filter((asset) => asset.project === selectedProject)
    : assets;

  // Group by project
  const groupedAssets = filteredAssets.reduce((acc, asset) => {
    if (!acc[asset.projectLabel]) {
      acc[asset.projectLabel] = [];
    }
    acc[asset.projectLabel].push(asset);
    return acc;
  }, {} as Record<string, typeof assets>);

  return (
    <div className="space-y-12">
      {Object.entries(groupedAssets).map(([projectLabel, projectAssets]) => (
        <section key={projectLabel} className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-300 pb-3">
            <h2 className="text-neutral-900">{projectLabel}</h2>
            <span className="text-sm text-neutral-500">
              {projectAssets.length} {projectAssets.length === 1 ? 'asset' : 'assets'} extracted
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projectAssets.map((asset) => (
              <CroppedAsset key={asset.id} asset={asset} />
            ))}
          </div>
        </section>
      ))}

      {filteredAssets.length === 0 && (
        <div className="text-center py-12 text-neutral-500">
          No assets found for the selected project.
        </div>
      )}
    </div>
  );
}