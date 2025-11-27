import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowLeft, Play, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuizItem, Pack } from "@shared/schema";

interface FavoritesGalleryProps {
  favoriteIds: string[];
  packs: Pack[];
  onBack: () => void;
  onRemoveFavorite: (questionId: string) => void;
  onPracticeFavorites: () => void;
}

export function FavoritesGallery({
  favoriteIds,
  packs,
  onBack,
  onRemoveFavorite,
  onPracticeFavorites,
}: FavoritesGalleryProps) {
  const baseUrl = import.meta.env.BASE_URL || "/";
  const getMediaUrl = (path?: string) => (path ? `${baseUrl}${path}` : undefined);

  const getFavoriteQuestions = (): { item: QuizItem; packName: string }[] => {
    const favorites: { item: QuizItem; packName: string }[] = [];
    
    for (const pack of packs) {
      for (const item of pack.items) {
        if (favoriteIds.includes(item.id)) {
          favorites.push({ item, packName: pack.name });
        }
      }
    }
    
    return favorites;
  };

  const favorites = getFavoriteQuestions();

  return (
    <div className="min-h-screen bg-background" data-testid="favorites-gallery">
      <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} data-testid="button-back-from-favorites">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-display font-semibold flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          Favorites
        </h1>
        <div className="w-20">
          {favorites.length > 0 && (
            <Button 
              size="sm" 
              onClick={onPracticeFavorites}
              data-testid="button-practice-favorites"
            >
              <Play className="w-4 h-4 mr-1" />
              Practice
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 max-w-4xl mx-auto">
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Favorites Yet</h2>
            <p className="text-muted-foreground">
              Tap the heart icon during a quiz to save your favorite animals!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {favorites.length} favorite{favorites.length !== 1 ? "s" : ""} saved
            </p>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {favorites.map(({ item, packName }, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden" data-testid={`card-favorite-${item.id}`}>
                      {item.media?.image && (
                        <div className="aspect-video bg-muted">
                          <img
                            src={getMediaUrl(item.media.image)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{item.name}</h3>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {packName}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveFavorite(item.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                            data-testid={`button-remove-favorite-${item.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {item.fact}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Favorite button for quiz card
interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
}

export function FavoriteButton({ isFavorite, onToggle, size = "md" }: FavoriteButtonProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`${
        isFavorite
          ? "text-red-500 hover:text-red-600"
          : "text-muted-foreground hover:text-red-500"
      }`}
      data-testid="button-toggle-favorite"
    >
      <motion.div
        initial={false}
        animate={isFavorite ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`${sizeClasses[size]} ${isFavorite ? "fill-current" : ""}`}
        />
      </motion.div>
    </Button>
  );
}
