import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Coins, Lock, Check, Palette, Package, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface ShopTheme {
  id: string;
  name: string;
  price: number;
  colors: {
    primary: string;
    accent: string;
  };
  description: string;
}

interface ShopPack {
  id: string;
  name: string;
  price: number;
  description: string;
  questionCount: number;
  icon: string;
}

const SHOP_THEMES: ShopTheme[] = [
  {
    id: "forest",
    name: "Forest Green",
    price: 0,
    colors: { primary: "#22c55e", accent: "#16a34a" },
    description: "A natural forest theme (Free)",
  },
  {
    id: "royal",
    name: "Royal Purple",
    price: 50,
    colors: { primary: "#8b5cf6", accent: "#7c3aed" },
    description: "A regal purple theme",
  },
  {
    id: "safari",
    name: "Safari Red",
    price: 50,
    colors: { primary: "#ef4444", accent: "#dc2626" },
    description: "A bold safari adventure theme",
  },
  {
    id: "ocean",
    name: "Ocean Blue",
    price: 50,
    colors: { primary: "#3b82f6", accent: "#2563eb" },
    description: "A calming ocean theme",
  },
  {
    id: "sunset",
    name: "Sunset Orange",
    price: 75,
    colors: { primary: "#f97316", accent: "#ea580c" },
    description: "A warm sunset theme",
  },
  {
    id: "midnight",
    name: "Midnight",
    price: 100,
    colors: { primary: "#1e293b", accent: "#0f172a" },
    description: "A sleek dark theme",
  },
  {
    id: "rainbow",
    name: "Rainbow",
    price: 150,
    colors: { primary: "#ec4899", accent: "#8b5cf6" },
    description: "A vibrant multicolor theme",
  },
];

const PREMIUM_PACKS: ShopPack[] = [
  {
    id: "dinosaurs",
    name: "Dinosaurs",
    price: 200,
    description: "Journey back in time with prehistoric creatures!",
    questionCount: 20,
    icon: "Dino",
  },
  {
    id: "ocean-creatures",
    name: "Deep Sea",
    price: 200,
    description: "Explore the mysterious depths of the ocean!",
    questionCount: 20,
    icon: "Fish",
  },
  {
    id: "endangered",
    name: "Endangered Species",
    price: 250,
    description: "Learn about animals that need our protection",
    questionCount: 25,
    icon: "Heart",
  },
  {
    id: "australian",
    name: "Australian Wildlife",
    price: 150,
    description: "Discover unique creatures from Down Under!",
    questionCount: 15,
    icon: "Kangaroo",
  },
];

interface ShopProps {
  coins: number;
  unlockedThemes: string[];
  unlockedPacks: string[];
  onBack: () => void;
  onPurchaseTheme: (themeId: string, price: number) => void;
  onPurchasePack: (packId: string, price: number) => void;
}

export function Shop({
  coins,
  unlockedThemes,
  unlockedPacks,
  onBack,
  onPurchaseTheme,
  onPurchasePack,
}: ShopProps) {
  const { toast } = useToast();

  const handlePurchaseTheme = (theme: ShopTheme) => {
    if (coins < theme.price) {
      toast({
        title: "Not Enough Coins",
        description: `You need ${theme.price - coins} more coins to unlock ${theme.name}`,
        variant: "destructive",
      });
      return;
    }
    onPurchaseTheme(theme.id, theme.price);
    toast({
      title: "Theme Unlocked!",
      description: `You unlocked the ${theme.name} theme!`,
    });
  };

  const handlePurchasePack = (pack: ShopPack) => {
    if (coins < pack.price) {
      toast({
        title: "Not Enough Coins",
        description: `You need ${pack.price - coins} more coins to unlock ${pack.name}`,
        variant: "destructive",
      });
      return;
    }
    onPurchasePack(pack.id, pack.price);
    toast({
      title: "Pack Unlocked!",
      description: `You unlocked the ${pack.name} pack! (Coming Soon)`,
    });
  };

  return (
    <div className="min-h-screen bg-background" data-testid="shop">
      <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} data-testid="button-back-from-shop">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-display font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Shop
        </h1>
        <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full">
          <Coins className="w-4 h-4 text-amber-500" />
          <span className="font-semibold text-amber-700 dark:text-amber-400" data-testid="text-shop-coins">
            {coins}
          </span>
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto space-y-8">
        {/* Themes Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Color Themes</h2>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SHOP_THEMES.map((theme, index) => {
              const isUnlocked = unlockedThemes.includes(theme.id);
              const canAfford = coins >= theme.price;
              
              return (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={`overflow-hidden ${!isUnlocked && !canAfford ? "opacity-75" : ""}`}
                    data-testid={`card-theme-${theme.id}`}
                  >
                    <div 
                      className="h-16"
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})` 
                      }}
                    />
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold">{theme.name}</h3>
                          <p className="text-sm text-muted-foreground">{theme.description}</p>
                        </div>
                        {isUnlocked ? (
                          <Badge variant="secondary" className="shrink-0">
                            <Check className="w-3 h-3 mr-1" />
                            Owned
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="shrink-0">
                            <Coins className="w-3 h-3 mr-1" />
                            {theme.price}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    {!isUnlocked && (
                      <CardFooter className="p-4 pt-0">
                        <Button
                          className="w-full"
                          disabled={!canAfford}
                          onClick={() => handlePurchaseTheme(theme)}
                          data-testid={`button-buy-theme-${theme.id}`}
                        >
                          {canAfford ? (
                            <>Unlock Theme</>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 mr-2" />
                              {theme.price - coins} more coins
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Premium Packs Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Premium Packs</h2>
            <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {PREMIUM_PACKS.map((pack, index) => {
              const isUnlocked = unlockedPacks.includes(pack.id);
              const canAfford = coins >= pack.price;
              
              return (
                <motion.div
                  key={pack.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <Card 
                    className={`${!isUnlocked && !canAfford ? "opacity-75" : ""}`}
                    data-testid={`card-pack-${pack.id}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-base">{pack.name}</CardTitle>
                          <CardDescription>{pack.description}</CardDescription>
                        </div>
                        {isUnlocked ? (
                          <Badge variant="secondary" className="shrink-0">
                            <Check className="w-3 h-3 mr-1" />
                            Owned
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="shrink-0">
                            <Coins className="w-3 h-3 mr-1" />
                            {pack.price}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-sm text-muted-foreground">
                        {pack.questionCount} questions
                      </p>
                    </CardContent>
                    {!isUnlocked && (
                      <CardFooter className="p-4 pt-0">
                        <Button
                          className="w-full"
                          variant="outline"
                          disabled={!canAfford}
                          onClick={() => handlePurchasePack(pack)}
                          data-testid={`button-buy-pack-${pack.id}`}
                        >
                          {canAfford ? (
                            <>Unlock Pack (Coming Soon)</>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 mr-2" />
                              {pack.price - coins} more coins
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* How to Earn Coins */}
        <section className="bg-muted/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-500" />
            How to Earn Coins
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Answer questions correctly (+1 coin each)</li>
            <li>Complete daily challenges (+10 coins)</li>
            <li>Maintain streaks (3-10 bonus coins)</li>
            <li>Earn badges (coin rewards vary)</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
