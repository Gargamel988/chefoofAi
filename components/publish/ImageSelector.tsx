"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, X, Image as ImageIcon, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { getSafePublicUrl } from "@/lib/utils/storage";

interface ImageSelectorProps {
  currentImage?: string;
  onImageSelected: (url: string) => void;
  userId: string;
}

export default function ImageSelector({ currentImage, onImageSelected, userId }: ImageSelectorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dosya boyutu 5 MB'ı geçemez.");
      return;
    }

    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const path = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("cover_image")
        .upload(path, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("cover_image")
        .getPublicUrl(path);

      const safeUrl = getSafePublicUrl(publicUrl);
      setPreview(safeUrl);
      onImageSelected(safeUrl);
      toast.success("Fotoğraf stüdyoya eklendi! ✨");
    } catch (error: any) {
      toast.error("Yükleme hatası: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(undefined);
    onImageSelected("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="relative group/selector">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div 
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative aspect-4/3 sm:aspect-video rounded-[2.5rem] overflow-hidden bg-zinc-900 ring-1 ring-white/5 shadow-2xl group/img"
          >
            <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" />
            
            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover/img:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="rounded-2xl h-12 px-6 bg-white/90 hover:bg-white text-black font-black uppercase text-xs tracking-widest shadow-xl"
              >
                <Upload className="w-4 h-4 mr-2" /> Değiştir
              </Button>
              <Button 
                size="lg" 
                variant="destructive" 
                onClick={removeImage}
                disabled={isUploading}
                className="rounded-2xl h-12 px-6 bg-red-500/80 hover:bg-red-500 text-white font-black uppercase text-xs tracking-widest shadow-xl backdrop-blur-md border-0"
              >
                <X className="w-4 h-4 mr-2" /> Kaldır
              </Button>
            </div>

            {/* Premium Badge */}
            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-xl px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/10">
                <Sparkles className="w-3 h-3 text-orange-500" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Kapak Fotoğrafı</span>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full aspect-4/3 sm:aspect-video rounded-[2.5rem] border-2 border-dashed border-white/10 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-orange-500/30 transition-all flex flex-col items-center justify-center gap-6 relative group/btn backdrop-blur-md overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-orange-500/0 group-hover/btn:bg-orange-500/5 transition-colors" />
            
            {isUploading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">Yükleniyor...</p>
              </div>
            ) : (
              <>
                <div className="relative">
                    <div className="absolute inset-0 bg-orange-500 blur-xl opacity-20 group-hover/btn:opacity-40 transition-opacity" />
                    <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center relative shadow-2xl group-hover/btn:scale-110 transition-transform duration-500">
                        <Camera className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
                <div className="text-center relative z-10 space-y-2">
                  <p className="text-lg font-black text-white tracking-tighter">Görsel Seçin</p>
                  <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest max-w-[240px] leading-relaxed">
                    Yüksek kaliteli fotoğraflar tarifinizin <span className="text-orange-500/60">vitrini</span> gibidir.
                  </p>
                </div>
              </>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
