import { BookOpen, Heart, Layers, Lightbulb, Users, Zap } from 'lucide-react';

interface Learning {
  icon: 'lightbulb' | 'heart' | 'zap' | 'book' | 'layers' | 'users';
  title: string;
  description: string;
}

interface KeyLearningsProps {
  learnings: Learning[];
  gradient?: string;
}

const iconMap = {
  lightbulb: Lightbulb,
  heart: Heart,
  zap: Zap,
  book: BookOpen,
  layers: Layers,
  users: Users,
};

export function KeyLearnings({ 
  learnings,
  gradient = "from-purple-600 to-pink-600"
}: KeyLearningsProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={`text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            Key Learnings
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Reflections and insights gained throughout the design process
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {learnings.map((learning, index) => {
            const Icon = iconMap[learning.icon] ?? Lightbulb;
            return (
              <div 
                key={index}
                className="group relative bg-gradient-to-br from-neutral-50 to-white border border-neutral-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-bl-[100px] opacity-50" />
                
                <div className="relative">
                  <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
                    {learning.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {learning.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
