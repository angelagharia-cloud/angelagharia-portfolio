import { Award, FileText, MessageCircle, Target, TrendingUp, Users } from 'lucide-react';

interface Metric {
  icon: 'trending' | 'users' | 'target' | 'award' | 'file-text' | 'message-circle';
  value: string;
  label: string;
  description?: string;
}

interface ImpactSectionProps {
  title?: string;
  subtitle?: string;
  metrics: Metric[];
  gradient?: string;
}

const iconMap = {
  trending: TrendingUp,
  users: Users,
  target: Target,
  award: Award,
  'file-text': FileText,
  'message-circle': MessageCircle,
};

export function ImpactSection({ 
  title = "Impact & Results",
  subtitle = "Measuring success through user feedback and testing outcomes",
  metrics,
  gradient = "from-blue-600 to-purple-600"
}: ImpactSectionProps) {
  return (
    <section className="py-20 bg-gradient-to-br from-neutral-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {title}
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => {
            const Icon = iconMap[metric.icon] ?? Target;
            return (
              <div 
                key={index}
                className="group bg-white border-2 border-neutral-200 rounded-2xl p-8 hover:border-blue-400 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-4xl font-bold text-neutral-900 mb-2">
                  {metric.value}
                </div>
                <div className="text-sm font-semibold text-neutral-700 uppercase tracking-wider mb-2">
                  {metric.label}
                </div>
                {metric.description && (
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {metric.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
