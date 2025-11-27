import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Trophy, 
  Users, 
  Brain, 
  Volume2, 
  Star,
  Zap,
  Target,
  Award,
  Gamepad2,
  Play,
  Pause,
  CheckCircle2,
  Smartphone,
  ChevronDown,
  LayoutGrid,
  Image
} from "lucide-react";
import mascotImage from "@assets/generated_images/hd_lion_mascot_image.png";
import screenshotImage from "@assets/generated_images/hd_quiz_app_preview.png";
import lionVideo from "@assets/generated_videos/lion_wildlife_video.mp4";
import dolphinsVideo from "@assets/generated_videos/dolphins_ocean_video.mp4";

interface LandingPageProps {
  onStart: () => void;
  isReady: boolean;
}

const animalImages = [
  { src: "/media/mammals/elephant.jpg", alt: "Elephant", pack: "Mammals" },
  { src: "/media/birds/eagle.jpg", alt: "Eagle", pack: "Birds" },
  { src: "/media/sharks/great-white.jpg", alt: "Great White Shark", pack: "Sharks" },
  { src: "/media/big-cats/tiger.jpg", alt: "Tiger", pack: "Big Cats" },
  { src: "/media/jungle/toucan.jpg", alt: "Toucan", pack: "Jungle" },
  { src: "/media/arctic/polar-bear.jpg", alt: "Polar Bear", pack: "Arctic" },
  { src: "/media/reptiles/chameleon.jpg", alt: "Chameleon", pack: "Reptiles" },
  { src: "/media/fish/clownfish.jpg", alt: "Clownfish", pack: "Fish" },
  { src: "/media/amphibians/axolotl.jpg", alt: "Axolotl", pack: "Amphibians" },
  { src: "/media/insects/monarch-butterfly.jpg", alt: "Monarch Butterfly", pack: "Insects" },
];

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

function VideoTile({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden group">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        loop
        muted
        playsInline
      />
      <button
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors"
      >
        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
          {isPlaying ? (
            <Pause className="w-5 h-5 text-primary" />
          ) : (
            <Play className="w-5 h-5 text-primary ml-0.5" />
          )}
        </div>
      </button>
    </div>
  );
}

