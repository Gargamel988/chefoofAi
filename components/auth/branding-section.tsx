import { ArrowRight, Bot, Sparkles, Brain } from 'lucide-react';
import { FadeInSlide, JiggleRotate, StaggeredItem } from '@/components/motion';

export const BrandingSection = () => {

    const features: { icon: React.ReactNode, title: string }[] = [
        {
            icon: <Bot />,
            title: "Akıllı algoritma ile kişiselleştirilmiş tarifler",
        },
        {
            icon: <Sparkles />,
            title: "Saniyeler içinde pratik sonuçlar",
        },
        {
            icon: <Brain />,
            title: "Mutfakta sınır tanımayan yaratıcılık",
        }
    ]
    return (
        <FadeInSlide
            className="hidden lg:flex flex-col justify-center space-y-6 text-white"
            direction="left"
            distance={50}
            duration={0.8}
        >
            <div className="space-y-4">
                <JiggleRotate
                    className="inline-block"
                    duration={3}
                    degrees={5}
                >
                    <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-orange-500 to-black border-2 border-orange-500 flex items-center justify-center">
                        <ArrowRight className="w-10 h-10 text-white" />
                    </div>
                </JiggleRotate>

                <h1 className="text-5xl font-bold bg-linear-to-r from-orange-500 via-orange-400 to-orange-600 bg-clip-text text-transparent">
                    Yapay Zeka Şefiniz
                </h1>
                <p className="text-xl text-gray-400">
                    Elinizdeki veya aklınızdaki malzemelerle saniyeler içinde lezzetli tarifler oluşturun.
                </p>
            </div>

            <div className="space-y-4 pt-8">
                {features.map((item, index) => (
                    <StaggeredItem
                        key={index}
                        index={index}
                        className="flex items-center space-x-3 text-gray-300"
                        baseDelay={0.5}
                        delayStep={0.2}
                        distance={20}
                    >
                        <span className="text-2xl text-orange-500 bg-linear-to-br from-orange-500 to-black border-2 border-orange-500 rounded-full p-2">{item.icon}</span>
                        <span className="text-lg font-medium">{item.title}</span>
                    </StaggeredItem>
                ))}
            </div>
        </FadeInSlide>
    );
};