function VideoCard({ src, title, description }: { src: string; title: string; description: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Card className="overflow-hidden hover-elevate">
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
        />
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
        >
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            {isPlaying ? (
              <Pause className="w-8 h-8 text-primary" />
            ) : (
              <Play className="w-8 h-8 text-primary ml-1" />
            )}
          </div>
        </button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// ========== MASCOT VERSION ==========
function MascotHero({ onStart, isReady }: { onStart: () => void; isReady: boolean }) {
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollHint(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-40 right-20 w-32 h-32 bg-accent/20 rounded-full blur-xl"
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-40 left-1/4 w-24 h-24 bg-secondary/30 rounded-full blur-xl"
            animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
        </div>

        {/* Mascot with floating animation */}
        <motion.div
          className="relative z-10 mb-6"
          animate={floatingAnimation}
        >
          <img
            src={mascotImage}
            alt="Quiz Lion Mascot"
            className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
            data-testid="img-mascot"
          />
          <motion.div
            className="absolute -top-2 -right-2"
            animate={pulseAnimation}
          >
            <Sparkles className="w-10 h-10 text-yellow-500" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-display font-semibold text-foreground mb-2">
            Animal Kingdom
          </h1>
          <p className="text-2xl md:text-4xl font-display font-medium text-primary mb-4">
            Quiz
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
            Learn amazing facts about animals from around the world!
          </p>
        </motion.div>

        {/* Stats badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mt-8 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <Gamepad2 className="w-4 h-4 mr-2" />
            10 Packs
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <Star className="w-4 h-4 mr-2" />
            186 Questions
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <Award className="w-4 h-4 mr-2" />
            20+ Badges
          </Badge>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="mt-10 z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Button
            size="lg"
            onClick={onStart}
            disabled={!isReady}
            className="px-10 py-7 text-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
            data-testid="button-start-playing"
          >
            {isReady ? (
              <>
                <Sparkles className="w-6 h-6 mr-2" />
                Start Playing
              </>
            ) : (
              "Loading..."
            )}
          </Button>
        </motion.div>

        {/* Scroll hint */}
        <AnimatePresence>
          {showScrollHint && (
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 10, 0] }}
              exit={{ opacity: 0 }}
              transition={{ y: { duration: 1.5, repeat: Infinity } }}
            >
              <div className="flex flex-col items-center text-muted-foreground">
                <span className="text-sm mb-2">Scroll to learn more</span>
                <ChevronDown className="w-6 h-6" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Video Showcase Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-display font-semibold text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Meet the Animals
          </motion.h2>
          <motion.p
            className="text-center text-muted-foreground mb-10 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Watch stunning wildlife footage and discover incredible creatures!
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <VideoCard
                src={lionVideo}
                title="King of the Savanna"
                description="Learn about majestic lions and their incredible hunting skills"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <VideoCard
                src={dolphinsVideo}
                title="Ocean Acrobats"
                description="Discover the playful world of dolphins and marine life"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Screenshot Preview Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-display font-semibold text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            See It In Action
          </motion.h2>
          <motion.p
            className="text-center text-muted-foreground mb-10 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Beautiful quiz cards, engaging questions, and instant feedback make learning fun!
          </motion.p>

          <motion.div
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <img
              src={screenshotImage}
              alt="Animal Kingdom Quiz gameplay preview"
              className="w-full h-auto"
              data-testid="img-screenshot-preview"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </section>
    </>
  );
}

// ========== COLLAGE VERSION ==========
function CollageHero({ onStart, isReady }: { onStart: () => void; isReady: boolean }) {
  return (
    <>
      {/* Hero Section with Animal Collage */}
      <section className="relative min-h-screen flex flex-col">
        {/* Collage Grid */}
        <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 grid-rows-2 gap-1">
            {/* First row */}
            <motion.div 
              className="relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <img 
                src={animalImages[0].src} 
                alt={animalImages[0].alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                {animalImages[0].pack}
              </div>
            </motion.div>
            
            <motion.div 
              className="relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <VideoTile src={lionVideo} poster="/media/mammals/lion.jpg" />
              <div className="absolute bottom-1 left-1 bg-primary/80 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                <Play className="w-3 h-3" /> Video
              </div>
            </motion.div>
            
            <motion.div 
              className="relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <img 
                src={animalImages[2].src} 
                alt={animalImages[2].alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                {animalImages[2].pack}
              </div>
            </motion.div>
            
            <motion.div 
              className="relative overflow-hidden hidden md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <img 
                src={animalImages[3].src} 
                alt={animalImages[3].alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                {animalImages[3].pack}
              </div>
            </motion.div>
            
            <motion.div 
              className="relative overflow-hidden hidden lg:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <img 
                src={animalImages[4].src} 
                alt={animalImages[4].alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                {animalImages[4].pack}
              </div>
            </motion.div>

            {/* Second row */}
            <motion.div 
              className="relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <img 
                src={animalImages[5].src} 
                alt={animalImages[5].alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                {animalImages[5].pack}
              </div>
            </motion.div>
            
            <motion.div 
              className="relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <img 
                src={animalImages[6].src} 
                alt={animalImages[6].alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                {animalImages[6].pack}
              </div>
            </motion.div>
            
            <motion.div 
              className="relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <VideoTile src={dolphinsVideo} poster="/media/fish/clownfish.jpg" />
              <div className="absolute bottom-1 left-1 bg-primary/80 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                <Play className="w-3 h-3" /> Video
              </div>
            </motion.div>
            
            <motion.div 
              className="relative overflow-hidden hidden md:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <img 
                src={animalImages[8].src} 
                alt={animalImages[8].alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                {animalImages[8].pack}
              </div>
            </motion.div>
            
            <motion.div 
              className="relative overflow-hidden hidden lg:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <img 
                src={animalImages[9].src} 
                alt={animalImages[9].alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                {animalImages[9].pack}
              </div>
            </motion.div>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
        </div>

        {/* Title and CTA overlay */}
        <div className="relative -mt-32 md:-mt-40 z-10 px-4 pb-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Title with background blur */}
            <motion.div
              className="bg-background/80 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-display font-semibold text-foreground mb-2">
                Animal Kingdom
              </h1>
              <p className="text-2xl md:text-4xl font-display font-medium text-primary mb-4">
                Quiz
              </p>
              <p className="text-lg text-muted-foreground mb-6 max-w-lg mx-auto">
                Learn amazing facts about animals from around the world through fun, interactive quizzes!
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  10 Packs
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Star className="w-4 h-4 mr-2" />
                  186 Questions
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <Award className="w-4 h-4 mr-2" />
                  20+ Badges
                </Badge>
              </div>

              <Button
                size="lg"
                onClick={onStart}
                disabled={!isReady}
                className="px-10 py-7 text-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
                data-testid="button-start-playing"
              >
                {isReady ? (
                  <>
                    <Sparkles className="w-6 h-6 mr-2" />
                    Start Playing
                  </>
                ) : (
                  "Loading..."
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

// ========== SHARED SECTIONS ==========
function SharedSections({ onStart, isReady }: { onStart: () => void; isReady: boolean }) {
  const features = [
    {
      icon: Brain,
      title: "10 Animal Packs",
      description: "Mammals, Birds, Reptiles, Fish, Amphibians, Insects, Big Cats, Sharks, Jungle & Arctic"
    },
    {
      icon: Star,
      title: "186 Quiz Questions",
      description: "Each with amazing facts, photos, and videos"
    },
    {
      icon: Users,
      title: "1-4 Players",
      description: "Play solo or challenge friends and family"
    },
    {
      icon: Trophy,
      title: "20+ Badges",
      description: "Unlock achievements as you learn"
    },
    {
      icon: Zap,
      title: "Daily Challenges",
      description: "New quiz every day with bonus rewards"
    },
    {
      icon: Volume2,
      title: "Audio & Speech",
      description: "Questions read aloud for all ages"
    },
    {
      icon: Target,
      title: "XP & Levels",
      description: "Track your progress from Curious Cub to Animal Master"
    },
    {
      icon: Smartphone,
      title: "Works Offline",
      description: "Play anywhere as a Progressive Web App"
    }
  ];

  return (
    <>
      {/* What's Included Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
              What's Included
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Everything you need for hours of educational fun
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover-elevate">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Animal Packs Grid */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
              10 Animal Packs to Explore
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              From the African savanna to the Arctic ice
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { name: "Mammals", icon: "🦁", count: 20 },
              { name: "Birds", icon: "🦅", count: 20 },
              { name: "Reptiles", icon: "🦎", count: 20 },
              { name: "Fish", icon: "🐠", count: 18 },
              { name: "Amphibians", icon: "🐸", count: 18 },
              { name: "Insects", icon: "🦋", count: 18 },
              { name: "Big Cats", icon: "🐯", count: 18 },
              { name: "Sharks", icon: "🦈", count: 18 },
              { name: "Jungle", icon: "🌴", count: 18 },
              { name: "Arctic", icon: "❄️", count: 18 },
            ].map((pack, index) => (
              <motion.div
                key={pack.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover-elevate text-center p-4">
                  <div className="text-3xl mb-2">{pack.icon}</div>
                  <h3 className="font-semibold text-sm">{pack.name}</h3>
                  <p className="text-xs text-muted-foreground">{pack.count} questions</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Checklist */}
      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
              Perfect for All Ages
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Kids mode with hints and friendly feedback",
              "Adults mode for a real challenge",
              "Multiplayer for family game night",
              "Daily challenges with bonus rewards",
              "Earn coins and unlock badges",
              "Track your progress and stats",
              "Text-to-speech reads questions aloud",
              "Works offline - play anywhere",
              "Beautiful animal photos and videos",
              "Learn fascinating animal facts",
            ].map((item, index) => (
              <motion.div
                key={item}
                className="flex items-center gap-3 p-3 bg-background rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of animal lovers and test your knowledge today!
            </p>
            <Button
              size="lg"
              onClick={onStart}
              disabled={!isReady}
              className="px-10 py-7 text-xl font-semibold shadow-lg"
              data-testid="button-start-playing-bottom"
            >
              {isReady ? (
                <>
                  <Trophy className="w-6 h-6 mr-2" />
                  Start Playing Now
                </>
              ) : (
                "Loading..."
              )}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <p>Animal Kingdom Quiz - Learn about amazing animals through fun quizzes!</p>
          <p className="mt-2">Works offline as a Progressive Web App</p>
        </div>
      </footer>
    </>
  );
}

// ========== MAIN LANDING PAGE ==========
export function LandingPage({ onStart, isReady }: LandingPageProps) {
  const [designVersion, setDesignVersion] = useState<"mascot" | "collage">("collage");

  return (
    <div className="min-h-screen bg-background">
      {/* Design Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <Card className="p-1 shadow-lg">
          <div className="flex gap-1">
            <Button
              variant={designVersion === "mascot" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDesignVersion("mascot")}
              className="gap-2"
              data-testid="button-design-mascot"
            >
              <Image className="w-4 h-4" />
              Mascot
            </Button>
            <Button
              variant={designVersion === "collage" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDesignVersion("collage")}
              className="gap-2"
              data-testid="button-design-collage"
            >
              <LayoutGrid className="w-4 h-4" />
              Collage
            </Button>
          </div>
        </Card>
      </div>

      {/* Render selected design */}
      <AnimatePresence mode="wait">
        {designVersion === "mascot" ? (
          <motion.div
            key="mascot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MascotHero onStart={onStart} isReady={isReady} />
          </motion.div>
        ) : (
          <motion.div
            key="collage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CollageHero onStart={onStart} isReady={isReady} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shared sections for both designs */}
      <SharedSections onStart={onStart} isReady={isReady} />
    </div>
  );
}
